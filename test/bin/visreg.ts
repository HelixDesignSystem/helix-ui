import * as child_process from "child_process";
import * as fs from "fs";
import * as url from "url";

import * as opn from "opn";

import * as util from "./util";

import {config, IConfig} from "./visreg.config";
const screenshotsDirectory = "artifacts/visregScreenshots";
const repoUrl = url.parse(`https://${config.githubHostname}/${config.githubUsername}/${config.repo}`);

async function prepareRepository(token: string) {
    util.validateVPN(config.githubHostname);

    util.resetRepository(screenshotsDirectory);
    if (!util.repositoryExists(token, repoUrl)) {
        console.log(`Creating a new screenshots repository at ${repoUrl.href}`);
        await util.createRepository(token, repoUrl);
    }

    if (!fs.existsSync(`${screenshotsDirectory}/.git`)) {
        util.cloneRepo(token, screenshotsDirectory, repoUrl);
    }
}

async function visreg(
    currentBranch: string,
    targetBranch?: string,
): Promise<void> {
    const token = await util.validateToken(await util.getGithubToken());
    await prepareRepository(token);
    const branch = await util.getBranchName(targetBranch);

    const anonymousBranch = `anon-${new Date().valueOf()}`;
    console.log("Creating a new baseline...");
    const baseCommit = util.createBaseline(token, anonymousBranch, screenshotsDirectory, branch);
    console.log("Creating screenshot diff...");
    const afterCommit = util.createDiff(token, currentBranch, screenshotsDirectory);
    util.pushBranch(token, repoUrl, anonymousBranch, screenshotsDirectory);
    const remoteUrl = `${repoUrl.href}/compare/${baseCommit}...${afterCommit}`;
    console.log(`Opening remote screenshot diff located at: ${remoteUrl}`);
    opn(remoteUrl);
}

/*
 * This exists as a way of generating a one-off baseline. Why?
 * So you can share the current state of a given branch easily.
 * Run this with `yarn run visreg share`. It'll commit just the current screenshots,
 * and push them up as a singular commit reference and open the commit in your browser.
 */
async function visregNoDiff(currentBranch: string) {
    const token = await util.validateToken(await util.getGithubToken());
    await prepareRepository(token);

    const anonymousBranch = `anon-${new Date().valueOf()}`;
    console.log("Creating a new baseline...");
    const baseCommit = util.createBaseline(token, anonymousBranch, screenshotsDirectory, currentBranch);

    util.pushBranch(token, repoUrl, anonymousBranch, screenshotsDirectory);
    const remoteUrl = `${repoUrl.href}/commit/${baseCommit}`;
    console.log(`Opening remote screenshot diff located at: ${remoteUrl}`);
    opn(remoteUrl);
}

if (require.main === module) {
    const arg = Array.prototype.slice.call(process.argv, 2)[0];
    const currentBranch = child_process.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    let share = "share".indexOf(arg) === 0;

    if (share) {
        visregNoDiff(currentBranch).then(() => { process.exit(0); })
            .catch(err => {
                console.log(err.message);
                process.exit(1);
            });
    } else {
        const branch = arg;

        visreg(currentBranch, branch)
            .then(() => { process.exit(0); })
            .catch(err => {
                child_process.execSync(`git checkout ${currentBranch} > /dev/null 2>&1`);
                console.log(err.message);
                process.exit(1);
            });
    }
};
