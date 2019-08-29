import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-text-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXTextControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-text-control';
    }

    /**
     * Fetch the first text `<input>` descendant,
     * whether implicit (`<input />`) or explicit
     * (`<input type="text" />`).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input:not([type]), input[type="text"]');
    }
}
