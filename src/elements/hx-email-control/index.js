import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/** 
 *  Defines behavior for the `<hx-email-control>` element.
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.20.0
 */

export class HXEmailControl extends HXFormControlElement {
    // @override 
    static get is () {
        return 'hx-email-control';
    }

    /** 
     * Fetch the first `<input>` with 'type="email"' descendant,
     * whether implicit (`<input />`) or explicit
     * (`<input type="email" />`).
     * 
     * @override
     * @readonly
     * @type {?HTMLInputElement} 
     */
    get controlElement () {
        return this.querySelector('input:not([type]), input[type="email"]');
    }
}
