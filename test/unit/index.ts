import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {WebDriver, WebElementPromise} from "selenium-webdriver";

const baseUrl = "http://localhost:3000/helix-ui";
const matchSnapshot = async (element: WebElementPromise) => {
    expect(await element.getAttribute("outerHTML")).toMatchSnapshot();
};

describe("helix", () => {
    let snappit: Snappit;
    let driver: WebDriver;

    beforeAll(async () => {
        const config: IConfig = {
            browser: "chrome",
            serverUrl: "http://localhost:4444/wd/hub",
        };

        snappit = new Snappit(config);
        driver = await snappit.start();
    });

    describe("hx-reveal", () => {
        let reveal: WebElementPromise;

        beforeAll(async () => {
            await driver.get(`${baseUrl}/components/reveal`);
            reveal = $(".demo hx-reveal");
        });

        it("should not be open", async () => {
            expect(await reveal.getAttribute("open")).toEqual(null);
            await matchSnapshot(reveal);
        });

        it("should open", async () => {
            await reveal.click();
            expect(await reveal.getAttribute("open")).toEqual("true");
            await matchSnapshot(reveal);
        });
    });

    afterAll(async () => {
        await snappit.stop();
    });
});
