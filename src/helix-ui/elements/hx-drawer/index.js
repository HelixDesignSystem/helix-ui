import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Cancelable event that fires when the element's
 * contents are to be concealed.
 *
 * @event Drawer:close
 * @type {CustomEvent}
 */

/**
 * Cancelable event that fires when the element's
 * contents are to be revealed.
 *
 * @event Drawer:open
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-drawer>` element.
 *
 * @emits Drawer:close
 * @emits Drawer:open
 * @extends HXElement
 * @hideconstructor
 */
export class HXDrawerElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-drawer';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    /** @override */
    $onCreate () {
        this._onCloseClick = this._onCloseClick.bind(this);
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
    }

    /** @override */
    static get $observedAttributes () {
        return [ 'open' ];
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            this.setAttribute('aria-expanded', newVal !== null);
        }
    }

    /** @override */
    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
        this._resize();

        this._btnClose.addEventListener('click', this._onCloseClick);
        document.addEventListener('scroll', this._onDocumentScroll, { passive: true });
    }

    /** @override */
    $onDisconnect () {
        this._btnClose.removeEventListener('click', this._onCloseClick);
        document.removeEventListener('scroll', this._onDocumentScroll);
    }

    /**
     * Property reflecting the `open` HTML attribute, indicating whether or not
     * the element's contents should be shown.
     *
     * @default false
     * @type {Boolean}
     */
    set open (value) {
        if (value) {
            // allow consumer to cancel the event
            if (this.$emit('open')) {
                this._resize();
                this.setAttribute('open', '');
            }
        } else {
            // allow consumer to cancel the event
            if (this.$emit('close')) {
                this.removeAttribute('open');
            }
        }
    }
    get open () {
        return this.hasAttribute('open');
    }

    /** @private */
    get _btnClose () {
        return this.shadowRoot.querySelector('#hxClose');
    }

    /** @private */
    get _elDrawer () {
        return this.shadowRoot.querySelector('#hxDrawer');
    }

    /** @private */
    _onCloseClick (evt) {
        evt.preventDefault();
        this.open = false;
    }

    /** @private */
    _onDocumentScroll () {
        if (this.open) {
            this._resize();
        }
    }

    /**
     * Resize the drawer based on scroll position in order to keep
     * it flush with the bottom of the eyebrow.
     *
     * @private
     */
    _resize () {
        let header = document.querySelector('#head');

        if (header) {
            let { bottom } = header.getBoundingClientRect();

            if (bottom > 0) {
                this._elDrawer.style.setProperty('height', `calc(100% - ${bottom}px)`);
            } else {
                this._elDrawer.style.removeProperty('height');
            }
        }
    }
}
