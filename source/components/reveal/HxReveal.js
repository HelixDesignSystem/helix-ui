window.addEventListener('WebComponentsReady', function () {
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        :host {
          display: block;
        }

        :host([open]) #content {
          display: block;
        }
    
        #content {
          display: none;
        }

        #toggle {
          background-color: transparent;
          border: none;
          color: inherit;
          font-size: 1em;
          margin: 0px;
          padding: 0px;
          text-align: left;
          width: 100%;
        }

        #toggle:empty {
          display: none;
        }

        #toggle:hover {
          cursor: pointer;
        }
      </style>

      <button id="toggle" aria-expanded="false">
        <slot name="summary"></slot>
      </button>
      <div id="content">
        <slot></slot>
      </div>
    `;

    class HxReveal extends HTMLElement {
        static get is () {
            return 'hx-reveal';
        }

        static get observedAttributes () {
            return ['open'];
        }

        constructor() {                   
            super();
            this.attachShadow({mode: 'open'});
            if (window.ShadyCSS ) { 
                ShadyCSS.prepareTemplate(template, 'hx-reveal');
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
