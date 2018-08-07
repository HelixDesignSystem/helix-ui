import { HXElement } from './HXElement';
import { getPositionWithArrow } from '../util';
import debounce from 'lodash/debounce';
import shadowMarkup from './HXPopoverElement.html';
import shadowStyles from './HXPopoverElement.less';

/**
 * Fires when the element is concealed.
 *
 * @event Popover:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element is revealed.
 *
 * @event Popover:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-popover>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXPopoverElement extends HXElement {
    static get is () {
        return 'hx-popover';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._toggle = this._toggle.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._closeOnBackdropClick = this._closeOnBackdropClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$defaultAttribute('position', 'bottom-right');
        this._initialPosition = this.position;

        this.setAttribute('aria-hidden', !this.open);

        if (!this.id) {
            return;
        }

        this._target = this.getRootNode().querySelector(`[data-popover="${this.id}"]`);
        if (!this._target) {
            return;
        }

        this._target.addEventListener('click', this._toggle);
        window.addEventListener('resize', debounce(this._setPosition, 100));
        document.addEventListener('click', this._closeOnBackdropClick);
    }

    $onDisconnect () {
        if (!this._target) {
            return;
        }

        this._target.removeEventListener('click', this._toggle);
        window.removeEventListener('resize', debounce(this._setPosition, 100));
        document.removeEventListener('click', this._closeOnBackdropClick);
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

    _toggle () {
        this.open = !this.open;
    }

    _setPosition () {
        let offset = getPositionWithArrow(this, this._target, { position: this.position });
        this.style.top = `${offset.y}px`;
        this.style.left = `${offset.x}px`;
        this.position = offset.position;
    }

    _closeOnBackdropClick (event) {
        if (this._isBackground(event) && this.open) {
            this.open = false;
        }
    }

    _isBackground (event) {
        let inComponent = this.contains(event.target);
        let inTarget = this._target.contains(event.target);
        return !inComponent && !inTarget;
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
            this.position = this._initialPosition;
        }
    }

    get open () {
        return this.hasAttribute('open');
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
}
