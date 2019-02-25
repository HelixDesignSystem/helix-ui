import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXSelectControlElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-select-control';
    }

    /** @override */
    $onCreate () {
        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlChange = this._onCtrlChange.bind(this);
    }

    /** @override */
    $onConnect () {
        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.addEventListener('change', this._onCtrlChange);
            ctrl.addEventListener('blur', this._onCtrlBlur);
        }
    }

    /** @override */
    $onDisconnect () {
        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.removeEventListener('change', this._onCtrlChange);
            ctrl.removeEventListener('blur', this._onCtrlBlur);
        }
    }

    /**
     * Fetch the first `<select>` descendant
     *
     * @readonly
     * @type {?HTMLElement}
     */
    get controlElement () {
        return this.querySelector('select');
    }

    /** @private */
    _onCtrlBlur () {
        // communicate state via attribute
        this.$defaultAttribute('hx-touched', '');
    }

    /** @private */
    _onCtrlChange () {
        // communicate state via attribute
        this.$defaultAttribute('hx-changed', '');
    }
}
