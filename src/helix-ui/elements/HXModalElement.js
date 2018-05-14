import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowMarkup from './HXModalElement.html';
import shadowStyles from './HXModalElement.less';

/**
 * Fires when the element is concealed.
 *
 * @event Modal:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element is revealed.
 *
 * @event Modal:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-modal>` element.
 *
 * @emits Modal:close
 * @emits Modal:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.1
 */
export class HXModalElement extends HXElement {
    static get is () {
        return 'hx-modal';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super();
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
