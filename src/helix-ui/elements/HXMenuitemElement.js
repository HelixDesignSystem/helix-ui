import { HXElement } from './HXElement';

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

    connectedCallback () {
        this.$defaultAttribute('role', 'menuitem');
    }
}
