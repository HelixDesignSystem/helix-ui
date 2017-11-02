import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {WebDriver, WebElementPromise} from "selenium-webdriver";

import {test, TestContext} from "ava";

const baseUrl = "http://localhost:3000/helix-ui";
const snapshot = async (t: TestContext, element: WebElementPromise) => {
    t.snapshot(await element.getAttribute("outerHTML"));
};

let snappit: Snappit;
let driver: WebDriver;
let reveal: WebElementPromise;

test.before(async () => {
    const config: IConfig = {
        browser: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };

    snappit = new Snappit(config);
    driver = await snappit.start();
    await driver.get(`${baseUrl}/components/reveal`);
    reveal = $(".demo hx-reveal");
});

test("should not be open", async t => {
    t.is(await reveal.getAttribute("open"), null);
    await snapshot(t, reveal);
});

test("should open", async t => {
    await reveal.click();
    t.is(await reveal.getAttribute("open"), "true");
    await snapshot(t, reveal);
});

test.after.always(async () => {
    await snappit.stop();
});
