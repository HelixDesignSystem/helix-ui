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
            this.attachShadow({mode: 'open'});
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(this);
            }
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._btnToggle = this.shadowRoot.querySelector('#toggle');
            this.toggle = this.toggle.bind(this);
        }

        connectedCallback () {
            this._btnToggle.addEventListener('click', this.toggle);
        }

        disconnectedCallback () {
            this._btnToggle.removeEventListener('click', this.toggle);
        }

        attributeChangedCallback (attr, oldValue, newValue) {
            if (attr === 'open') {
                this._btnToggle.setAttribute('aria-expanded', newValue === '');
            }
        }

        toggle () {
            if (this.getAttribute('open') === '') {
                this.close();
            } else {
                this.open();
            }
        }

        open () {
            this.setAttribute('open', '');
        }

        close () {
            this.removeAttribute('open');
        }
    }
    customElements.define(HxReveal.is, HxReveal)
});
