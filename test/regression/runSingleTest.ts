import {test, TestContext} from "ava";
import {By, snap, Snappit, IConfig, WebDriver, WebElement} from "snappit-visual-regression";

import * as util from "../common/util";


export async function regressionTest(browser: string, component: string, buildIdentifier: string) {
    const runningSauce = process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY;
    interface IResolutions {
        [key:string]: string
        firefox: string;
        chrome: string;
        safari: string;
        "internet explorer": string;
        MicrosoftEdge: string;
    }

    const screenResolution = "1600x1200";

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
        firefox: "Windows 10",
        chrome: MAC,
        safari: MAC,
        "internet explorer": "Windows 10",
        MicrosoftEdge: "Windows 10"
    };
    const platform = platforms[browser];

    const config: IConfig = {
        browser: browser,
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
        }
    };

    test(`${browser} on ${platform} -- ${component}`, async t => {
        
        if (runningSauce) {
            config.serverUrl = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`;
            config.sauceLabs.name = component;
            config.sauceLabs.build = process.env.TRAVIS_JOB_NUMBER || buildIdentifier;
            config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        }

        const snappit = new Snappit(config);
        const driver = await snappit.start();
        await util.go(driver, component);

        try {
            const domDiffNodes = await driver.findElements(By.css(util.selectors.domDiff));
            for (const e of domDiffNodes) {
                const sectionName = await e.getAttribute("data-dom-diff");
                t.log(`  ${sectionName}:`);
                await util.snapshot(t, e as WebElement);
                t.log("    ✔ DOM Snapshot");
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
