import {expect} from "chai";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {ScreenshotNotPresentException} from "snappit-visual-regression";

const ss = async (name: string, elem?: any, xpect?: any, error?: any) => {
    try {
        await snap(name, elem);
    } catch (e) {
        if (error === undefined && e instanceof ScreenshotNotPresentException) {
            error = async () => {
                e.stack = "";
                e.name = "";
                e.message = `📷 📸 📷  New Screenshot, "${name}" 📷 📸 📷`;
                throw new ScreenshotNotPresentException(e);
            };
            error();
        }  else if (e) {
            return error(e);
        }
    } finally {
        if (xpect === undefined) {
            xpect = async () => {
                expect(await $("body").isDisplayed()).to.eql(true);
            };
        }

        await xpect();
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
