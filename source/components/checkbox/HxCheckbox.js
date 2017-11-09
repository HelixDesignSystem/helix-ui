const KEY = require('../../lib/KEY');
/*
 * See "Using the checkbox role" (https://goo.gl/jDZFpH)
 */

window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-checkbox';
    const template = document.createElement('template');

    template.innerHTML = `
      <style>${require('./HxCheckbox.less')}</style>
      <div id="container">
        <hx-icon type="checkmark" id="tick"></hx-icon>
        <hx-icon type="minus" id="minus"></hx-icon>
      </div>
    `;

    function _preventScroll (event) {
        if (event.keyCode === KEY.Space) {
            event.preventDefault();
        }
    }

    class HxCheckbox extends HTMLElement {
        static get is () {
            return tagName;
        }

        static get observedAttributes () {
            return [
                'checked',
                'disabled',
                'indeterminate'
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
        }

        connectedCallback () {
            if (!this.hasAttribute('role')) {
                this.setAttribute('role', 'checkbox');
            }
            if (!this.hasAttribute('tabindex') && !this.disabled) {
                this.setAttribute('tabindex', 0);
            }

            this._upgradeProperty('checked');
            this._upgradeProperty('disabled');
            this._upgradeProperty('indeterminate');

            this.addEventListener('keydown', _preventScroll);
            this.addEventListener('keyup', this._onKeyUp);
            this.addEventListener('click', this._onClick);
        }

        disconnectedCallback () {
            this.removeEventListener('keydown', _preventScroll);
            this.removeEventListener('keyup', this._onKeyUp);
            this.removeEventListener('click', this._onClick);
        }

        set checked (value) {
            if (Boolean(value)) {
                this.setAttribute('checked', '');
            } else {
                this.removeAttribute('checked');
            }
        }

        get checked () {
            return this.hasAttribute('checked');
        }

        set disabled (value) {
            if (Boolean(value)) {
                this.setAttribute('disabled', '');
            } else {
                this.removeAttribute('disabled');
            }
        }

        get disabled () {
            return this.hasAttribute('disabled');
        }

        set indeterminate (value) {
            if (Boolean(value)) {
                this.setAttribute('indeterminate', '');
            } else {
                this.removeAttribute('indeterminate');
            }
        }

        get indeterminate () {
            return this.hasAttribute('indeterminate');
        }

        attributeChangedCallback (name, oldValue, newValue) {
            const hasValue = newValue !== null;
            switch (name) {
                case 'indeterminate':
                    if (hasValue) {
                        this.setAttribute('aria-checked', 'mixed');
                    }
                    break;

                case 'checked':
                    if (!this.indeterminate) {
                        this.setAttribute('aria-checked', hasValue);
                    }
                    break;

                case 'disabled':
                    this.setAttribute('aria-disabled', hasValue);
                    if (hasValue) {
                        this.removeAttribute('tabindex');
                        this.blur();
                    } else {
                        this.setAttribute('tabindex', '0');
                    }
                    break;
            }
        }//attributeChangedCallback()

        _onKeyUp (event) {
            if (event.altKey) {
                return;
            }

            if (event.keyCode === KEY.Space) {
                event.preventDefault();
                this._toggleChecked();
            }
        }

        _onClick () {
            this._toggleChecked();
        }

        _toggleChecked () {
            if (this.disabled) {
                return;
            }
            this.indeterminate = false;
            this.checked = !this.checked;

            let changeEvent = new CustomEvent('change', {
                detail: {
                    checked: this.checked
                },
                bubbles: true
            });

            this.dispatchEvent(changeEvent);
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
    customElements.define(HxCheckbox.is, HxCheckbox)
});
