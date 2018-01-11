import * as child_process from "child_process";

import {$, By, snap, Snappit, IConfig, WebDriver, WebElement} from "snappit-visual-regression";

import {test, TestContext} from "ava";

import * as util from "../common/util";

const grepCommand = 'grep "\\bdata-visreg=" -r ../docs | grep "index\.html"';
const taggedForRegression = child_process.execSync(grepCommand).toString().trim();

const componentExtractor = new RegExp("(\\w+/[\\w-]+)/index\\.html", "gm");
let matches: string[] = [];
let matched: RegExpExecArray;
while (matched = componentExtractor.exec(taggedForRegression)) {
    matches.push(matched[1]);
}

const regressionTest = async (t: TestContext, config: IConfig, component: string) => {
    const snappit = new Snappit(config);
    const driver = await snappit.start();

    await util.go(driver, component);
    for (const e of await driver.findElements(By.css(util.selectors.visreg))) {
        const sectionName = await e.getAttribute("data-visreg");
        t.log(`  ${sectionName}:`);
        await util.snapshot(t, e);
        t.log("    ✔ DOM Snapshot");
        await snappit.snap(`{browserName}/${sectionName}`, e as WebElement);
        t.log("    ✔ Image Snapshot");
    }

    await snappit.stop();
}

const config: IConfig = {
    browser: "",
    screenshotsDir: "artifacts/regressionScreenshots",
    logException: [
        "MISMATCH",
        "NO_BASELINE",
        "SIZE_DIFFERENCE",
    ],
    threshold: 0.1,
    headless: true,
    initialViewportSize: [1366, 768],
};

for (const component of matches) {

    test(`firefox auto-generated regression case: ${component}`, async t => {
        config.browser = "firefox";
        await regressionTest(t, config, component);
    });

    test(`chrome auto-generated regression case: ${component}`, async t => {
        config.browser = "chrome";
        await regressionTest(t, config, component);
    });

}
