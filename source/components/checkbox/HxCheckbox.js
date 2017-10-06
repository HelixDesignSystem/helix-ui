const KEY = require('../../lib/KEY');
/*
 * See "Using the checkbox role" (https://goo.gl/jDZFpH)
 */

window.addEventListener('WebComponentsReady', function () {
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        :host {
            background-color: #ffffff;
            border-color: currentColor;
            border-radius: 2px;
            border-style: solid;
            border-width: 1px;
            color: #bdbdbd;
            display: inline-block;
            height: 1rem;
            vertical-align: middle;
            width: 1rem;
        }

        :host([hidden]) { display: none; }

        /* default unchecked */

        :host(:hover) {
            background-color: #e4f9f9;
            color: #16b9d4;
        }

        /* default checked */

        :host([checked]) {
            color: #0c7c84;
        }

        :host([checked]:hover) {
            background-color: #e4f9f9;
            color: #16b9d4;
        }

        /* default indeterminate (checked or unchecked) */

        :host([indeterminate]) {
            color: #0c7c84;
        }

        :host([indeterminate]:hover) {
            color: #16b9d4;
        }

        /* invalid unchecked */

        :host([invalid]) {
            border-width: 2px;
            color: #d32f2f;
        }

        :host([invalid]:hover) {
            background-color: #FFCDD2;
            color: #d32f2f;
        }

        /* invalid checked */

        /* invalid indeterminate (checked or unchecked) */

        /* disabled unchecked */

        :host([disabled]) {
            background-color: #eeeeee;
            color: #bdbdbd;
            cursor: not-allowed;
        }

        :host([disabled]:hover) {
            background-color: #eeeeee;
            color: #bdbdbd;
        }

        /* disabled checked */

        /* disabled indeterminate (checked or unchecked) */
        :host([disabled][indeterminate]) {
            color: #bdbdbd;
        }

        /* ^^ light dom overridable ^^ */
        #container {
            align-content: center;
            align-items: center;
            display: flex;
            font-size: 0.625em; /* ~10px */
            height: 100%;
            justify-content: center;
            width: 100%;
        }

        #minus,
        #tick {
            display: none;
            height: 1em;
            line-height: 1;
            width: 1em;
        }

        /* FIXME: redefine due to bug in hxIcon */
        hx-icon svg {
            fill: currentColor;
            stroke: none;
        }

        :host([checked]:not([indeterminate])) #tick {
            display: block;
        }

        :host([indeterminate]) #minus {
            display: block;
        }
      </style>

      <div id="container">
        <hx-icon type="checkmark" id="tick"></hx-icon>
        <hx-icon type="minus" id="minus"></hx-icon>
      </div>
    `;

    function _preventScroll (event) {
        if (event.keyCode == KEY.Space) {
            event.preventDefault();
        }
    }

    class HxCheckbox extends HTMLElement {
        static get is () {
            return 'hx-checkbox';
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
            this.attachShadow({mode: 'open'});
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, 'hx-checkbox');
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

            if (event.keyCode == KEY.Space) {
                event.preventDefault();
                this._toggleChecked();
            }
        }

        _onClick (event) {
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
