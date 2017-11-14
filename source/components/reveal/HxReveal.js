window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-reveal';
    const template = document.createElement('template');

    template.innerHTML = `
      <style>${require('./HxReveal.less')}</style>
      ${require('./HxReveal.html')}
    `;

    class HxReveal extends HTMLElement {
        static get is () {
            return tagName;
        }

        static get observedAttributes () {
            return ['open'];
        }

        constructor () {
            super();
            this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(this);
            }
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._btnToggle = this.shadowRoot.querySelector('#toggle');
            this._toggle = this._toggle.bind(this);
        }

        connectedCallback () {
            this._btnToggle.addEventListener('click', this._toggle);
        }

        disconnectedCallback () {
            this._btnToggle.removeEventListener('click', this._toggle);
        }

        attributeChangedCallback (attr, oldValue, newValue) {
            if (attr === 'open') {
                this._btnToggle.setAttribute('aria-expanded', newValue === '');
            }
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

        _toggle () {
            this.open = !this.open;
        }
    }
    customElements.define(HxReveal.is, HxReveal)
});
