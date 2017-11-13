/*
 * Helper functions for the tests in `../visreg/` and `../functional/`.
 */
import {By, ISize, WebDriver, WebElement, WebElementPromise} from "selenium-webdriver";
import {TestContext} from "ava";

export const baseUrl = "http://localhost:3000/helix-ui";

export async function go(driver: WebDriver, component: string) {
    await driver.get(`${baseUrl}/components/${component}`);
}

export async function snapshot(t: TestContext, element: WebElement) {
    t.snapshot(await element.getAttribute("outerHTML"));
}

export async function setViewportSize (
    driver: WebDriver,
    size: ISize,
) {
    const jsGetPadding: string = `return {
        width: window.outerWidth - window.innerWidth,
        height: window.outerHeight - window.innerHeight
    }`;

    const padding: ISize = await driver.executeScript(jsGetPadding) as ISize;
    return driver.manage().window().setSize(
        size.width + padding.width,
        size.height + padding.height,
    );
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
 * visreg/functional directories, but may also contain functions in the future.
 *
 * Once that happens, pull this out of `util.ts` and move it someplace more page-object-y.
 */
export var selectors = {
    nav: ".hxApp__nav",
    visreg: "*[data-visreg]",
}
