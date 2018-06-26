import {test, TestContext} from "ava";
import {By, snap, Snappit, IConfig, WebDriver, WebElement} from "snappit-visual-regression";

import * as util from "../common/util";

export async function regressionTest(browser: string, component: string) {
    
    const config: IConfig = {
        browser: browser,
        threshold: 0.1,
    };

    test(`${browser} -- ${component}`, async t => {
        const snappit = new Snappit(config);
        const driver = await snappit.start();
        await util.go(driver, component);
        for (const e of await driver.findElements(By.css(util.selectors.visreg))) {
            const sectionName = await e.getAttribute("data-visreg");
            t.log(`  ${sectionName}:`);
            await util.snapshot(t, e as WebElement);
            t.log("    ✔ DOM Snapshot");
        }
        await snappit.stop();
    });
}
