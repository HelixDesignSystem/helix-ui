import { HXElement } from '../../interfaces/HXElement/index.js';

/**
 * Defines behavior for the `<hx-menuitem>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXMenuitemElement extends HXElement {
    static get is () {
        return 'hx-menuitem';
    }

    $onConnect () {
        this.$defaultAttribute('role', 'menuitem');
    }
}
