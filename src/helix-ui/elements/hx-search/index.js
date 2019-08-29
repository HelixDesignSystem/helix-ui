import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Fires when the element loses focus.
 *
 * - **does not bubble**
 *
 * @event Search:blur
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the clear button ("X") is pressed.
 *
 * @event Search:clear
 * @since 0.5.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element receives focus.
 *
 * - **does not bubble**
 *
 * @event Search:focus
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-search>` element.
 *
 * @emits Search:blur
 * @emits Search:clear
 * @emits Search:focus
 * @extends HXElement
 * @hideconstructor
 * @see HXSearchAssistanceElement
 * @since 0.4.0
 */
export class HXSearchElement extends HXElement {
    static get is () {
        return 'hx-search';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onClearClick = this._onClearClick.bind(this);
        this._onSearchInput = this._onSearchInput.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('invalid');
        this.$upgradeProperty('placeholder');
        this.$upgradeProperty('value');

        this._btnClear.addEventListener('click', this._onClearClick);
        this._elSearch.addEventListener('input', this._onSearchInput);

        this.$relayNonBubblingEvents(this._elSearch);
    }

    $onDisconnect () {
        this._btnClear.removeEventListener('click', this._onClearClick);
        this._elSearch.removeEventListener('input', this._onSearchInput);

        this.$removeNonBubblingRelays(this._elSearch);
    }

    static get $observedAttributes () {
        return [
            'disabled',
            'placeholder',
            'value',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);

        switch (attr) {
            case 'disabled': {
                this._elSearch.disabled = hasValue;
                break;
            }

            case 'placeholder': {
                this._elSearch.placeholder = newVal;
                break;
            }

            case 'value': {
                if (this._elSearch.value !== newVal) {
                    this._elSearch.value = newVal;
                }

                if (hasValue) {
                    this._btnClear.hidden = (newVal === '');
                } else {
                    this._btnClear.hidden = true;
                }
                break;
            }
        }
    }

    /**
     * @default [false]
     * @type {Boolean}
     */
    get invalid () {
        return this.hasAttribute('invalid');
    }
    set invalid (isInvalid) {
        if (isInvalid) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    /**
     * @default ['']
     * @type {String}
     */
    get placeholder () {
        return this.getAttribute('placeholder');
    }
    set placeholder (newVal) {
        if (newVal) {
            this.setAttribute('placeholder', newVal);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    /**
     * @default ['']
     * @type {String}
     */
    get value () {
        return this.getAttribute('value');
    }
    set value (newVal) {
        if (newVal) {
            this.setAttribute('value', newVal);
        } else {
            this.removeAttribute('value');
        }
    }

    /**
     * Simulate pressing "X" to clear input value
     */
    clear () {
        if (this.value !== '') {
            this.value = '';
            this.$emit('clear');
        }
    }

    /**
     * Override HTMLElement#focus(), because we need to focus the
     * inner `<input>` instead of the outer `<hx-search>`.
     */
    focus () {
        this._elSearch.focus();
    }

    /** @private */
    get _btnClear () {
        return this.shadowRoot.getElementById('hxClear');
    }

    /** @private */
    get _elSearch () {
        return this.shadowRoot.getElementById('hxNativeControl');
    }

    /**
     * Clear value and focus input when user presses "X" via the UI.
     * @private
     */
    _onClearClick (evt) {
        evt.preventDefault();
        this.clear();
        this.focus();
    }

    /**
     * Keep state in sync with `<input>`
     *
     * 1. synchronize `value`
     * 2. determine whether to reveal the clear button
     *
     * @private
     */
    _onSearchInput (evt) {
        this.value = evt.target.value;
        let hasValue = (evt.target.value !== '');
        this._btnClear.hidden = !hasValue;
    }
}
