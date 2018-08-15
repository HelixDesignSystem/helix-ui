/**
 * https://gist.github.com/ChadKillingsworth/d4cb3d30b9d7fbc3fd0af93c2a133a53
 * Using this code logic to obtain nested Shadow DOM elements for helix.
 *
 * This function runs in the browser context
 * @param {string|Array<string>} selectors
 * @return {?Element}
 */
export function findInShadowDom(selectors) {
    if (!Array.isArray(selectors)) {
        selectors = [selectors];
    }

    function findElement(selectors) {
        let currentElement = document;
        for (var i = 0; i < selectors.length; i++) {
            if (i > 0) {
                currentElement = currentElement.shadowRoot;
            }
            if (currentElement) {
                currentElement = currentElement.querySelector(selectors[i]);
            }
            if (!currentElement) {
                break;
            }
        }
        return currentElement;
    }
    if (!(document.body.createShadowRoot || document.body.attachShadow)) {
        selectors = [selectors.join(' ')];
    }
    return findElement(selectors);
}

/**
 * Add a command to return an element within a shadow dom.
 * The command takes an array of selectors. Each subsequent
 * array member is within the preceding element's shadow dom.
 *
 * Example:
 * const elem = browser.shadowDomElement(['foo-bar', 'bar-baz', 'baz-foo']);
 *
 * Browsers which do not have native ShadowDOM support assume each selector is a direct
 * descendant of the parent.
 */
browser.addCommand("shadowDomElement", (selector) => {
    return this.execute(findInShadowDom, selector);
});