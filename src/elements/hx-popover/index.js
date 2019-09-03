import { HXElement } from '../../interfaces/HXElement/index.js';
import { Positionable } from '../traits/Positionable.js';
import { mix } from '../../utils';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

class _ProtoClass extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-popover>` element.
 *
 * @hideconstructor
 * @extends HXElement
 * @extends Positionable
 * @since 0.2.0
 */
export class HXPopoverElement extends _ProtoClass {
    static get is () {
        return 'hx-popover';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-right';
        this.POSITION_OFFSET = 20;
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxPopover');
    }

    /**
     * @override
     * @param {NormalizedPositionString}
     */
    setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }
}
