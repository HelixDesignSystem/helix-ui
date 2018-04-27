import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowStyles from './HXModalElement.less';

const tagName = 'hx-modal';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <div id="container">
    <button type="button" id="close">
      <hx-icon type="times"></hx-icon>
    </button>
    <slot></slot>
  </div>
`;

export class HXModalElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName, template);
        this._close = this._close.bind(this);
        this._keyUp = this._keyUp.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this._btnClose = this.shadowRoot.querySelector("#close");
        this.setAttribute('aria-hidden', !this.open);

        this._btnClose.addEventListener('click', this._close);
        document.addEventListener('keyup', this._keyUp);
    }

    disconnectedCallback () {
        this._btnClose.removeEventListener('click', this._close);
        document.removeEventListener('keyup', this._keyUp);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-hidden', !isOpen);

        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }//attributeChangedCallback

    _close (evt) {
        evt.preventDefault();

        this.open = false;
    }

    _keyUp (event) {
        if (event.keyCode === KEYS.Escape) {
            this._close();
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }
}
