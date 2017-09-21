import {expect} from "chai";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

const ss = async (name: string, elem?: any, expect?: any, error?: any) => {
    try {
        snap(name, elem);
    } catch (e) {
        return error(e);
    } finally {
        await expect();
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
        await ss("helix-ui", undefined, async () => {
            expect(await $("body").isDisplayed()).to.eql(true);
        });
    });

    after(async () => {
        await snappit.stop();
    });
});
