import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowMarkup from './HXCheckboxElement.html';
import shadowStyles from './HXCheckboxElement.less';

/**
 * Fires when the element's `checked` state changes
 *
 * @event Checkbox:change
 * @since 0.1.8
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-checkbox>` element.
 *
 * @emits Checkbox:change
 * @extends HXElement
 * @hideconstructor
 * @since 0.1.8
 */
export class HXCheckboxElement extends HXElement {
    static get is () {
        return 'hx-checkbox';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    static get observedAttributes () {
        return [
            'checked',
            'disabled',
            'indeterminate',
        ];
    }

    constructor () {
        super();
        this._onChange = this._onChange.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('checked');
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('indeterminate');
        this._input.addEventListener('change', this._onChange);
    }

    disconnectedCallback () {
        this._input.removeEventListener('change', this._onChange);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);
        switch (attr) {
            case 'indeterminate':
                this._input.indeterminate = hasValue;
                break;
            case 'checked':
                if (this._input.checked !== hasValue) {
                    this._input.checked = hasValue;
                }
                break;
            case 'disabled':
                this._input.disabled = hasValue;
                break;
        }
    }//attributeChangedCallback()

    /**
     * @default false
     * @type {Boolean}
     */
    get checked () {
        return this.hasAttribute('checked');
    }
    set checked (value) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    /**
     * Indicates if the state of the element cannot be determined.
     *
     * @default false
     * @type {Boolean}
     */
    get indeterminate () {
        return this.hasAttribute('indeterminate');
    }
    set indeterminate (value) {
        if (value) {
            this.setAttribute('indeterminate', '');
        } else {
            this.removeAttribute('indeterminate');
        }
    }

    /** @private */
    _onChange (evt) {
        // Update internal state
        this.checked = evt.target.checked;

        // Prevent 'change' listeners from firing twice in polyfilled browsers.
        evt.stopImmediatePropagation();

        // Emit a new 'change' event from the custom element
        this.$emit('change');
    }

    /** @private */
    get _input () {
        return this.shadowRoot.getElementById('nativeControl');
    }
}
