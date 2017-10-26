/*
 * Helper functions for the tests in `index.ts`.
 */
import {By, ISize, ThenableWebDriver, WebDriver, WebElementPromise} from "selenium-webdriver";

export async function setViewportSize (
    driver: ThenableWebDriver,
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
    driver: ThenableWebDriver,
    xpath: string,
    byText = "",
) {
    if (byText.length) {
        xpath += `[contains(text(), '${byText}')]`;
    }

    return driver.findElement(By.xpath(xpath));
}

// "page object"
export var selectors = {
    nav: ".hxApp__nav",
}
