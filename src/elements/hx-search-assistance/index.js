import { HXElement } from '../../interfaces/HXElement/index.js';
import { Positionable } from '../traits/Positionable.js';
import { mix } from '../../utils';

class _ProtoClass extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-search-assistance>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @see HXSearchElement
 * @since 0.6.0
 */
export class HXSearchAssistanceElement extends _ProtoClass {
    static get is () {
        return 'hx-search-assistance';
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-start';
    }
}
