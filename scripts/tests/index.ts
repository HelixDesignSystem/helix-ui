import {expect} from "chai";
import * as _ from "lodash";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

import {ScreenshotNotPresentException} from "snappit-visual-regression";

const ss = async (name: string, elem?: any) => {
    try {
        await snap(name, elem);
    } catch (e) {
        if (e instanceof ScreenshotNotPresentException) {
            e.stack = "";
            e.name = "";
            const cameras = () => _.times(3, () =>  _.sample([ "📷", "📸" ])).join("  ");
            e.message = `${cameras()}  New Screenshot, "${name}" ${cameras()}`;
            throw e;
        }
    }
};

describe("helix", () => {
    let snappit: Snappit;
    let driver: any;

    before(async () => {
        const config: IConfig = {
            browser: "chrome",
            screenshotsDir: "screenshots",
            threshold: 0.1,
            useDirect: true,
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
        driver.get("http://localhost:3000/");
    });

    it("full-screen", async () => {
        await ss("index");
        expect(await $("body").isDisplayed()).to.eql(true);
    });

    it("nav", async () => {
        await ss("nav", $("nav"));
    });

    after(async () => {
        await snappit.stop();
    });
});
