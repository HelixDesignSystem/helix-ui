/** @module HelixUI */
import * as Elements from './elements';
import { version as VERSION } from '../package.json';
import * as Utils from './utils';

const { waitForWebComponents } = Utils;

/**
 * @external CustomEvent
 * @description Constructor polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [CustomEvent()](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
 */

/**
 * @external Element
 * @description
 * - MDN: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
 */

/**
 * @external Event
 * @description Constructor polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [Event()](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
 */

/**
 * @external HTMLElement
 * @extends external:Element
 * @description
 * Every custom element must directly or indirectly extend this base class.
 *
 * - MDN: [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
 */

/**
 * @external HTMLTemplateElement
 * @extends external:HTMLElement
 * @description Polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [HTMLTemplateElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement)
 */

/*
 * Register element definitions with the Custom Element registry.
 */
function _defineElements () {
    for (let element in Elements) {
        Elements[element].$define();
    }
}

/**
 * @description
 * Initialize HelixUI when polyfills are ready.
 *
 * @example <caption>No Arugments (backward-compatible behavior)</caption>
 * function start () {
 *   // continue...
 * }
 * HelixUI.initialize();
 * start();
 *
 *
 * @example <caption>Then-able</caption>
 * function start () {
 *   // continue...
 * }
 * HelixUI.initialize().then(start);
 *
 *
 * @example <caption>Async/Await</caption>
 * function start () {
 *   // continue...
 * }
 *
 * async function load () {
 *   await HelixUI.initialize();
 *   start();
 * }
 *
 * load();
 *
 * @returns {Promise}
 */
export function initialize () {
    return waitForWebComponents()
        .then(_defineElements);
}

export {
    Elements,
    Utils,
    VERSION,
};
