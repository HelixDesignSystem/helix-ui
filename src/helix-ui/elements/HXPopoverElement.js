import { HXElement } from './HXElement';
import { getPositionWithArrow } from '../utils/position';
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
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
        this._reposition = this._reposition.bind(this);

        this._onWindowResize = debounce(this._reposition, 100);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');
        this.setAttribute('aria-hidden', !this.open);

        this.$defaultAttribute('position', 'bottom-right');
        this._initialPosition = this.position;
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            this._attrOpenChange(oldVal, newVal);
        }
    }

    /**
     * External element that controls popover visibility.
     * This is commonly a `<button>` or `<hx-disclosure>`.
     *
     * @readonly
     * @type {HTMLElement}
     */
    get controlElement () {
        return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
    }

    /**
     * Determines if the popover is revealed.
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
        } else {
            this.removeAttribute('open');
        }
    }

    /**
     * Where to position the popover in relation to its reference element.
     *
     * @default 'top'
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
     * Reference element used to calculate popover position.
     *
     * @readonly
     * @type {HTMLElement}
     */
    get relativeElement () {
        if (this.relativeTo) {
            return this.getRootNode().getElementById(this.relativeTo);
        } else {
            return this.controlElement;
        }
    }

    /**
     * ID of an element to relatively position the menu against.
     *
     * @type {String}
     */
    get relativeTo () {
        return this.getAttribute('relative-to');
    }
    set relativeTo (value) {
        this.setAttribute('relative-to', value);
    }

    /** @private */
    _addOpenListeners () {
        document.addEventListener('click', this._onDocumentClick);
        document.addEventListener('scroll', this._onDocumentScroll);
        window.addEventListener('resize', this._onWindowResize);
    }

    /** @private */
    _attrOpenChange (oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-hidden', !isOpen);
        this.$emit(isOpen ? 'open' : 'close');

        if (isOpen) {
            this._addOpenListeners();
            this._reposition();
        } else {
            this._removeOpenListeners();
            this.position = this._initialPosition;
        }
    }

    /** @private */
    _onDocumentClick (evt) {
        let inComponent = this.contains(evt.target);
        let inControl = this.controlElement.contains(evt.target);
        let _isBackground = (!inComponent && !inControl);

        if (this.open && _isBackground) {
            this.open = false;
        }
    }

    /** @private */
    _onDocumentScroll () {
        this._reposition();
    }

    /** @private */
    _removeOpenListeners () {
        document.removeEventListener('click', this._onDocumentClick);
        document.removeEventListener('scroll', this._onDocumentScroll);
        window.removeEventListener('resize', this._onWindowResize);
    }

    /** @private */
    _reposition () {
        if (this.relativeElement) {
            let offset = getPositionWithArrow(this, this.relativeElement, {
                position: this.position,
            });
            this.style.top = `${offset.y}px`;
            this.style.left = `${offset.x}px`;
            this.position = offset.position;
        }
    }
}
