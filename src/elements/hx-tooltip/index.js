import { HXElement } from '../../interfaces/HXElement/index.js';
import { Positionable } from '../traits/Positionable.js';
import { KEYS, defer, mix, generateId } from '../../utils';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

const TOOLTIP_DELAY = 500;

class _ProtoClass extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-tooltip>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTooltipElement extends _ProtoClass {
    static get is () {
        return 'hx-tooltip';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    /** @override */
    $onCreate () {
        super.$onCreate();

        // overrides Positionable default
        this.DEFAULT_POSITION = 'top-center';
        this.POSITION_OFFSET = 20;

        this.$onConnect = defer(this.$onConnect);
        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlFocus = this._onCtrlFocus.bind(this);
        this._onCtrlMouseEnter = this._onCtrlMouseEnter.bind(this);
        this._onCtrlMouseLeave = this._onCtrlMouseLeave.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._isHovering = false;
    }

    /** @override */
    $onConnect () {
        super.$onConnect();

        this.$upgradeProperty('htmlFor');

        // TODO: What if 'id' is blank?
        this.$defaultAttribute('id', `tip-${generateId()}`);
        this.$defaultAttribute('role', 'tooltip');

        this._connectToControl();
    }

    /** @override */
    $onDisconnect () {
        super.$onDisconnect();

        this._detachListeners();
    }

    /** @override */
    static get $observedAttributes () {
        return super.$observedAttributes.concat([ 'for' ]);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        if (attr === 'for') {
            this._connectToControl();
        }
    }

    /**
     * External element that controls tooltip visibility.
     *
     * Returns the first element with an "id" matching the tooltip's "htmlFor" value.
     *
     * @readonly
     * @returns {HTMLElement|undefined}
     */
    get controlElement () {
        if (this.isConnected) {
            return this.getRootNode().querySelector(`[id="${this.htmlFor}"]`);
        }
    }

    /**
     * ID of alternate control element
     *
     * @type {string}
     */
    get htmlFor () {
        return this.getAttribute('for');
    }
    set htmlFor (value) {
        this.setAttribute('for', value);
    }

    /**
     * @override
     * @param {NormalizedPositionString}
     */
    setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxTooltip');
    }

    /**
     * True, if controlElement is the active element.
     * @private
     * @type {boolean}
     */
    get _isCtrlFocused () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return false;
        }

        return (this.getRootNode().activeElement === ctrl);
    }

    /** @private */
    _attachListeners () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.addEventListener('blur', this._onCtrlBlur);
        ctrl.addEventListener('focus', this._onCtrlFocus);
        ctrl.addEventListener('mouseenter', this._onCtrlMouseEnter);
        ctrl.addEventListener('mouseleave', this._onCtrlMouseLeave);
    }

    /** @private */
    _connectToControl () {
        if (this.controlElement) {
            // detach listeners from old control element
            this._detachListeners();

            // re-memoize control element
            delete this._controlElement;
            this._controlElement = this.controlElement;

            this._makeControlAccessible();

            // attach listeners to new control element
            this._attachListeners();
        }
    }

    /**
     * Remove all possible event listeners from the control element.
     *
     * @private
     */
    _detachListeners () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.removeEventListener('blur', this._onCtrlBlur);
        ctrl.removeEventListener('focus', this._onCtrlFocus);
        ctrl.removeEventListener('keyup', this._onKeyUp);
        ctrl.removeEventListener('mouseenter', this._onCtrlMouseEnter);
        ctrl.removeEventListener('mouseleave', this._onCtrlMouseLeave);
    }

    /**
     * Hide tooltip after delay
     *
     * @private
     */
    _hide () {
        // cancel SHOW
        clearTimeout(this._showTimeout);

        if (this.open && !this._isCtrlFocused) {
            // clear old timeout (if it exists)
            clearTimeout(this._hideTimeout);

            // schedule HIDE
            this._hideTimeout = setTimeout(() => {
                this.open = false;
            }, TOOLTIP_DELAY);
        }
    }

    /** @private */
    _makeControlAccessible () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.setAttribute('aria-describedby', this.id);

        // FIXME: broken in MS browsers (https://goo.gl/dgyTrz)
        if (ctrl.tabIndex < 0) {
            ctrl.tabIndex = 0;
        }
    }

    /**
     * Handle 'blur' event on control element.
     *
     * @a11y keyboard interaction
     * @private
     */
    _onCtrlBlur () {
        this.controlElement.removeEventListener('keyup', this._onKeyUp);

        if (!this._isHovering) {
            this._hide();
        }
    }

    /**
     * Handle 'focus' on control element
     *
     * @a11y keyboard interaction
     * @a11y mouse interaction (click)
     * @private
     */
    _onCtrlFocus () {
        this.controlElement.addEventListener('keyup', this._onKeyUp);

        this._show();
    }

    /**
     * Handle 'mouseenter' on control element
     *
     * @a11y mouse interaction
     * @private
     */
    _onCtrlMouseEnter () {
        this._isHovering = true;

        this._show();
    }

    /**
     * Handle 'mouseleave' on control element
     *
     * @a11y mouse interaction
     * @private
     */
    _onCtrlMouseLeave () {
        this._isHovering = false;

        if (!this._isCtrlFocused) {
            this._hide();
        }
    }

    /**
     * Handle pressing 'Esc' key when focused.
     *
     * @a11y keyboard interaction
     * @private
     */
    _onKeyUp (event) {
        if (this.open && event.keyCode === KEYS.Escape) {
            // Prevents calling ESC handlers further up in the DOM.
            // (e.g. Modal esc-to-close)
            event.stopPropagation();

            if (!this._isHovering) {
                this.open = false;
            }
        }
    }

    /**
     * Show Tooltip after delay
     *
     * @private
     */
    _show () {
        // cancel HIDE
        clearTimeout(this._hideTimeout);

        if (!this.open) {
            // clear old timeout (if it exists)
            clearTimeout(this._showTimeout);

            // schedule SHOW
            this._showTimeout = setTimeout(() => {
                this.open = true;
            }, TOOLTIP_DELAY);
        }
    }
}
