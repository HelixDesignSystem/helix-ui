import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-radio-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXRadioControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-radio-control';
    }

    /**
     * Fetch the first `<input type="radio">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="radio"]');
    }
}
