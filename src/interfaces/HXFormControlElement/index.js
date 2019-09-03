import { HXElement } from '../HXElement/index.js';

export const STATE = {
    changed: 'hx-changed',
    dirty: 'hx-dirty',
    touched: 'hx-touched',
};

/**
 * Abstract class which defines shared behavior among all
 * form control custom elements (e.g., HXSelectControlElement,
 * HXCheckboxControlElement, HXTextControlElement, etc.).
 *
 * ## States
 *
 * ### Dirty
 * Reflected by the `hx-dirty` content attribute when Changed or Touched.
 *
 * ### Changed
 * Applies the `hx-changed` content attribute when controlElement
 * emits a `change` event. This typically occurs after the value
 * has been modified and the user moves away (blurs) the text control.
 *
 * ### Touched
 * Applies the `hx-touched` content attribute when controlElement
 * emits a `blur` event (meaning that the user has "visited" the
 * text control and moved on).
 *
 * @abstract
 * @hideconstructor
 * @since 0.16.0
 */
export class HXFormControlElement extends HXElement {
    /** @override */
    constructor () {
        super();

        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlChange = this._onCtrlChange.bind(this);
    }

    /**
     * Adds `change` and `blur` event listeners to apply
     * "changed" and "touched" states to the custom control
     * element, in addition to superclass behavior.
     *
     * - preserves `$onConnect()` hook for subclasses
     *
     * @override
     */
    connectedCallback () {
        super.connectedCallback();

        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.addEventListener('change', this._onCtrlChange);
            ctrl.addEventListener('blur', this._onCtrlBlur);
        }
    }

    /**
     * Removes event listeners added in connectedCallback,
     * in addition to superclass behavior.
     *
     * - preserves `$onDisconnect()` hook for subclasses
     *
     * @override
     */
    disconnectedCallback () {
        super.disconnectedCallback();

        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.removeEventListener('change', this._onCtrlChange);
            ctrl.removeEventListener('blur', this._onCtrlBlur);
        }
    }

    /**
     * This should be overridden by subclasses.
     *
     * Logic should make a best effort to return an HTML
     * form control element (e.g., `<input>`, `<select>`,
     * `<textarea>`, etc.).
     *
     * @abstract
     * @default undefined
     * @type {?HTMLElement}
     */
    get controlElement () {}

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
    _onCtrlBlur () {
        // communicate state via read-only, boolean content attributes
        this._stateTouched();
        this._stateDirty();
    }

    /** @private */
    _onCtrlChange () {
        // communicate state via read-only, boolean content attributes
        this._stateChanged();
        this._stateDirty();
    }

    /** @private */
    _stateChanged () {
        this.$defaultAttribute(STATE.changed, '');
        this.$emit('hxchange', { bubbles: true });
    }

    /** @private */
    _stateDirty () {
        this.$defaultAttribute(STATE.dirty, '');
        this.$emit('hxdirty', { bubbles: true });
    }

    /** @private */
    _stateTouched () {
        this.$defaultAttribute(STATE.touched, '');
        this.$emit('hxtouch', { bubbles: true });
    }
}
