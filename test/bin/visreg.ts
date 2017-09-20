import * as child_process from "child_process";
import * as fs from "fs";
import * as url from "url";

import * as opn from "opn"

import * as util from "./util";

import {config, IConfig} from "./visreg.config";
const screenshotsDirectory = "screenshots";

async function visreg(
    currentBranch: string,
    targetBranch?: string,
): Promise<void> {
    if (config.githubHostname === "github.rackspace.com") {
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

    const branch = await util.getBranchName(targetBranch);
    const token = await util.validateToken(await util.getGithubToken());
    const repoUrl = url.parse(`https://${config.githubHostname}/${config.githubName}/${config.repo}`);

    process.exit(0);

    util.resetRepository(screenshotsDirectory);
    if (!util.repositoryExists(token, repoUrl)) {
        console.log(`Creating a new screenshots repository at ${repoUrl.href}`);
        await util.createRepository(token, repoUrl);
    }

    if (!fs.existsSync(`${screenshotsDirectory}/.git`)) {
        util.cloneRepo(token, screenshotsDirectory, repoUrl);
    }

    const anonymousBranch = `anon-${new Date().valueOf()}`;
    console.log("Creating a new baseline...");
    const baseCommit = util.createBaseline(token, anonymousBranch, screenshotsDirectory, targetBranch);
    console.log("Creating screenshot diff...");
    const afterCommit = util.createDiff(token, currentBranch, screenshotsDirectory);
    util.pushBranch(token, repoUrl, anonymousBranch, screenshotsDirectory);
    const remoteUrl = `${repoUrl.href}/compare/${baseCommit}...${afterCommit}`;
    console.log(`Opening remote screenshot diff located at: ${remoteUrl}`);
    opn(remoteUrl);
}

if (require.main === module) {
    const branch = Array.prototype.slice.call(process.argv, 2)[0];
    const currentBranch = child_process.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

    visreg(currentBranch, branch)
        .then(() => { process.exit(0); })
        .catch(err => {
            child_process.execSync(`git checkout ${currentBranch} > /dev/null 2>&1`);
            console.log(err.message);
            process.exit(1);
        });
};
