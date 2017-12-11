import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowStyles from './_hx-checkbox.less';

const tagName = 'hx-checkbox';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <div id="container">
    <hx-icon type="checkmark" id="tick"></hx-icon>
    <hx-icon type="minus" id="minus"></hx-icon>
  </div>
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
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'checkbox');
        if (!this.hasAttribute('tabindex') && !this.disabled) {
            this.setAttribute('tabindex', 0);
        }

        this.$upgradeProperty('checked');
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('indeterminate');

        this.addEventListener('keydown', this.$preventScroll);
        this.addEventListener('keyup', this._onKeyUp);
        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback () {
        this.removeEventListener('keydown', this.$preventScroll);
        this.removeEventListener('keyup', this._onKeyUp);
        this.removeEventListener('click', this._onClick);
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

    _onKeyUp (event) {
        if (event.altKey) {
            return;
        }

        if (event.keyCode === KEYS.Space) {
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
                checked: this.checked,
            },
            bubbles: true,
        });

        this.dispatchEvent(changeEvent);
    }
}//HXCheckboxElement
