import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-tabcontent>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTabcontentElement extends HXElement {
    static get is () {
        return 'hx-tabcontent';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'presentation');
    }
}
