import { HXElement } from './HXElement';
import { getPositionWithArrow } from '../util';
import debounce from 'lodash/debounce';
import shadowStyles from './_hx-popover.less';

const tagName = 'hx-popover';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <div id="container" class="position-arrow">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"><slot>
  </div>
`;

export class HXPopoverElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName, template);
        this._toggle = this._toggle.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._closeOnBackdropClick = this._closeOnBackdropClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$defaultAttribute('position', 'bottom-right');
        this._initialPosition = this.position;

        if (!this.id) {
            return;
        }

        this._target = this.getRootNode().querySelector('[data-popover=' + this.id + ']');
        if (!this._target) {
            return;
        }

        this._target.addEventListener('click', this._toggle);
        window.addEventListener('resize', debounce(this._setPosition, 100));
        document.addEventListener('click', this._closeOnBackdropClick);
    }

    disconnectedCallback () {
        if (!this._target) {
            return;
        }

        this._target.removeEventListener('click', this._toggle);
        window.removeEventListener('resize', debounce(this._setPosition, 100));
        document.removeEventListener('click', this._closeOnBackdropClick);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue !== '');
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
