import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

import * as util from "../common/util";

export function suite(browserName: string) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60e3;

    return () => {
        let snappit: Snappit;
        let driver: any;

        describe(browserName, () => {
            beforeAll(async () => {
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
                driver.get("http://localhost:3000/");
            });

            it("full-screen", async () => {
                await snap("{browserName}/index");
            });

            it("nav", async () => {
                await snap("{browserName}/nav", $(util.selectors.nav));
            });

            it("guides", async () => {
                await util.$x(driver, "//nav/hx-reveal//header", "Guides").click();
                await snap("{browserName}/nav/guides", $(util.selectors.nav));
            });

            it("components", async () => {
                await util.$x(driver, "//nav/hx-reveal//header", "Components").click();
                await snap("{browserName}/nav/componenets", $(util.selectors.nav));
            });

            afterAll(async () => {
                await snappit.stop();
            });
        });
    }
}
