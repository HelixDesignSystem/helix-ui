/**
 * @module HelixUI/Utils
 */
import Alignment from './alignment';
import Offset from './offset';
export { default as ICONS } from './icons/index.js';

/**
 * Key/value map of key names and their keycode.
 *
 * - Alt / Option
 * - Backspace
 * - Ctrl / Control
 * - Del / Delete
 * - Down
 * - End
 * - Enter / Return
 * - Esc / Escape
 * - Home
 * - Ins / Insert
 * - Left
 * - PgDown / PageDown
 * - PgUp / PageUp
 * - Right
 * - Shift
 * - Space
 * - Tab
 * - Up
 * @enum {Integer}
 */
export const KEYS = {
    Alt: 18,
    Backspace: 8,
    Control: 17,
    Ctrl: 17,
    Del: 46,
    Delete: 46,
    Down: 40,
    End: 35,
    Enter: 13,
    Esc: 27,
    Escape: 27,
    Home: 36,
    Ins: 45,
    Insert: 45,
    Left: 37,
    Option: 18,
    PageDown: 34,
    PageUp: 33,
    PgDown: 34,
    PgUp: 33,
    Return: 13,
    Right: 39,
    Shift: 16,
    Space: 32,
    Tab: 9,
    Up: 38,
};

/**
 * Defers execution of callback function until _next_ event loop.
 *
 * @param {Function} callback
 * @returns {Function}
 */
export function defer (cb) {
    return () => setTimeout(cb, 0);
}

/**
 * Generate a unique ID
 *
 * **Pseudo-random Algorithm**
 * This functionality is pseudo-random, and you should not depend on 100%
 * random values. Given a large enough dataset, this method has the
 * potential to generate duplicate values.
 *
 * For the purposes of most applications, the dataset is small enough that
 * the potential for duplicate values is almost 0, meaning that it's good
 * enough for use.
 *
 * @see https://gist.github.com/gordonbrander/2230317
 */
export function generateId () {
    return Math
        .random()     // 0.7093288430261266
        .toString(36) // "0.pjag2nwxb2o"
        .substr(2,8); // "pjag2nwx"
}

/**
 * @function
 * @param {class} baseClass - Base class to apply mixin behavior
 * @param {...function} mixins - mixin factory functions
 * @returns {class}
 *
 * @example
 * import { mix } from 'utils';
 *
 * // Define unique superclass with behaviors from one or more mixin classes
 * class _ABElement extends mix(HXElement, MixinA, MixinB) {}
 *
 * // Extend unique superclass and define additional logic
 * class HXNewElement extends _ABElement {
 *   // logic unique to HXNewElement ...
 * }
 */
export function mix (baseClass, ...mixins) {
    return mixins.reduce((klass, mixin) => {
        return mixin(klass);
    }, baseClass);
}

/**
 * Communicate scroll events from elements at arbitrary depths in the DOM tree
 * (because 'scroll' events do not bubble).
 *
 * The event is dispatched from the `document` object, instead of bubbling from
 * the original element, to avoid interfering with 'scroll' event listeners
 * attached to ancestor elements.
 *
 * We dispatch a CustomEvent so that we can communicate details about the
 * originating target via the `detail` property on the event.
 *
 * @param {Event} evt - "scroll" event object
 * @returns {Boolean}
 */
export function onScroll (evt) {
    let _evtScroll = new CustomEvent('scroll', {
        cancelable: true,
        bubbles: false,
        detail: {
            target: evt.target,
        },
    });

    return document.dispatchEvent(_evtScroll);
}//onScroll()

/**
 * Event listener callback function to prevent page scrolling on `keydown`.
 *
 * @param {Event} evt - Event to act on.
 */
export function preventKeyScroll (evt) {
    switch (evt.keyCode) {
        case KEYS.Down:
        case KEYS.Left:
        case KEYS.Right:
        case KEYS.Space:
        case KEYS.Up:
            evt.preventDefault();
            break;
    }
}

/**
 * Warn user of deprecation.
 *
 * @param {String} txtReplacement - "use instead" replacement
 */
export function replaceWith (txtReplacement) {
    /* eslint-disable no-console */
    console.warn(`
        DEPRECATED: Use ${txtReplacement} instead.
        Old functionality will be removed in an upcoming major release.
    `);
    /* eslint-enable no-console */
}

// Not everything needs to be part of the default export
export default {
    Alignment,
    KEYS,
    Offset,
    defer,
    generateId,
    mix,
    onScroll,
    preventKeyScroll,
    replaceWith,
};
