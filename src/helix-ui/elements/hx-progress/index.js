import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

const MIN = 0;
const MAX = 100;

/**
 * @private
 * @param {*} val - Value to coerce into an Integer
 * @returns {Integer} Integer value between hard-coded MIN and MAX
 */
function _parseValue (val) {
    // coerce into an Integer
    let safeVal = Math.round(Number(val) || MIN);
    // guard upper bound
    safeVal = safeVal > MAX ? MAX : safeVal;
    // guard lower bound
    safeVal = safeVal < MIN ? MIN : safeVal;

    return safeVal;
}

/**
 * Defines behavior for the `<hx-progress>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.7.0
 */
export class HXProgressElement extends HXElement {
    static get is () {
        return 'hx-progress';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onConnect () {
        this.$upgradeProperty('value');
        this.$defaultAttribute('role', 'progressbar');
        this.$defaultAttribute('aria-valuemin', MIN);
        this.$defaultAttribute('aria-valuemax', MAX);
        this.value = this.value;
    }

    static get $observedAttributes () {
        return [ 'value' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'value') {
            let safeVal = _parseValue(newVal);
            this._elFill.style.width = `${safeVal}%`;
            this.setAttribute('aria-valuenow', safeVal);
        }
    }

    /**
     * Completion percentage
     * @type {Integer}
     */
    get value () {
        return _parseValue(this.getAttribute('value'));
    }
    set value (newVal) {
        let safeVal = _parseValue(newVal);
        this.setAttribute('value', safeVal);
    }

    /**
     * @private
     * @type {HTMLElement}
     */
    get _elFill () {
        return this.shadowRoot.getElementById('hxFill');
    }
}
