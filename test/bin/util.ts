/*
 * Utility functions to de-clutter `visreg.ts`.
 */
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

export const f = "./.github-token";
export const repoUrl = url.parse(`https://${config.githubHostname}/${config.githubUsername}/${config.repo}`);
export const hasCommitRegex = /\[.*([0-9a-f]{7})] Checking in screenshots.../;

export function validateVPN(githubHostname: string) {
   if (githubHostname === "github.rackspace.com") {
        process.stdout.write("Checking connection to VPN...");
        try {
            child_process.execSync("ping -t 3 -c 1 rax.io").toString().match(/1 packets transmitted, 1 packets received/);
        } catch (e) {
            console.log(" ✘");
            console.log("Check your VPN connection and try again.");
            throw new Error(e);
        }
        console.log(" ✔");
    }
}

export async function checkConfig() {
    const javascriptConfig = "./built/bin/visreg.config.js";
    const typescriptConfig = "./bin/visreg.config.ts";

    if (fs.existsSync(javascriptConfig)) {
        const dataJs = fs.readFileSync(javascriptConfig).toString();
        const updateJs = /name1234/.test(dataJs);

        const dataTs = fs.readFileSync(typescriptConfig).toString();
        const updateTs = /name1234/.test(dataTs);

        if (updateJs || updateTs) {
            const options: IOptions = {
                message: "Github username?",
            };

            const name = await input(options.message, options) as string;
            const js = dataJs.replace(/name1234/, name);
            updateJs && fs.writeFileSync(javascriptConfig, js);

            const ts = dataTs.replace(/name1234/, name);
            updateTs && fs.writeFileSync(typescriptConfig, ts);
        }
    }

}

export async function getBranchName(targetBranch: string) {
    const options: IOptions = {
        default: "master",
        message: "Baseline branch?",
    };

    const branch = targetBranch || await input(options.message, options) as string;
    return branch;
}

export async function getGithubToken() {
    const storedToken: any = fs.existsSync(f) && fs.readFileSync(f);
    const token = (storedToken || (await password("github PAT")));

    return token;
}

export async function validateToken(token: string) {
    process.stdout.write("Checking github enterprise PAT...");
    if (!isValidToken(token)) {
        console.log(" ✘");
        opn("https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/");
        throw new Error("Invalid Token");
    }

    fs.writeFileSync(f, token);
    console.log(" ✔");

    return token;
}

export function cmd(command: string) {
    child_process.execSync(`${command}`, { stdio: [0, 1, 2] })
};

export function createBaseline(
    token: string,
    branch: string,
    screenshotsDirectory: string,
    targetBranch: string
) {
    cmd([
        `cd ${screenshotsDirectory}`,
        `git checkout -b ${branch}`,
        "find . -maxdepth 1 -mindepth 1 -type d | grep -v \"./\.git\" | xargs rm -rf",
        "git commit --allow-empty -m \"Baseline.\"",
        "cd -"
    ].join('; '));
    cmd(`git checkout ${targetBranch}; npm run test:visreg`);

    const commit = commitScreenshots(token, screenshotsDirectory, "before").toString();
    const baseCommitMatch = commit.match(hasCommitRegex);
    const baseCommit = baseCommitMatch && baseCommitMatch[1];

    if (!baseCommit) {
        throw new Error("Malformed baseline. Try again with a clean working state, and double check your branches..");
    }

    return baseCommit;
}

export function createDiff(token: string, currentBranch: string, screenshotsDirectory: string) {
    cmd(`git checkout ${currentBranch}; npm run test:visreg`);
    const afterCommitData = commitScreenshots(token, screenshotsDirectory, "after").toString();
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

    return afterCommit;
}

export function pushBranch(token: string, repoUrl: url.Url, branch: string, screenshotsDirectory: string) {
    let pushUrl = `https://${token}@${repoUrl.hostname}/${config.githubUsername}/${config.repo}.git`;
    console.log(`Generating remote screenshot diff...`);
    safeExecSync(token, `cd ${screenshotsDirectory}; git push ${pushUrl} ${branch}  > /dev/null 2>&1`);
};


export function buildApiUrl(repoUrl: url.Url, resource: string) {
    if (repoUrl.hostname !== "github.com") {
        // github enterprise
        return url.parse(`https://${repoUrl.hostname}/api/v3${resource}`);
    }

    return url.parse(`https://api.${repoUrl.hostname}${resource}`);
};


export function safeExecSync(token: string, command: string) {
    try {
        return child_process.execSync(command);
    } catch (e) {
        e.message = e.message.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
        e.stack = e.stack.replace(token, `${token.slice(0, 4)}....${token.slice(-4)}`);
        throw e;
    }
};

export function buildCurlFlags(token: string) {
    const flags = [
        `-H "Authorization: token ${token}"`,
        '-H "User-Agent: snappit"'
    ];

    return flags.join(" ");
};

export function isValidToken(token: string) {
    let u =  buildApiUrl(repoUrl, `/user`);
    let output = safeExecSync(token, `curl ${buildCurlFlags(token)} ${u.href} 2>/dev/null`).toString("utf-8");
    let repositoryInfo = JSON.parse(output);
    return repositoryInfo.message !== "Bad credentials";
}

export function repositoryExists(token: string, repoUrl: url.Url) {
    let u =  buildApiUrl(repoUrl, `/repos${repoUrl.pathname}`);
    let output = safeExecSync(token, `curl ${buildCurlFlags(token)} ${u.href} 2>/dev/null`).toString("utf-8");
    let repositoryInfo = JSON.parse(output);
    return repositoryInfo.message !== "Not Found";
};

export function createRepository(token: string, repoUrl: url.Url) {
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
                if (!repositoryExists(token, repoUrl)) {
                    do {
                        setTimeout(() => {
                            console.log(`Waiting on newly created repository ${repoUrl.href} to appear...`)
                        }, 1000);
                    } while (!repositoryExists(token, repoUrl))
                }
                resolve(`Created a new repository at ${repoUrl.href}`);
            });
        });

        req.write(JSON.stringify(data));

        req.end();
    });

};

export function resetRepository(screenshotsDirectory: string) {
    if (fs.existsSync(`${screenshotsDirectory}/.git`)) {
        // check the current remote in case it's been updated
        const remote = child_process.execSync(`cd ${screenshotsDirectory}; git remote -v | head -n 1`).toString();
        const remoteRegex = new RegExp(`\bgit@${config.githubHostname}:${config.githubUsername}/${config.repo}.git\b`);
        if (!remoteRegex.test(remote)) {
            console.log("Updated screenshots repository detected -- cleaning.");
            cmd("npm run clean:screenshots");
        }
    }
}

export function cloneRepo(token: string, screenshotsDirectory: string, repoUrl: url.Url) {
    let cloneUrl = `https://${token}@${repoUrl.host}${repoUrl.path}.git`;
    console.log(`Cloning a screenshots project into "${path.resolve(screenshotsDirectory)}"`);
    safeExecSync(token, `git clone ${cloneUrl} ${screenshotsDirectory}/ > /dev/null`)

    console.log(`Cloned a screenshots project into "${path.resolve(screenshotsDirectory)}"`);
};

function commitScreenshots(token: string, screenshotsDirectory: string, message: string) {
    let cmds = [
        `cd ${screenshotsDirectory}`,
        `git add -A`,
        `git status -sb`,
        `git commit -m "Checking in screenshots...${message}"`,
        `cd -`
    ];

    return safeExecSync(token, cmds.join('; '));
};


if (require.main === module) {
    checkConfig().catch(e => {
        console.log(e.message);
        process.exit(1);
    });
}
