import { HXElement } from '../../interfaces/HXElement/index.js';
import { onScroll } from '../../utils';

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

    $onConnect () {
        this.$defaultAttribute('role', 'presentation');
        this.addEventListener('scroll', onScroll);
    }

    $onDisconnect () {
        this.removeEventListener('scroll', onScroll);
    }
}
