import { HXElement } from '../../interfaces/HXElement/index.js';
import { STATE } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-checkbox-set>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.18.0
 */
export class HXCheckboxSetElement extends HXElement {
    static get is () {
        return 'hx-checkbox-set';
    }

    $onConnect () {
        this.addEventListener('hxchange', this._onHxchange);
        this.addEventListener('hxdirty', this._onHxdirty);
        this.addEventListener('hxtouch', this._onHxtouch);
    }

    $onDisconnect () {
        this.removeEventListener('hxchange', this._onHxchange);
        this.removeEventListener('hxdirty', this._onHxdirty);
        this.removeEventListener('hxtouch', this._onHxtouch);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get isDirty () {
        return this.hasAttribute(STATE.dirty);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasChanged () {
        return this.hasAttribute(STATE.changed);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasTouched () {
        return this.hasAttribute(STATE.touched);
    }

    /** @private */
    _onHxchange (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.changed, '');
    }

    /** @private */
    _onHxdirty (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.dirty, '');
    }

    /** @private */
    _onHxtouch (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.touched, '');
    }
}
