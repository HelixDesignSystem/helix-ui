import * as _ from "lodash";
import * as child_process from "child_process";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import * as url from "url";

import {
    IOptions,
    input,
    password,
} from "inquirer-shortcuts"

import * as opn from "opn"

import {config, IConfig} from "./visreg.config";

function cmd(command: string) {
    child_process.execSync(`${command}`, { stdio: [0, 1, 2] })
};

function buildApiUrl(repoUrl: url.Url, resource: string) {
    if (repoUrl.hostname !== "github.com") {
        // github enterprise
        return url.parse(`https://${repoUrl.hostname}/api/v3${resource}`);
    }

    return url.parse(`https://api.${repoUrl.hostname}${resource}`);
};

async function visreg(
    currentBranch: string,
    targetBranch?: string,
): Promise<void> {
    const options: IOptions = {
        default: "master",
        message: "Baseline branch? (master)",
    };

    process.stdout.write("Checking connection to VPN...");
    const online = child_process.execSync("ping -t 3 -c 1 rax.io").toString().match(/1 packets transmitted, 1 packets received/);
    if (_.isEmpty(online)) {
        throw new Error("Check your VPN connection and try again.");
    }
    console.log(" ✔");

    const branch = targetBranch || await input("branch", options) as string;

    const f = "./.github-token";

    const storedToken: any = fs.existsSync(f) && fs.readFileSync(f);
    const token = (storedToken || (await password("github PAT: ")));
    const repoUrl = url.parse(`https://github.rackspace.com/${config.githubName}/${config.repo}`);

    process.stdout.write("Checking github enterprise PAT...");
    if (!isValidToken()) {
        console.log(" ✘");
        opn("https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/");
        throw new Error("Invalid Token");
    }

    fs.writeFileSync(f, token);
    console.log(" ✔");

    function safeExecSync(command: string) {
        try {
            return child_process.execSync(command);
        } catch (e) {
            e.message = e.message.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
            e.stack = e.stack.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
            throw e;
        }
    };

    function buildCurlFlags() {
        const flags = [
            `-H "Authorization: token ${token}"`,
            '-H "User-Agent: snappit"'
        ];

        return flags.join(" ");
    };

    function isValidToken() {
        let u =  buildApiUrl(repoUrl, `/user`);
        let output = safeExecSync(`curl ${buildCurlFlags()} ${u.href} 2>/dev/null`).toString("utf-8");
        let repositoryInfo = JSON.parse(output);
        return repositoryInfo.message !== "Bad credentials";
    }

    function repositoryExists(repoUrl: url.Url) {
        let u =  buildApiUrl(repoUrl, `/repos${repoUrl.pathname}`);
        let output = safeExecSync(`curl ${buildCurlFlags()} ${u.href} 2>/dev/null`).toString("utf-8");
        let repositoryInfo = JSON.parse(output);
        return repositoryInfo.message !== "Not Found";
    };

    const createRepository = (repoUrl: url.Url) => {
        let u =  buildApiUrl(repoUrl, `/user/repos`);
        let data = {
            name: _.last(repoUrl.path.split("/")),
            auto_init: true,
            private: false,
        };

        let options = {
            hostname: u.hostname,
            path: u.path,
            method: "POST",
            headers: {
                "User-Agent": "snappit",
                "Content-Type": "application/json",
                "Authorization": "token " + token
            }
        };

        return new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let data: string[];
                data = [];
                res.on("data", d => { data.push(d.toString())});
                if (res.statusCode !== 201) {
                    res.on("end", () => {
                        const msg = `(HTTP ${res.statusCode}) Something went wrong while creating the repository ${repoUrl.href}:\n${data.join("")}`;
                        throw new Error(msg);
                    });
                }
                res.on("end", () => {
                    if (!repositoryExists(repoUrl)) {
                        do {
                            setTimeout(() => {
                                console.log(`Waiting on newly created repository ${repoUrl.href} to appear...`)
                            }, 1000);
                        } while (!repositoryExists(repoUrl))
                    }
                    resolve(`Created a new repository at ${repoUrl.href}`);
                });
            });

            req.write(JSON.stringify(data));

            req.end();
        });

    };

    function cloneRepo(repoUrl: url.Url) {
        let cloneUrl = `https://${token}@${repoUrl.host}${repoUrl.path}.git`;
        console.log(`Cloning a screenshots project into "${path.resolve(config.screenshotsDirectory)}"`);
        safeExecSync(`git clone ${cloneUrl} screenshots/ > /dev/null`)

        console.log(`Cloned a screenshots project into "${path.resolve(config.screenshotsDirectory)}"`);
    };

    function commitScreenshots() {
        let cmds = [
            `cd ${config.screenshotsDirectory}`,
            `git add -A`,
            `git status -sb`,
            `git commit -m "Baseline"`,
            `cd -`
        ];
        return safeExecSync(cmds.join('; '));

    };

    function pushBranch(branch: string) {
        let pushUrl = `https://${token}@${repoUrl.hostname}/${config.githubName}/${config.repo}.git`;
        console.log(`Generating remote screenshot diff...`);
        safeExecSync(`cd ${config.screenshotsDirectory}; git push ${pushUrl} ${branch}  > /dev/null 2>&1`);
    };

    if (!repositoryExists(repoUrl)) {
        await createRepository(repoUrl);
    }

    if (!fs.existsSync(`${config.screenshotsDirectory}/.git`)) {
        cloneRepo(repoUrl);
    }

    const anonymousBranch = `anon-${new Date().valueOf()}`;
    cmd(`cd ${config.screenshotsDirectory}; git checkout -b ${anonymousBranch}; cd -;`);
    console.log("Creating a new baseline...");
    cmd(`git checkout ${branch}; npm test`);

    const hasCommitRegex = /\[.*([0-9a-f]{7})] Baseline/;
    const baseCommitMatch = commitScreenshots().toString().match(hasCommitRegex);
    const baseCommit = baseCommitMatch && baseCommitMatch[1];

    if (!baseCommit) {
        throw new Error("Malformed baseline. Try again having a clean working state, and double check your branches..");
    }

    cmd(`git checkout ${currentBranch}; npm test`);
    const afterCommitData = commitScreenshots().toString();
    const afterCommitMatch = afterCommitData.match(hasCommitRegex);
    const afterCommit = afterCommitMatch && afterCommitMatch[1];

    const unknownError = (!afterCommit && !(/nothing to commit, working tree clean/).test(afterCommitData));
    const nothingToCommit = (!afterCommit && (/nothing to commit, working tree clean/).test(afterCommitData));
    if (nothingToCommit) {
        console.log(afterCommitData);
        process.exit(0);
    }

    if (unknownError) {
        throw new Error("Something has gone very wrong " + afterCommitData);
    }

    pushBranch(anonymousBranch);
    console.log("Opening remote screenshot diff.");
    opn(`${repoUrl.href}/compare/${baseCommit}...${afterCommit}`);

}

if (require.main === module) {
    const args = Array.prototype.slice.call(process.argv, 2);
    const action = args[1];
    const branch = args;

    const currentBranch = child_process.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    visreg(currentBranch, branch)
        .then(() => { process.exit(0); })
        .catch(err => {
            cmd(`git checkout ${currentBranch}`);
            console.log(err.message);
            process.exit(1);
        });
};
