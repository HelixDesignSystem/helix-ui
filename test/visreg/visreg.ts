import {$, Snappit, IConfig, WebDriver} from "snappit-visual-regression";

import * as util from "../common/util";
import tabTest from "./tests/tabs";
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
        await snappit.snap("{browserName}/nav", $(util.selectors.nav));
    });

    test("nav/guides", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Guides").click();
        await snappit.snap("{browserName}/nav/guides", $(util.selectors.nav));
    });

    test("nav/components", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Components").click();
        await snappit.snap("{browserName}/nav/components", $(util.selectors.nav));
    });

    test("nav/custom-elements", async () => {
        await util.$x(driver, "//nav//hx-disclosure", "Custom Elements").click();
        await snappit.snap("{browserName}/nav/custom-elements", $(util.selectors.nav));
    });

    /**
      * This is here because of https://github.com/SeleniumHQ/selenium/issues/3882
      * For the mean time, don't attempt to use keyboard navigation (in tabs) when
      * testing with Firefox. Chrome works just fine, however.
      */
    if (browserName === "chrome") {
        test("tabs/first", async t => {
            await util.go(driver, "components/tabs");
            await tabTest(t, snappit, driver, "Cupcake Ipsum");
        });

        test("tabs/second", async t => {
            await tabTest(t, snappit, driver, "Biscuit Marshmallow");
        });

        test("tabs/third", async t => {
            await tabTest(t, snappit, driver, "Caramels Marzipan");
        });
    }

    test.after.always(async () => {
        await snappit.stop();
    });
}
