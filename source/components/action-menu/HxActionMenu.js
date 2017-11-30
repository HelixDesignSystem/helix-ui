import { PositionUtil } from '../../lib/position';

window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-action-menu';
    const template = document.createElement('template');

    template.innerHTML = `
        <style>${require('./HxActionMenu.less')}</style>
        ${require('./HxActionMenu.html')}
    `;

    class HxActionMenu extends HTMLElement {
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
            this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(this);
            }
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.$toggle = this.querySelector('[hx-menu-toggle]');
            this._toggleMenu = this._toggleMenu.bind(this);
            this.$menu = this.shadowRoot.getElementById('body');
        }

        connectedCallback () {
            if (!this.$menu) {
                return;
            }

            this.$toggle.addEventListener('click', this._toggleMenu);
            this.$menu.addEventListener('click', this._toggleMenu);            
        }

        disconnectedCallback () {
            this.$toggle.removeEventListener('click', this._toggleMenu);
            this.$menu.removeEventListener('click', this._toggleMenu);
            this.$menu = null;
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
            return this.getAttribute('position');
        }

        set open (value) {
            if (value) {
                this.setAttribute('open', '');
            } else {
                this.removeAttribute('open');
            }
        }

        get open () {
            return this.hasAttribute('open');
        }

        _toggleMenu () {
            this.open = !this.open;

            if (this.open) {
                this._setPosition();
            }
        }

        _setPosition () {
            var offset = PositionUtil.getOffsetValues(this, this.$menu, this.position);

            this.position = offset.position;
            this.style.top = offset.y + 'px';
            this.style.left = offset.x + 'px';
        }
    }
    customElements.define(HxActionMenu.is, HxActionMenu)
});
