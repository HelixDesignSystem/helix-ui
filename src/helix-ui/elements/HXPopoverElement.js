import { HXElement } from './HXElement';
import shadowMarkup from './HXPopoverElement.html';
import shadowStyles from './HXPopoverElement.less';

import { mix } from '../utils';
import { Positionable } from '../mixins/Positionable';

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
        this.$defaultAttribute('data-offset', 20);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        if (attr === 'position') {
            this._elRoot.setAttribute('position', newVal);
        }
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxPopover');
    }
}
