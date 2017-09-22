import {expect} from "chai";
import * as _ from "lodash";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

import {ScreenshotNotPresentException} from "snappit-visual-regression";

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
        driver.get("http://localhost:3000/");
    });

    it("full-screen", async () => {
        await snap("index");
        expect(await $("body").isDisplayed()).to.eql(true);
    });

    it("nav", async () => {
        await snap("nav", $("nav"));
    });

    after(async () => {
        await snappit.stop();
    });
});
