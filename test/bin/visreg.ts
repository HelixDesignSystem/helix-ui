import * as fs from "fs";
import * as url from "url";

import {
    IOptions,
    input,
    password,
} from "inquirer-shortcuts"

import * as opn from "opn"


async function visreg(

): Promise<void> {
    const options: IOptions = {
        default: "master",
        message: "Baseline branch? (master)",
    };

    const branch = await input("branch", options);

    const f = ".github-token";

    const storedToken = fs.existsSync(f) && fs.readFileSync("./.github-token");
    const githubToken = (storedToken || (await password("github PAT")));
    if (!(/[a-f0-9]{40}/).test(githubToken)) {
        opn("https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/");
        throw new Error("Invalid Token");
    }
    // save it to .github-token if it doesn't already exist
}

visreg()
    .then(() => { console.log("Goodbye!"); process.exit(0); })
    .catch(err => { console.log(err.message); process.exit(1); });
