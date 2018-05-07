/** @module helix-ui */
import { HXElement } from './elements/HXElement';
import * as elements from './elements';
import { version as SEMVER } from '../../package.json';

/*
 * Register element definitions with the Custom Element registry.
 */
function _defineElements () {
    for (let attr in elements) {
        elements[attr].$define();
    }
}

/**
 * Initialize HelixUI when Web Components are ready.
 */
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

let [major, minor, patch] = SEMVER.split('.').map(Number);

/**
 * Current version metadata
 *
 * ```javascript
 * console.log(HelixUI.VERSION)            // { major: 0, minor: 1, patch: 2 }
 * console.log(HelixUI.VERSION.toString()) // "0.1.2"
 * console.log(`${HelixUI.VERSION}`)       // "0.1.2"
 * ```
 *
 * @type {Object}
 * @prop {String} version.semver - Semantic version string
 * @prop {Integer} version.major - Major version number
 * @prop {Integer} version.minor - Minor version number
 * @prop {Integer} version.patch - Patch version number
 */
const VERSION = {
    major,
    minor,
    patch,
};
VERSION.toString = () => { return SEMVER };

export default {
    elements,
    initialize,
    VERSION,
};
