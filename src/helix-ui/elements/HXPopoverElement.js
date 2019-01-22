import { HXElement } from './HXElement';
import shadowMarkup from './HXPopoverElement.html';
import shadowStyles from './HXPopoverElement.less';

import { Positionable } from '../mixins/Positionable';
import { mix } from '../utils';

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

    /** @override */
    $onConnect () {
        super.$onConnect();
        this.addEventListener('reposition', this._onReposition);
    }

    $onDisconnect () {
        super.$onDisconnect();
        this.removeEventListener('reposition', this._onReposition);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        if (attr === 'position') {
            this._setShadowPosition(newVal);
        }
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxPopover');
    }

    /**
     * Update visual display of arrow in Shadow DOM based on optimal position.
     * @private
     */
    _onReposition () {
        this._setShadowPosition(this.optimumPosition);
    }

    /**
     * @private
     * @param {NormalizedPositionString}
     */
    _setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }
}
