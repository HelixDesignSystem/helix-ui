import { getPosition } from '../../lib/position';

window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-menu';

    class HxMenu extends HTMLElement {
        static get is () {
            return tagName;
        }

        static get observedAttributes () {
            return [ 'open' ];
        }

        constructor () {
            super();
            var menuId = this.getAttribute('id');
            this.$menu = document.querySelector(`[aria-controls="${menuId}"]`);
            this._onDocumentClick = this._onDocumentClick.bind(this);
        }

        connectedCallback () {
            this._upgradeProperty('open', 'position');
            document.addEventListener('click', this._onDocumentClick);
        }

        disconnectedCallback () {
            document.removeEventListener('click', this._onDocumentClick);       
        }

        attributeChangedCallback (attr, oldValue, newValue) {
            switch (attr) {
                case 'open':
                    this.setAttribute('aria-expanded', newValue !== '');
                    break;
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

        set open (value) {
            if (value) {
                this.setAttribute('open', '');
                this._setPosition();
                let openEvent = new CustomEvent('open', {
                    bubbles: true,
                });
                this.dispatchEvent(openEvent);
            } else {
                this.removeAttribute('open');
                let closeEvent = new CustomEvent('close', {
                    bubbles: true,
                });
                this.dispatchEvent(closeEvent);
            }
        } 

        get open () {
            return this.hasAttribute('open');
        }

        _setPosition () {
            var offset = getPosition(this, this.$menu, {
                position: 'bottom-start',
            });
            this.style.top = offset.y + 'px';
            this.style.left = offset.x + 'px';
            this.position = offset.position;
        }

        // A user may set a property on an _instance_ of an element, before its
        // prototype has been connected to this class. The `_upgradeProperty()`
        // method will check for any instance properties and run them through
        // the proper class setters.
        _upgradeProperty (prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
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
    customElements.define(HxMenu.is, HxMenu);
});
