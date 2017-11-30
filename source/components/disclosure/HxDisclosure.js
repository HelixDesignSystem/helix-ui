const KEY = require('../../lib/KEY');

window.addEventListener('WebComponentsReady', function () {
    function _preventScroll (event) {
        if (event.keyCode === KEY.Space) {
            event.preventDefault();
        }
    }

    class HxDisclosure extends HTMLElement {
        static get is () {
            return 'hx-disclosure';
        }

        static get observedAttributes () {
            return [ 'aria-expanded' ];
        }

        connectedCallback () {
            this.setAttribute('role', 'button');
            this.setAttribute('tabindex', 0);

            if (this.target) {
                this.expanded = this.target.hasAttribute('open');
            } else {
                this.expanded = false;
            }

            this.addEventListener('click', this._toggle);
            this.addEventListener('keydown', _preventScroll);
            this.addEventListener('keyup', this._keyUp);
        }

        disconnectedCallback () {
            this.removeEventListener('click', this._toggle);
            this.removeEventListener('keydown', _preventScroll);
            this.removeEventListener('keyup', this._keyUp);
        }

        attributeChangedCallback (attr, oldVal, newVal) {
            if (this.target) {
                this.target.open = (newVal === 'true');
            }
        }

        get expanded () {
            return this.getAttribute('aria-expanded') === 'true';
        }
    
        set expanded (newVal) {
            this.setAttribute('aria-expanded', !!newVal);
        }
    
        get target () {
            if (!this._target) {
                let targetId = this.getAttribute('aria-controls');
                this._target = document.getElementById(targetId);
            }
            return this._target;
        }
    
        _keyUp (event) {
            switch (event.keyCode) {
                case KEY.Space:
                case KEY.Enter:
                    this._toggle();
                    break;
                default: 
                    break;
            }
        }
    
        _toggle () {
            this.expanded = !this.expanded;
        }
    }
    customElements.define(HxDisclosure.is, HxDisclosure);
});
