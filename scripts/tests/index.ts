import {expect} from "chai";

import {$, snap, Snappit, IConfig} from "snappit-visual-regression";

describe('helix', () => {
    let snappit: Snappit;
    let driver: any;

    it("should navigate to the localhost page", async () => {
        const config: IConfig = {
            browser: "chrome",
            screenshotsDir: "screenshots",
            threshold: 0.1,
            useDirect: true,
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
        driver.get("http://localhost:3000/");
        await snap("helix-ui");
        // expect(await $("body").isDisplayed()).to.eql(true);
        await snappit.stop();
    });
});
