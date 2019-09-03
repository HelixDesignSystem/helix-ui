import { HXElement } from '../../interfaces/HXElement/index.js';
import { KEYS } from '../../utils';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

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

    $onCreate () {
        this._onBtnClose = this._onBtnClose.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-hidden', !this.open);
        this._btnClose.addEventListener('click', this._onBtnClose);
    }

    $onDisconnect () {
        this._btnClose.removeEventListener('click', this._onBtnClose);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            this._changeAttrOpen(oldVal, newVal);
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

    /** @private */
    get _btnClose () {
        return this.shadowRoot.getElementById('hxClose');
    }

    /** @private */
    _onBtnClose (evt) {
        evt.preventDefault();

        this.open = false;
    }

    /** @private */
    _onKeyUp (event) {
        if (event.keyCode === KEYS.Escape) {
            this.open = false;
        }
    }

    /** @private */
    _changeAttrOpen (oldVal, newVal) {
        if (newVal !== null) {
            this.$emit('open');
            this.setAttribute('aria-hidden', false);
            document.addEventListener('keyup', this._onKeyUp);
        } else {
            this.$emit('close');
            this.setAttribute('aria-hidden', true);
            document.removeEventListener('keyup', this._onKeyUp);
        }
    }
}
