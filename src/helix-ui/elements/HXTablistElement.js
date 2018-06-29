import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-tablist>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTablistElement extends HXElement {
    static get is () {
        return 'hx-tablist';
    }

    $onConnect () {
        this.$defaultAttribute('role', 'tablist');
    }
}
