import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-switch-control>` element which is the
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

    /**
     * Fetch the first `<input type="checkbox">` descendant.
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }
}
