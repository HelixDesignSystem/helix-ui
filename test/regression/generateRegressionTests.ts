import * as child_process from "child_process";

import {$, By, snap, Snappit, IConfig, WebDriver, WebElement} from "snappit-visual-regression";

import {test, TestContext} from "ava";

import * as util from "../common/util";

const grepCommand = 'grep "\\bdata-visreg=" -r ../docs | grep ".*\.html"';
const taggedForRegression = child_process.execSync(grepCommand).toString().trim();

const componentExtractor = new RegExp("docs/(.*\\.html)", "gm");
let matches: string[] = [];
let matched: RegExpExecArray;
while (matched = componentExtractor.exec(taggedForRegression)) {
    const match = matched[1];
    if (matches.indexOf(match) < 0) {
        matches.push(match);
    }
}

const regressionTest = async (t: TestContext, config: IConfig, component: string) => {
    if (process.env.CI) {
        config.serverUrl = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`;
        config.sauceLabs.name = component;
        config.sauceLabs.build = process.env.TRAVIS_JOB_NUMBER || `local-dev-test-${new Date().toISOString()}`;
        config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    }

    const snappit = new Snappit(config);
    const driver = await snappit.start();
    await util.go(driver, component);

    try {
        for (const e of await driver.findElements(By.css(util.selectors.visreg))) {
            const sectionName = await e.getAttribute("data-visreg");
            t.log(`  ${sectionName}:`);
            await util.snapshot(t, e);
            t.log("    ✔ DOM Snapshot");
            await snappit.snap(`{browserName}/${sectionName}`, e as WebElement);
            t.log("    ✔ Image Snapshot");
        }
    } catch (e) {
        process.env.CI && await snappit.setSauceLabsJobResult(false);

        await snappit.stop();
        t.fail(e);
    }

    process.env.CI && await snappit.setSauceLabsJobResult(true);
    await snappit.stop();
}

if (process.env.CI) {
    const config: IConfig = {
        browser: "",
        screenshotsDir: "artifacts/regressionScreenshots",
        logException: [
            "MISMATCH",
            "NO_BASELINE",
            "SIZE_DIFFERENCE",
        ],
        sauceLabs: {
            platform: "",
            version: "latest",
            screenResolution: "",
        },
        threshold: 0.1,
        initialViewportSize: [1920, 1440],
    };

    for (const component of matches) {
        const MAC = "macOS 10.13";

        // getting connection timeouts here, skipping for now...maybe this is a transient thing?
        test.skip(`macOS firefox auto-generated regression case: ${component}`, async t => {
            config.browser = "firefox";
            config.sauceLabs.platform = MAC;
            config.sauceLabs.browserName = "firefox";
            config.sauceLabs.screenResolution = "1920x1440";
            await regressionTest(t, config, component);
        });

        test(`macOS chrome auto-generated regression case: ${component}`, async t => {
            config.browser = "chrome";
            config.sauceLabs.platform = MAC;
            config.sauceLabs.browserName = "chrome";
            config.sauceLabs.screenResolution = "1920x1440";
            await regressionTest(t, config, component);
        });

        test(`macOS safari auto-generated regression case: ${component}`, async t => {
            config.browser = "safari";
            config.sauceLabs.platform = MAC;
            config.sauceLabs.browserName = "safari";
            config.sauceLabs.screenResolution = "1920x1440";
            await regressionTest(t, config, component);
        });

        test(`windows 8 ie10 auto-generated regression case: ${component}`, async t => {
            config.browser = "internet explorer";
            config.sauceLabs.platform = "Windows 8.1";
            config.sauceLabs.browserName = "internet explorer";
            config.sauceLabs.screenResolution = "1920x1080";
            await regressionTest(t, config, component);
        });

        test(`windows 10 edge auto-generated regression case: ${component}`, async t => {
            config.browser = "MicrosoftEdge";
            config.sauceLabs.platform = "Windows 10";
            config.sauceLabs.browserName = "MicrosoftEdge";
            config.sauceLabs.screenResolution = "1920x1080";
            await regressionTest(t, config, component);
        });

    }

} else {
    const config: IConfig = {
        browser: "firefox",
        screenshotsDir: "artifacts/regressionScreenshots",
        logException: [
            "MISMATCH",
            "NO_BASELINE",
            "SIZE_DIFFERENCE",
        ],
        headless: true,
        threshold: 0.1,
        initialViewportSize: [1920, 1440],
    };

    for (const component of matches) {
        test(`firefox auto-generated regression case: ${component}`, async t => {
            await regressionTest(t, config, component);
        });
    }
}
