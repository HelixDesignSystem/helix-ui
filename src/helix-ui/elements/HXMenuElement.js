import { HXElement } from './HXElement';
import { getPosition } from '../util';

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
        this._initialPosition = this.position;
        document.addEventListener('click', this._onDocumentClick);
    }

    disconnectedCallback () {
        document.removeEventListener('click', this._onDocumentClick);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-expanded', newValue !== '');
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
            return document.getElementById(this.relativeTo);
        } else {
            return document.querySelector(`[aria-controls="${this.id}"]`);
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
            this.$emit('open');
        } else {
            this.removeAttribute('open');
            this.$emit('close');
            //this.position = this._initialPosition;
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
}//HXMenuElement
