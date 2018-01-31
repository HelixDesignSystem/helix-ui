import {$, snap, Snappit, IConfig, WebDriver} from "snappit-visual-regression";

import * as util from "../common/util";
import {test} from "ava";

export function suite(browserName: string) {
    let snappit: Snappit;
    let driver: WebDriver;

    test.before(async () => {
        const config: IConfig = {
            browser: browserName,
            screenshotsDir: "artifacts/visregScreenshots",
            logException: [
                "MISMATCH",
                "NO_BASELINE",
                "SIZE_DIFFERENCE",
            ],
            threshold: 0.1,
            headless: true,
            initialViewportSize: [1366, 768],
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
        await driver.get(util.baseUrl);
    });

    test("nav", async () => {
        await snap("{browserName}/nav", $(util.selectors.nav));
    });

    test("nav/guides", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Guides").click();
        await snap("{browserName}/nav/guides", $(util.selectors.nav));
    });

    test("nav/components", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Components").click();
        await snap("{browserName}/nav/components", $(util.selectors.nav));
    });

    test("nav/custom-elements", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Custom Elements").click();
        await snap("{browserName}/nav/custom-elements", $(util.selectors.nav));
    });

    test.after.always(async () => {
        await snappit.stop();
    });
}
