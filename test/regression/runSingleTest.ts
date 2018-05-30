import {test, TestContext} from "ava";
import {By, snap, Snappit, IConfig, WebDriver, WebElement} from "snappit-visual-regression";

import * as util from "../common/util";


export async function regressionTest(browser: string, component: string) {
    interface IResolutions {
        [key:string]: string
        firefox: string;
        chrome: string;
        safari: string;
        "internet explorer": string;
        MicrosoftEdge: string;
    }

    const screenResolutions: IResolutions = {
        firefox: "1920x1440",
        chrome: "1920x1440",
        safari: "1920x1440",
        "internet explorer": "1920x1080",
        MicrosoftEdge: "1920x1080"
    }
    const screenResolution = screenResolutions[browser];


    interface IPlatforms {
        [key: string]: string
        firefox: string;
        chrome: string;
        safari: string;
        "internet explorer": string;
        MicrosoftEdge: string;
    }

    const MAC = "macOS 10.13";
    const platforms: IPlatforms = {
        firefox: MAC,
        chrome: MAC,
        safari: MAC,
        "internet explorer": "Windows 8.1",
        MicrosoftEdge: "Windows 10"
    };
    const platform = platforms[browser];

    const config: IConfig = {
        browser: browser,
        screenshotsDir: "artifacts/regressionScreenshots",
        logException: [
            "MISMATCH",
            "NO_BASELINE",
            "SIZE_DIFFERENCE",
        ],
        sauceLabs: {
            platform: platform,
            version: "latest",
            screenResolution: screenResolution,
            extendedDebugging: true,
            maxDuration: 120,
        },
        threshold: 0.1,
    };

    test(`${browser} on ${platform} -- auto-generated regression case: ${component}`, async t => {
        const runningSauce = process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY;
        const LOCAL_DEV_ID = `local-dev-test-${new Date().toISOString()}`;
        if (runningSauce) {
            config.serverUrl = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`;
            config.sauceLabs.name = component;
            config.sauceLabs.build = process.env.TRAVIS_JOB_NUMBER || LOCAL_DEV_ID;
            config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        }

        const snappit = new Snappit(config);
        const driver = await snappit.start();
        await util.go(driver, component);

        try {
            for (const e of await driver.findElements(By.css(util.selectors.visreg))) {
                const sectionName = await e.getAttribute("data-visreg");
                t.log(`  ${sectionName}:`);
                await util.snapshot(t, e as WebElement);
                t.log("    ✔ DOM Snapshot");

                if (!process.env.CI) {
                    // this is really not worth it for saucelabs, you can just look at the run results anyway
                    await snappit.snap(`{browser}/${sectionName}`, e);
                    t.log("    ✔ Image Snapshot");
                }
            }

            runningSauce && await snappit.setSauceLabsJobResult(true);
        } catch (e) {
            runningSauce && await snappit.setSauceLabsJobResult(false);
            t.fail(e);
        } finally {
            await snappit.stop();
        }
    });
}
