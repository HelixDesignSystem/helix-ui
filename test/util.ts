/*
 * Helper functions for the tests in `index.ts`.
 */
import * as _ from "lodash";
import {By, ISize, ThenableWebDriver, WebDriver, WebElementPromise} from "selenium-webdriver";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

export async function setViewportSize (
    driver: ThenableWebDriver,
    size: ISize,
) {
    const jsGetPadding: string = `return {
        width: window.outerWidth - window.innerWidth,
        height: window.outerHeight - window.innerHeight
    }`;

    const padding: ISize = await driver.executeScript(jsGetPadding) as ISize;
    return driver.manage().window().setSize(
        size.width + padding.width,
        size.height + padding.height,
    );
}

export function $x(
    driver: ThenableWebDriver,
    xpath: string,
    byText = "",
) {
    if (byText.length) {
        xpath += `[contains(text(), '${byText}')]`;
    }

    return driver.findElement(By.xpath(xpath));
}

// "page object"
export var selectors = {
    nav: ".hxApp__nav",
}

export function visregSuite(browserName: string) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60e3;

    return () => {
        let snappit: Snappit;
        let driver: any;

        describe(browserName, () => {
            beforeAll(async () => {
                const config: IConfig = {
                    browser: browserName,
                    screenshotsDir: "screenshots",
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
                await setViewportSize(driver, { width: 1366, height: 768 });
                driver.get("http://localhost:3000/");
            });

            it("full-screen", async () => {
                await snap("{browserName}/index");
            });

            it("nav", async () => {
                await snap("{browserName}/nav", $(selectors.nav));
            });

            it("guides", async () => {
                await $x(driver, "//nav/hx-reveal//header", "Guides").click();
                await snap("{browserName}/nav/guides", $(selectors.nav));
            });

            it("components", async () => {
                await $x(driver, "//nav/hx-reveal//header", "Components").click();
                await snap("{browserName}/nav/componenets", $(selectors.nav));
            });

            afterAll(async () => {
                await snappit.stop();
            });
        });
    }
}
