import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Pills:dismiss
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-pill>` element.
 *
 * @extends HXElement
 * @emits Pills:dismiss
 * @hideconstructor
 * @since 0.8.0
 */
export class HXPillElement extends HXElement {
    static get is () {
        return 'hx-pill';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
    }

    $onConnect () {
        this._btnDismiss.addEventListener('click', this._onDismiss);
        this.$upgradeProperty('persist');
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    /**
     * Property reflecting the `persist` HTML attribute, indicating whether the
     * pill may be dismissed. If true, the dismiss button will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get persist () {
        return this.hasAttribute('persist');
    }
    set persist (value) {
        if (value) {
            this.setAttribute('persist', '');
        } else {
            this.removeAttribute('persist');
        }
    }

    /**
     * Dismiss the pill (removes element from the DOM)
     */
    dismiss () {
        if (!this.persist && this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.remove();
        }
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}
