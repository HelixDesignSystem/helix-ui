import * as _ from "lodash";
import {By, ISize, ThenableWebDriver, WebDriver, WebElementPromise} from "selenium-webdriver";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import * as util from "./util";

describe("helix", () => {
    let snappit: Snappit;
    let driver: any;

    describe("firefox", () => {
        beforeAll(async () => {
            const config: IConfig = {
                browser: "firefox",
                screenshotsDir: "screenshots",
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
            await util.setViewportSize(driver, { width: 1366, height: 768 });
            driver.get("http://localhost:3000/");
        });

        it("full-screen", async () => {
            await snap("{browserName}/index");
            // expect(await $("body").isDisplayed()).toBe(true);
        });

        it("nav", async () => {
            await snap("{browserName}/nav", $(util.$.nav));
        });

        it("guides", async () => {
            await util.$x(driver, "//nav/hx-reveal//header", "Guides").click();
            await snap("{browserName}/nav/guides", $(util.$.nav));
        });

        it("components", async () => {
            await util.$x(driver, "//nav/hx-reveal//header", "Components").click();
            await snap("{browserName}/nav/componenets", $(util.$.nav));
        });

        afterAll(async () => {
            await snappit.stop();
        });
    });
});
