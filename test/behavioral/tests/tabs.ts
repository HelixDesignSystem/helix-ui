import {WebDriver, By, Key} from "snappit-visual-regression";
import {test, TestContext} from "ava";
import * as util from "../../common/util";

const getTab = async (
    driver: WebDriver,
    tabID: string
) => {
    const element = await driver.findElement(By.id(tabID));
    return element;
}

const cycleLeft = async (driver: WebDriver) => {
    for (const _ of [0, 1, 2]) {
        await driver.actions().sendKeys(Key.ARROW_LEFT).perform();
    }
}

const cycleRight = async (driver: WebDriver) => {
    for (const _ of [0, 1, 2]) {
        await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
    }
}

export default async (
    t: TestContext,
    driver: WebDriver,
    tabID: string,
    tabName: string
) => {
    const tab = await getTab(driver, tabID);
    await tab.click();
    t.is(await tab.getText(), tabName);
    await cycleLeft(driver);
    t.is(await tab.getText(), tabName);
    await cycleRight(driver);
    t.is(await tab.getText(), tabName);
}
