import { HXElement } from './HXElement';
import shadowMarkup from './HXPillElement.html';
import shadowStyles from './HXPillElement.less';

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
        return `hx-pill`;
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
     * Programmatically dismiss the pill (removes element from the DOM).
     */
    dismiss () {
        this.remove();
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();

        if (this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.dismiss();
        }
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('dismiss');
    }
}
