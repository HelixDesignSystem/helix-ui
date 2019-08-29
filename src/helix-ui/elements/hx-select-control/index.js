import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXSelectControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-select-control';
    }

    /**
     * Fetch the first `<select>` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLSelectElement}
     */
    get controlElement () {
        return this.querySelector('select');
    }
}
