import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.scss';

/**
 * Defines behavior for the `<hx-beacon>` element.
 *
 * @extends HXElement
 * @emits beacon:dismiss
 * @hideconstructor
 * @since 0.23.0
 */
export class HXBeaconElement extends HXElement {
    static get is () {
        return 'hx-beacon';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
    }

    $onConnect () {
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    /**
     * Dismiss the beacon (removes element from the DOM)
     */
    dismiss () {
        if (this.$emit('dismiss')) {
            this.remove();
        }
    }

    /** @private */
    _onDismiss () {
        this.dismiss();
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}
