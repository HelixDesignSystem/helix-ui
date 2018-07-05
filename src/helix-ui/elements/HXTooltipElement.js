import { HXElement } from './HXElement';
import { getPositionWithArrow } from '../util';
import debounce from 'lodash/debounce';
import shadowMarkup from './HXTooltipElement.html';
import shadowStyles from './HXTooltipElement.less';

/**
 * Fires when the element's contents are concealed.
 *
 * @event Tooltip:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Tooltip:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tooltip>` element.
 *
 * @emits Tooltip:close
 * @emits Tooltip:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTooltipElement extends HXElement {
    static get is () {
        return 'hx-tooltip';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onShow = this._onShow.bind(this);
        this._onHide = this._onHide.bind(this);
        this._onClick = this._onClick.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    $onConnect () {
        this.$defaultAttribute('position', 'top');
        this.initialPosition = this.position;
        this.$upgradeProperty('open');
        this.$defaultAttribute('role', 'tooltip');

        this.setAttribute('aria-hidden', !this.open);

        if (this.id) {
            this._target = this.getRootNode().querySelector('[data-tooltip=' + this.id + ']');
        } else {
            return;
        }
        this._connectHandlers();
    }

    $onDisconnect () {
        if (!this._target) {
            return;
        }
        this._destroyHandlers();
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            let isOpen = (newVal !== null);
            this.setAttribute('aria-hidden', !isOpen);
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    /**
     * Where to position the menu in relation to its reference element.
     *
     * @default "top"
     * @type {PositionString}
     */
    get position () {
        return this.getAttribute('position');
    }
    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    /**
     * Event that will trigger the appearance of the tooltip.
     *
     * @default "mouseenter"
     * @type {String}
     */
    get triggerEvent () {
        return this.getAttribute('trigger-event');
    }
    set triggerEvent (value) {
        if (value) {
            this.setAttribute('trigger-event', value);
        } else {
            this.removeAttribute('trigger-event');
        }
    }

    /**
     * Determines if the tooltip is revealed.
     *
     * @default false
     * @type {Boolean}
     */
    get open () {
        return this.hasAttribute('open');
    }
    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
            this.position = this.initialPosition;
        }
    }

    /** @private */
    _connectHandlers () {
        window.addEventListener('resize', debounce(this._setPosition,100));
        if (this.triggerEvent === 'click') {
            document.addEventListener('click', this._onDocumentClick);
            this._target.addEventListener('click', this._onClick);
        } else {
            this._target.addEventListener('focus', this._onShow);
            this._target.addEventListener('blur', this._onHide);
            this._target.addEventListener('mouseenter', this._onShow);
            this._target.addEventListener('mouseleave', this._onHide);
        }
    }

    /** @private */
    _destroyHandlers () {
        window.removeEventListener('resize', debounce(this._setPosition,100));
        document.removeEventListener('click', this._onDocumentClick);
        this._target.removeEventListener('focus', this._onShow);
        this._target.removeEventListener('blur', this._onHide);
        this._target.removeEventListener('mouseenter', this._onShow);
        this._target.removeEventListener('mouseleave', this._onHide);
        this._target.removeEventListener('click', this._onClick);
    }

    /** @private */
    _setPosition () {
        var offset = getPositionWithArrow(this, this._target, { 'position': this.position });
        this.style.top = `${offset.y}px`;
        this.style.left = `${offset.x}px`;
        this.position = offset.position;
    }

    /** @private */
    _onHide () {
        if (this._showTimer) {
            clearTimeout(this._showTimer);
        }
        this._onHideTimer = setTimeout(() => {
            this.open = false;
        }, 1600);
    }

    /** @private */
    _onShow () {
        if (this._onHideTimer) {
            clearTimeout(this._onHideTimer);
        }
        this._showTimer = setTimeout(() => {
            this.open = true;
        }, 500);
    }

    /** @private */
    _onClick () {
        this.open = !this.open;
    }

    /** @private */
    _onDocumentClick (event) {
        let inComponent = this.contains(event.target);
        let inTarget = this._target.contains(event.target);
        let isBackground = !inComponent && !inTarget;

        if (isBackground) {
            this.open = false;
        }
    }
}
