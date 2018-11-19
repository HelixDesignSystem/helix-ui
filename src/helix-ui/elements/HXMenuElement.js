import { HXElement } from './HXElement';
import { getPosition } from '../utils/position';
import debounce from 'lodash/debounce';

const DEFAULT_POSITION = 'bottom-start';

/**
 * Fires when the element is concealed.
 *
 * @event Menu:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element is revealed.
 *
 * @event Menu:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-menu>` element.
 *
 * @emits Menu:close
 * @emits Menu:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXMenuElement extends HXElement {
    static get is () {
        return 'hx-menu';
    }

    $onCreate () {
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
        this._reposition = this._reposition.bind(this);

        this._onWindowResize = debounce(this._reposition, 50);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');

        this.$defaultAttribute('position', DEFAULT_POSITION);
        this.$defaultAttribute('role', 'menu');

        this.setAttribute('aria-hidden', !this.open);
        this.setAttribute('aria-expanded', this.open);
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
     * External element that controls menu visibility.
     * This is commonly a `<hx-disclosure>`.
     *
     * @readonly
     * @type {HTMLElement}
     */
    get controlElement () {
        return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
    }

    /**
     * Determines if the menu is revealed.
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

    // TODO: Need to re-evaluate how we handle positioning when scrolling
    /**
     * Where to position the open menu in relation to its reference element.
     *
     * @default 'bottom-start'
     * @type {PositionString}
     */
    get position () {
        return this.getAttribute('position') || DEFAULT_POSITION;
    }
    set position (value) {
        this.setAttribute('position', value);
    }

    /**
     * Reference element used to calculate open menu position.
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
     * ID of the element to position the menu.
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
        this.setAttribute('aria-expanded', isOpen);
        this.$emit(isOpen ? 'open' : 'close');

        if (isOpen) {
            this._addOpenListeners();
            this._reposition();
        } else {
            this._removeOpenListeners();
        }
    }

    /** @private */
    _onDocumentClick (evt) {
        let isDescendant = this.contains(evt.target);
        let withinControl = this.controlElement.contains(evt.target);
        let isBackground = (!isDescendant && !withinControl);

        if (this.open && isBackground) {
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
            let { x, y } = getPosition({
                element: this,
                reference: this.relativeElement,
                position: this.position,
            });

            this.style.top = `${y}px`;
            this.style.left = `${x}px`;
        }
    }
}
