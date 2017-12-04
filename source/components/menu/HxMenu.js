import { getPosition } from '../../lib/position';

window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-menu';

    class HxMenu extends HTMLElement {
        static get is () {
            return tagName;
        }

        static get observedAttributes () {
            return [
                'open',
                'position',
            ];
        }

        constructor () {
            super();
            var menuId = this.getAttribute('id');
            this.$menu = document.querySelector(`[aria-controls="${menuId}"]`);
        }

        connectedCallback () {
            this._upgradeProperty('open');
        }

        disconnectedCallback () {
        }

        attributeChangedCallback (attr, oldValue, newValue) {
            switch (attr) {
                case 'open':
                    this.setAttribute('aria-expanded', newValue !== '');
                    break;
                case 'position':
                    if (this.open && oldValue !== newValue) {
                        this._setPosition();
                    }
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
            } else {
                this.removeAttribute('open');
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
    }
    customElements.define(HxMenu.is, HxMenu);
});
