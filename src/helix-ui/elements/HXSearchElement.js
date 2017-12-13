import { HXElement } from './HXElement';
import shadowStyles from './_hx-search.less';

const tagName = 'hx-search';
const template = document.createElement('template');

template.innerHTML = `
    <style>${shadowStyles}</style>
    <input type="text" placeholder="Search&hellip;" id="search-input" aria-label="Search Terms">
    <hx-icon type="search"></hx-icon>
    <button id="clear-btn">
        <hx-icon type="times"></hx-icon>
    </button>
`;
export class HXSearchElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'value' ];
    }

    constructor () {
        super(tagName, template);
        this._input = this.shadowRoot.querySelector('#search-input');
        this._clearBtn = this.shadowRoot.querySelector('#clear-btn');
        this._clearInput = this._clearInput.bind(this);
        this._onInput = this._onInput.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('value');
        if (this.value) {
            this._input.value = this.value;
        }
        this._clearBtn.hidden = this._shouldHideClearBtn();
        this._clearBtn.addEventListener('click', this._clearInput);
        this._input.addEventListener('input', this._onInput);
    }

    disconnectedCallback () {
        this._clearBtn.removeEventListener('click', this._clearInput);
        this._input.removeEventListener('input', this._onInput);
    }

    attributeChangedCallback () {
        this._input.value = this.value;
    }

    _clearInput () {
        this._input.value = '';
        this._clearBtn.hidden = true;
    }

    _onInput () {
        this._clearBtn.hidden = this._shouldHideClearBtn();
    }

    _shouldHideClearBtn () {
        if (this._input.value) {
            return false;
        } else {
            return true;
        }
    }

    set invalid (value) {
        if (value) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    get invalid () {
        return this.hasAttribute('invalid');
    }

    set value (value) {
        if (value) {
            this.setAttribute('value', value);
        } else {
            this.removeAttribute('value');
        }
    }

    get value () {
        return this.getAttribute('value');
    }
}
