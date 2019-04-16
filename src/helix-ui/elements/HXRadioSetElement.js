import { HXElement } from './HXElement';
import { STATE } from './HXFormControlElement';

/**
  * Defines behavior for the `<hx-radio-set>` element.
  *
  * @extends HXElement
  * @hideconstructor
  * @since 0.16.0
  */
export class HXRadioSetElement extends HXElement {
    static get is () {
        return 'hx-radio-set';
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

    /** @private */
    _onHxchange (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.changed, '');
    }

    // TODO: revisit logic in phase 3
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
