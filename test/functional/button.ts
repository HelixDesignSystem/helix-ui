import {$, snap, Snappit, IConfig} from "snappit-visual-regression";
import {WebDriver, WebElementPromise} from "selenium-webdriver";

import {test} from "ava";

import * as util from "../common/util";

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
    await util.go(driver, "button");
});

test("states", async t => {
    await util.snapshot(t, $(util.selectors.visreg));
});

test.after.always(async () => {
    await snappit.stop();
});
