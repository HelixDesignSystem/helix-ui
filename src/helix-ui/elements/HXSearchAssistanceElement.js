import { HXElement } from './HXElement';
import { getPosition } from '../utils/position';
import debounce from 'lodash/debounce';

const DEFAULT_POSITION = 'bottom-start';

/**
 * Fires when the element's contents are concealed.
 *
 * @event SearchAssistance:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event SearchAssistance:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-search-assistance>` element.
 *
 * @emits SearchAssistance:close
 * @emits SearchAssistance:open
 * @extends HXElement
 * @hideconstructor
 * @see HXSearchElement
 * @since 0.6.0
 */
export class HXSearchAssistanceElement extends HXElement {
    static get is () {
        return 'hx-search-assistance';
    }

    $onCreate () {
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
        this._reposition = this._reposition.bind(this);

        this._onWindowResize = debounce(this._reposition, 50);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');

        this.$defaultAttribute('position', DEFAULT_POSITION);
        this._initialPosition = this.position;

        this.setAttribute('aria-hidden', !this.open);
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
     * External element that controls <hx-search-assistance> visibility.
     *
     * @readonly
     * @type {HTMLElement}
     */
    get controlElement () {
        return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
    }

    /**
     * Determine if <hx-search-assistance> is visible.
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
     * Where to position <hx-search-assistance> in relation to its reference element.
     *
     * @default 'bottom-start'
     * @type {PositionString}
     */
    get position () {
        return this.getAttribute('position') || DEFAULT_POSITION;
    }
    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    /**
     * Reference element used to calculate <hx-search-assistance> position.
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
     * ID of an element relatively to <hx-search-assistance>.
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
    _onDocumentScroll () {
        this._reposition();
    }

    /** @private */
    _removeOpenListeners () {
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
