import * as fs from "fs";
import * as url from "url";
import * as child_process from "child_process";

import {
    IOptions,
    input,
    password,
} from "inquirer-shortcuts"

import * as opn from "opn"


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
    // get git info to find their anonymous repo
    const githubUser = "andr6283";
    const anonymousRepo = "catalog-helix-ui-0";
    const repoUrl = url.parse(`https://github.rackspace.com/${githubUser}/${anonymousRepo}`);

    // console.log(`Generating baseline from ${branch}...`);

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

        return flags.join(' ');
    };

    // check github creds here by asking github api for all repos for user
    function repositoryExists(repoUrl: url.Url) {
        let u =  buildApiUrl(repoUrl, `/repos${repoUrl.pathname}`);
        let output = safeExecSync(`curl ${buildCurlFlags()} ${u.href} 2>/dev/null`).toString('utf-8');
        let repositoryInfo = JSON.parse(output);
        return repositoryInfo.message !== 'Not Found';
    };

    if (!repositoryExists(repoUrl)) {
        throw new Error("No repo");
    }

}

visreg()
    .then(() => { console.log("Goodbye!"); process.exit(0); })
    .catch(err => { console.log(err.message); process.exit(0); });
