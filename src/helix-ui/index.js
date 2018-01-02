import { HXElement } from './elements/HXElement';
import * as elements from './elements';

function _defineElements () {
    for (let attr in elements) {
        elements[attr].$define();
    }
}

function initialize () {
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

const DOM = Object.assign({}, elements, { HXElement });

export default {
    DOM,
    initialize,
}
