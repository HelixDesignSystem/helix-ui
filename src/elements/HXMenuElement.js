import { HXElement } from './HXElement';

import { mix } from '../utils';
import { Positionable } from '../mixins/Positionable';

class _ProtoClass extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-menu>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @since 0.2.0
 */
export class HXMenuElement extends _ProtoClass {
    static get is () {
        return 'hx-menu';
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-start';
    }

    /** @override */
    $onConnect () {
        super.$onConnect();
        this.$defaultAttribute('role', 'menu');
        this.setAttribute('aria-expanded', this.open);
    }
}
