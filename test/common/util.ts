/*
 * Helper functions for the tests in `../behavioral/`.
 */
import {By, ISize, WebDriver, WebElement, WebElementPromise} from "snappit-visual-regression";
import {TestContext} from "ava";

export const baseUrl = "http://localhost:3000/helix-ui";

export async function go(driver: WebDriver, component: string) {
    await driver.get(`${baseUrl}/${component}`);
}

export async function sleep(ms = 1500) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

export async function webComponentsReady(driver: WebDriver) {
    const ready = async () => (await driver.executeScript("return window.WebComponents.ready")) as boolean;
    while (!await ready()) {
        await sleep(100);
    }
}

export async function snapshot(t: TestContext, element: WebElement) {
    await webComponentsReady(element.getDriver());
    t.snapshot(await element.getAttribute("outerHTML"));
}

export async function getElementsText(
    elements: WebElement[]
) {
    const getTextPromises = await new Promise(resolve => {
        resolve(elements.map(e => e.getText()));
    }) as Promise<string>[];

    return Promise.all(getTextPromises);
}

/**
 * Shadow Root element extraction code used by CTUI team.
 * 
 * @param element 
 */
export const shadowRoots = (element: WebElementPromise) => {
    const driver = element.getDriver();
        return new WebElementPromise(driver,driver.executeScript('return arguments[0].shadowRoot', element),  
    );
};

/* A "starter page object" until there's a greater need for something more robust.
 * For now this only contains common CSS selectors used throughout tests in the
 * behavioral directory, but may also contain functions in the future.
 *
 * Once that happens, pull this out of `util.ts` and move it someplace more page-object-y.
 */
export var selectors = {
    domDiff: "*[data-dom-diff]"
}

