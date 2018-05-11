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

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super();
        this._show = this._show.bind(this);
        this._hide = this._hide.bind(this);
        this._toggle = this._toggle.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._closeOnBackgroundClick = this._closeOnBackgroundClick.bind(this);
    }

    connectedCallback () {
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

    disconnectedCallback () {
        if (!this._target) {
            return;
        }
        this._destoryAllHandlers();
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-hidden', !isOpen);

        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    _hide () {
        if (this._showTimer) {
            clearTimeout(this._showTimer);
        }
        this._hideTimer = setTimeout(() => {
            this.open = false;
        }, 1600);
    }

    _show () {
        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
        }
        this._showTimer = setTimeout(() => {
            this.open = true;
        }, 500);
    }

    _toggle () {
        this.open = !this.open;
    }

    _closeOnBackgroundClick (event) {
        if (this._isBackground(event)) {
            this.open = false;
        }
    }

    _connectHandlers () {
        window.addEventListener('resize', debounce(this._setPosition,100));
        if (this.triggerEvent === 'click') {
            document.addEventListener('click', this._closeOnBackgroundClick);
            this._target.addEventListener('click', this._toggle);
        } else {
            this._target.addEventListener('focus', this._show);
            this._target.addEventListener('blur', this._hide);
            this._target.addEventListener('mouseenter', this._show);
            this._target.addEventListener('mouseleave', this._hide);
        }
    }

    _destoryAllHandlers () {
        window.removeEventListener('resize', debounce(this._setPosition,100));
        document.removeEventListener('click', this._closeOnBackgroundClick);
        this._target.removeEventListener('focus', this._show);
        this._target.removeEventListener('blur', this._hide);
        this._target.removeEventListener('mouseenter', this._show);
        this._target.removeEventListener('mouseleave', this._hide);
        this._target.removeEventListener('click', this._toggle);
    }

    _setPosition () {
        var offset = getPositionWithArrow(this, this._target, { 'position':this.position });
        this.style.top = `${offset.y}px`;
        this.style.left = `${offset.x}px`;
        this.position = offset.position;
    }

    _isBackground (event) {
        let inComponent = this.contains(event.target);
        let inTarget = this._target.contains(event.target);
        return !inComponent && !inTarget ;
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        return this.getAttribute('position');
    }

    set triggerEvent (value) {
        if (value) {
            this.setAttribute('trigger-event', value);
        } else {
            this.removeAttribute('trigger-event');
        }
    }

    get triggerEvent () {
        return this.getAttribute('trigger-event');
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

    get open () {
        return this.hasAttribute('open');
    }
}
