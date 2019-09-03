import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXCheckboxControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-checkbox-control';
    }

    /**
     * Fetch the first `<input type="checkbox">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }
}
