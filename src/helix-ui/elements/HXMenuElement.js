import { HXElement } from './HXElement';
import { getPosition } from '../util';

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

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super();
        this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');
        this.$defaultAttribute('position', 'bottom-start');
        this.$defaultAttribute('role', 'menu');
        this._initialPosition = this.position;
        document.addEventListener('click', this._onDocumentClick);
    }

    disconnectedCallback () {
        document.removeEventListener('click', this._onDocumentClick);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-expanded', isOpen);

        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        if (this.hasAttribute('position')) {
            return this.getAttribute('position');
        }
        return undefined;
    }

    set relativeTo (value) {
        this.setAttribute('relative-to', value);
    }

    get relativeTo () {
        return this.getAttribute('relative-to');
    }

    get relativeElement () {
        if (this.relativeTo) {
            return this.getRootNode().getElementById(this.relativeTo);
        } else {
            return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    _setPosition () {
        var offset = getPosition(this, this.relativeElement, {
            position: this.position,
            margin: 2,
        });
        this.style.top = offset.y + 'px';
        this.style.left = offset.x + 'px';
    }

    _isDescendant (el) {
        if (el.closest(`hx-menu[id="${this.id}"]`)) {
            return true;
        }
        return false;
    }

    _isDisclosure (el) {
        if (el.closest(`hx-disclosure[aria-controls="${this.id}"]`)) {
            return true;
        }
        return false;
    }

    _onDocumentClick (event) {
        if (!this._isDescendant(event.target) && !this._isDisclosure(event.target)) {
            this.open = false;
        }
    }
}
