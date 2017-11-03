import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {WebDriver, WebElementPromise} from "selenium-webdriver";

import * as util from "../common/util";
import {test} from "ava";

export function suite(browserName: string) {
    let snappit: Snappit;
    let driver: WebDriver;
    let nav: WebElementPromise;

    test.before(async () => {
        const config: IConfig = {
            browser: browserName,
            screenshotsDir: "visreg/screenshots",
            logException: [
                "MISMATCH",
                "NO_BASELINE",
                "SIZE_DIFFERENCE",
            ],
            threshold: 0.1,
            useDirect: true,
            useGeckoDriver: (browserName === "firefox"),
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
        await util.setViewportSize(driver, { width: 1366, height: 768 });
        await driver.get(util.baseUrl);
    });

    test("nav", async () => {
        await snap("{browserName}/nav", $(util.selectors.nav));
        await util.$x(driver, "//nav/hx-reveal//header", "Guides").click();
        await snap("{browserName}/nav/guides", $(util.selectors.nav));
        await util.$x(driver, "//nav/hx-reveal//header", "Components").click();
        await snap("{browserName}/nav/components", $(util.selectors.nav));
    });

    test("buttons", async () => {
        await util.go(driver, "button");
        await snap("{browserName}/buttons", $(util.selectors.visreg));
    });

    test("checkbox", async () => {
        await util.go(driver, "checkbox");
        await snap("{browserName}/checkboxes", $(util.selectors.visreg));
    });

    test.after.always(async () => {
        await snappit.stop();
    });
}
