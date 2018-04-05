import { HXElement } from './HXElement';
import shadowStyles from './_hx-search.less';

const tagName = 'hx-search';
const template = document.createElement('template');

template.innerHTML = `
    <style>${shadowStyles}</style>
    <label id="wrapper">
        <input type="text" role="search" id="search" autocomplete="off" />
        <button id="clear" hidden aria-label="Clear search">
            <hx-icon type="times"></hx-icon>
        </button>
        <div id="icon">
            <hx-icon type="search"></hx-icon>
        </div>
        <div id="customControl"></div>
    </label>
`;

export class HXSearchElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [
            'disabled',
            'placeholder',
            'value',
        ];
    }

    constructor () {
        super(tagName, template);
        this._elSearch = this.shadowRoot.getElementById('search');
        this._btnClear = this.shadowRoot.getElementById('clear');

        this._clearValue = this._clearValue.bind(this);
        this._onInput = this._onInput.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('invalid');
        this.$upgradeProperty('placeholder');
        this.$upgradeProperty('value');

        this._btnClear.addEventListener('click', this._clearValue);
        this._elSearch.addEventListener('input', this._onInput);

        this.$relayNonBubblingEvents(this._elSearch);
    }

    disconnectedCallback () {
        this._btnClear.removeEventListener('click', this._clearValue);
        this._elSearch.removeEventListener('input', this._onInput);

        this.$removeNonBubblingRelays(this._elSearch);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);

        switch (attr) {
            case 'disabled':
                this._elSearch.disabled = hasValue;
                break;

            case 'placeholder':
                this._elSearch.placeholder = newVal;
                break;

            case 'value':
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
    }//attributeChangedCallback()

    // GETTERS
    get disabled () {
        return this.hasAttribute('disabled');
    }

    get invalid () {
        return this.hasAttribute('invalid');
    }

    get placeholder () {
        return this.getAttribute('placeholder');
    }

    get value () {
        return this.getAttribute('value');
    }

    // SETTERS
    set disabled (isDisabled) {
        if (isDisabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    set invalid (isInvalid) {
        if (isInvalid) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    set placeholder (newVal) {
        if (newVal) {
            this.setAttribute('placeholder', newVal);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    set value (newVal) {
        if (newVal) {
            this.setAttribute('value', newVal);
        } else {
            this.removeAttribute('value');
        }
    }

    // PRIVATE FUNCTIONS
    _onInput (evt) {
        this.value = evt.target.value;
        if (evt.target.value === '') {
            this._btnClear.hidden = true;
        } else {
            this._btnClear.hidden = false;
        }
    }

    _clearValue () {
        this.value = '';

        // Emit a 'clear' event to communicate state change.
        this.$emit('clear');

        this._elSearch.focus();
    }
}
