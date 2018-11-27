/**
 * @module HelixUI/Utils
 */
import Position from './position';

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

export default {
    KEYS,
    Position,
    onScroll,
};

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
