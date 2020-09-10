import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-toggle-control>` element, which is the
 * controller for the `<hx-toggle>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 1.0.0
 */
export class HXToggleControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-toggle-control';
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
     * Fetch the first `<hx-toggle>` deccendant (there should only be one(1)).
     */
    get toggleElement () {
        return this.querySelector('hx-toggle');
    }

    /**
     * Get the Toggle Component state.
     *
     * @default false
     * @type {Boolean}
     */
    get toggled () {
        return this.toggleElement.toggled;
    }

    /** Determines the toggle state.
     *
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _onClick (evt) {
        let isChecked = this.controlElement.checked;

        if (isChecked) {
            this.toggleElement.toggled = true;
        } else {
            this.toggleElement.toggled = false;
        }
    }
}
