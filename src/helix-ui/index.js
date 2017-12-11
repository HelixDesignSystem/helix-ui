import { HXElement } from './elements/HXElement';
import * as elements from './elements';

function _defineElements () {
    for (let attr in elements) {
        elements[attr].$define();
    }
}

function initialize () {
    // If polyfills are used, initialize when polyfills are ready
    // otherwise, initialize immediately
    if (window.WebComponents) {
        window.addEventListener('WebComponentsReady', function () {
            _defineElements();
        });
    } else {
        _defineElements();
    }
}

const DOM = Object.assign({}, elements, { HXElement });

export default {
    DOM,
    initialize,
}
