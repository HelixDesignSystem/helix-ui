import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-textarea-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXTextareaControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-textarea-control';
    }

    /**
     * Fetch the first text `<textarea>` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLTextAreaElement}
     */
    get controlElement () {
        return this.querySelector('textarea');
    }
}
