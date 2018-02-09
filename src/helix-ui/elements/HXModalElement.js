import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowStyles from './_hx-modal.less';

const tagName = 'hx-modal';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <div id="container">
    <button id="close">
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

        this._btnClose.addEventListener('click', this._close);
        document.addEventListener('keyup', this._keyUp);
    }

    disconnectedCallback () {
        this._btnClose.removeEventListener('click', this._close);
        document.removeEventListener('keyup', this._keyUp);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue !== '');
    }

    _close () {
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
            this.$emit('open');
        } else {
            this.removeAttribute('open');
            this.$emit('close');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }
}
