import { HXElement } from './HXElement';

const MIN = 0;
const MAX = 100;

const tagName = 'hx-progress';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        #fill {
            background-color: currentColor;
            box-sizing: border-box;
            height: 100%;
            width: 0%;
        }
    </style>
    <div id="fill"></div>
`;

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
 * Defines behavior for the `<hx-progress>` custom element.
 * @class
 * @extends HXElement
 */
export class HXProgressElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);
    }

    connectedCallback () {
        this.$upgradeProperty('value');
        this.$defaultAttribute('role', 'progressbar');
        this.$defaultAttribute('aria-valuemin', MIN);
        this.$defaultAttribute('aria-valuemax', MAX);
        this.value = this.value;
    }

    static get observedAttributes () {
        return [ 'value' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        if (newVal !== oldVal) {
            if (attr === 'value') {
                let safeVal = _parseValue(newVal);
                this._elFill.style.width = `${safeVal}%`;
                this.setAttribute('aria-valuenow', safeVal);
            }
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
        return this.shadowRoot.getElementById('fill');
    }
}//HXBusyElement
