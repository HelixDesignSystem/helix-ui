import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowStyles from './_hx-checkbox.less';

const tagName = 'hx-checkbox';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <label id="container">
    <input type="checkbox" id="nativeControl"/>
    <div id="customControl">
      <hx-icon type="checkmark" id="tick"></hx-icon>
      <hx-icon type="minus" id="minus"></hx-icon>
    </div>
  </label>
`;

export class HXCheckboxElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [
            'checked',
            'disabled',
            'indeterminate',
        ];
    }

    constructor () {
        super(tagName, template);
        this._input = this.shadowRoot.getElementById('nativeControl');
        this._onChange = this._onChange.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('checked');
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('indeterminate');
        this._input.addEventListener('change', this._onChange);
    }

    disconnectedCallback () {
        this._input.removeEventListener('change', this._onChange);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);
        switch (attr) {
            case 'indeterminate':
                this._input.indeterminate = hasValue;
                break;
            case 'checked':
                if (this._input.checked !== hasValue) {
                    this._input.checked = hasValue;
                }
                break;
            case 'disabled':
                this._input.disabled = hasValue;
                break;
        }
    }//attributeChangedCallback()

    set checked (value) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    get checked () {
        return this.hasAttribute('checked');
    }

    set indeterminate (value) {
        if (value) {
            this.setAttribute('indeterminate', '');
        } else {
            this.removeAttribute('indeterminate');
        }
    }

    get indeterminate () {
        return this.hasAttribute('indeterminate');
    }

    set disabled (value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled () {
        return this.hasAttribute('disabled');
    }

    _onChange (evt) {
        // Update internal state
        this.checked = evt.target.checked;

        // Prevent 'change' listeners from firing twice in polyfilled browsers.
        evt.stopImmediatePropagation();

        // Emit a new 'change' event from the custom element
        this.$emit('change');
    }
}//HXCheckboxElement
