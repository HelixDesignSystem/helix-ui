/*
 * Helper functions for the tests in `../visreg/`.
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
    const ready = async () => {
        console.log('Check if WebComponents are ready...');
        const script = `
            // fail if document isn't ready
            if (!(document && document.readyState === 'complete')) {
                return false;
            }
            // fail if web components aren't ready
            if (!(window && window.WebComponents && window.WebComponents.ready)) {
                return false;
            }
            // otherwise pass
            return true;
        `;

        const ready = (await driver.executeScript(script)) as boolean;

        if (ready) {
            console.log('...ready');
        } else {
            console.log('...not ready');
        }
        return ready;
    }

    while (!await ready()) {
        console.log('SLEEPING');
        await sleep(100);
    }
}

export async function snapshot(t: TestContext, element: WebElement) {
    console.log('snapshot()');
    console.log('Waiting for web components...');
    await webComponentsReady(element.getDriver());
    console.log('...DONE');

    console.log('Taking snapshot...');
    t.snapshot(await element.getAttribute("outerHTML"));
    console.log('...DONE');
}

export function $x(
    driver: WebDriver,
    xpath: string,
    byText = "",
) {
    if (byText.length) {
        xpath += `[contains(text(), '${byText}')]`;
    }

    return driver.findElement(By.xpath(xpath));
}

/* A "starter page object" until there's a greater need for something more robust.
 * For now this only contains common CSS selectors used throughout tests in the
 * visreg directory, but may also contain functions in the future.
 *
 * Once that happens, pull this out of `util.ts` and move it someplace more page-object-y.
 */
export var selectors = {
    nav: "#stage > #nav",
    tab: "//hx-tablist/hx-tab",
    visreg: "*[data-visreg]",
}
