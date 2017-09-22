import {expect} from "chai";
import * as _ from "lodash";
import {By, ISize, ThenableWebDriver, WebDriver, WebElementPromise} from "selenium-webdriver";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {ScreenshotNotPresentException} from "snappit-visual-regression";

async function setViewportSize (
    driver: ThenableWebDriver,
    size: ISize,
): Promise<void> {
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

let $x: any;
describe("helix", () => {
    let snappit: Snappit;
    let driver: any;

    before(async () => {
        const config: IConfig = {
            browser: "chrome",
            screenshotsDir: "screenshots",
            throwNoBaseline: true,
            threshold: 0.1,
            useDirect: true,
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
        await setViewportSize(driver, { width: 1366, height: 768 });
        driver.get("http://localhost:3000/");

        $x = (
            xpath: string,
            byText = "",
        ): WebElementPromise => {
            if (byText.length) {
                xpath += `[contains(text(), '${byText}')]`;
            }

            return driver.findElement(By.xpath(xpath));
        }
    });

    it("full-screen", async () => {
        await snap("index");
        expect(await $("body").isDisplayed()).to.eql(true);
    });

    it("nav", async () => {
        await snap("nav", $(".app-nav-container"));
    });

    it("components", async () => {
        await $x("//nav/hx-reveal/header", "Components").click();
        await snap("nav/componenets", $(".app-nav-container"));
    });

    after(async () => {
        await snappit.stop();
    });
});
