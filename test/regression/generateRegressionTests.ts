import * as child_process from "child_process";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {WebDriver, By, WebElement, WebElementPromise} from "selenium-webdriver";

import {test, TestContext} from "ava";

import * as util from "../common/util";

let snappit: Snappit;
let driver: WebDriver;

const grepCommand = 'grep "\\bdata-visreg=" ../source/components/**/*.html';
const taggedForRegression = child_process.execSync(grepCommand).toString().trim();

const componentExtractor = /\.\.\/source\/components\/(\w+)\/index\.html/gm;
let matches: string[] = [];
let matched: RegExpExecArray;
while (matched = componentExtractor.exec(taggedForRegression)) {
    matches.push(matched[1]);
}

test.before(async () => {
    const config: IConfig = {
        browser: "firefox",
        screenshotsDir: "regression/screenshots",
        logException: [
            "MISMATCH",
            "NO_BASELINE",
            "SIZE_DIFFERENCE",
        ],
        threshold: 0.1,
        useDirect: true,
    };

    snappit = new Snappit(config);
    driver = await snappit.start();
    await util.go(driver, "button");
});

let component: string;
for (component of matches) {
    test(`auto-generated regression case: ${component}`, async t => {
        await util.go(driver, component);
        let e: WebElement;
        for (e of await driver.findElements(By.css(util.selectors.visreg))) {
            const sectionName = await e.getAttribute("data-visreg");
            await util.snapshot(t, e);
            await snap(sectionName, e as WebElementPromise);
        }
    });
}

test.after.always(async () => {
    await snappit.stop();
});
