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

interface IConfig {
    githubEmail: string,
    githubName: string,
    repo: string,
    screenshotsDirectory: string,
    username: string,
};

const config: IConfig = {
    githubEmail: "andrew.yurisich@rackspace.com",
    githubName: "andr6283",
    repo: "catalog-helix-ui-0",
    screenshotsDirectory: "screenshots",
    username: "andr6283",
};

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

): Promise<void> {
    const options: IOptions = {
        default: "master",
        message: "Baseline branch? (master)",
    };

    const branch = await input("branch", options);

    const f = "./.github-token";

    const storedToken: any = fs.existsSync(f) && fs.readFileSync(f);
    const token = (storedToken || (await password("github PAT: ")));
    if (!(/[a-f0-9]{40}/).test(token)) {
        opn("https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/");
        throw new Error("Invalid Token");
    }
    fs.writeFileSync(f, token);

    const repoUrl = url.parse(`https://github.rackspace.com/${config.githubName}/${config.repo}`);

    function safeExecSync(command: string) {
        try {
            return child_process.execSync(command);
        } catch (e) {
            e.message = e.message.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
            e.stack = e.stack.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
            throw e;
        }
    };

    // need to know what token is, it's set up near the top of this block
    const buildCurlFlags = () => {
        const flags = [
            `-H "Authorization: token ${token}"`,
            '-H "User-Agent: snappit"'
        ];

        return flags.join(" ");
    };

    // check github creds here by asking github api for all repos for user
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

    function pushCommit(commit: string) {
        let pushUrl = `https://${token}@${repoUrl.hostname}/${config.githubName}/${config.repo}.git`;

        let sensitiveCommand = [
            `cd ${config.screenshotsDirectory}`,
            `git push ${pushUrl} ${commit}:master  > /dev/null 2>&1`,
            `cd -`
        ].join('; ');

        safeExecSync(sensitiveCommand);
    };


    if (!repositoryExists(repoUrl)) {
        await createRepository(repoUrl);
        // const master = "174fc2f2aef371f0efc9bd1db27cf1ba3b0eec1f";
        // opn(`${repoUrl.href}/commit/${master}`);
    }

    cloneRepo(repoUrl);
    console.log("Creating a new baseline...");
    cmd(`git checkout ${branch}; npm test`);

    const hasCommitRegex = /\[master ([0-9a-f]{7})] Baseline/;
    const baseCommitMatch = commitScreenshots().toString().match(hasCommitRegex);
    const baseCommit = baseCommitMatch && baseCommitMatch[1];

    if (!baseCommit) {
        throw new Error("Malformed baseline. Try again having a clean working state, and double check your branches..");
    }

    cmd(`cd ${config.screenshotsDirectory}; git checkout -b anon-${new Date().valueOf()}; cd -; npm test`);
    const afterCommitData = commitScreenshots().toString();
    const afterCommitMatch = afterCommitData.match(hasCommitRegex);
    const afterCommit = afterCommitMatch && afterCommitMatch[1];

    const unknownError = (!afterCommit && !(/nothing to commit, working tree clean/).test(afterCommitData));
    const nothingToCommit = (!afterCommit && (/nothing to commit, working tree clean/).test(afterCommitData));
    if (nothingToCommit) {
        console.log(afterCommitData);
        cmd("git checkout -;");
        process.exit(0);
    }

    if (unknownError) {
        throw new Error("Something has gone very wrong");
    }

    pushCommit(baseCommit);
    pushCommit(afterCommit);
    console.log(baseCommit);
    console.log(afterCommit);
}

visreg()
    .then(() => { console.log("Goodbye!"); process.exit(0); })
    .catch(err => { console.log(err.message); process.exit(0); });
