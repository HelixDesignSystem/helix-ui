/** @module HelixUI */
import * as Elements from './elements';
export { version as VERSION } from '../../package.json';
export { default as Utils } from './utils';

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
 * Initialize HelixUI when Web Components are ready.
 */
export function initialize () {
    if (window.WebComponents) {
        // Polyfill detected
        if (window.WebComponents.ready) {
            // polyfill already finished loading, initialize immediately
            _defineElements();
        } else {
            // initialize when polyfill has finished loading
            window.addEventListener('WebComponentsReady', function () {
                _defineElements();
            });
        }
    } else {
        // No polyfills detected, initialize immediately
        _defineElements();
    }
}

export {
    Elements,
};
