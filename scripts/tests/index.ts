import {expect} from "chai";

import {Snappit} from "snappit-visual-regression";

describe('helix', () => {
    let snappit: Snappit;
    let driver: any;

    before(() => {
        const config = {
            browser: "chrome",
            screenshotsDir: "screenshots",
            threshold: 0.1,
            useDirect: true,
        };

        snappit = new Snappit(config);
        driver = snappit.start();
    });

    it("should navigate to the localhost page", async () => {
        // Cast here as TypeScript thinks driver might not be initialized.
        driver.get("http://localhost:3000/");

        expect(await driver.getCurrentUrl()).to.contain('localhost:3000');
    });

    it("should terminate the driver instances", async () => {
        await snappit.stop();
    });
});
