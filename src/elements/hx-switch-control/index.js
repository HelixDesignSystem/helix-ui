import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-switch-control>` element, which is the
 * controller for the `<hx-switch>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.24.0
 */
export class HXSwitchControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-switch-control';
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.controlElement.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this.controlElement.removeEventListener('click', this._onClick);
    }

    /**
     * Fetch the first `<input type="checkbox">`
     * descendant (there should only be one(1)).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }

    /**
     * Get Switch Component state.
     *
     * @default false
     * @type {Boolean}
     */
    get toggled () {
        return this.switchElement.toggled;
    }

    /**
     * Fetch the first `<hx-switch>` deccendant (there should only be one(1)).
     *
     * @private
     */
    get switchElement () {
        return this.querySelector('hx-switch');
    }

    /** Determines the toggle state.
     *
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _onClick (evt) {
        let isChecked = this.controlElement.checked;

        if (isChecked) {
            this.switchElement.toggled = true;
        } else {
            this.switchElement.toggled = false;
        }
    }
}
