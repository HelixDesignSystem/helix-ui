import { HXElement } from './HXElement';
import shadowHtml from './_hx-alert.html';
import shadowStyles from './_hx-alert.less';

const tagName = 'hx-alert';
const template = document.createElement('template');
const ICONS = {
    'error': 'exclamation-circle',
    'info': 'info-circle',
    'success': 'checkmark-circle',
    'warning': 'exclamation-triangle',
};

template.innerHTML = `
  <style>${shadowStyles}</style>
  ${shadowHtml}
`;

export class HXAlertElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);
        this._onDismiss = this._onDismiss.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('cta');
        this.$upgradeProperty('static');
        this.$upgradeProperty('status');
        this.$upgradeProperty('type');

        this._btnCta.addEventListener('click', this._onSubmit);
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    disconnectedCallback () {
        this._btnCta.removeEventListener('click', this._onSubmit);
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    static get observedAttributes () {
        return [
            'cta',
            'static',
            'status',
            'type',
        ];
    }//observedAttributes

    attributeChangedCallback (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch (attr) {
            case 'cta':
                this._btnCta.textContent = (hasValue ? newVal : '');
                break;

            case 'status':
                this._elStatus.textContent = (hasValue ? newVal : '');
                break;

            case 'type':
                if (hasValue) {
                    this._elIcon.type = (ICONS[newVal] || ICONS['info']);
                } else {
                    this._elIcon.type = ICONS['info'];
                }
                break;
        }
    }//attributeChangedCallback()

    // GETTERS
    get cta () {
        return this.getAttribute('cta');
    }

    get static () {
        return this.hasAttribute('static');
    }

    get status () {
        return this.getAttribute('status');
    }

    get type () {
        return this.getAttribute('type');
    }

    // SETTERS
    set cta (value) {
        if (value) {
            this.setAttribute('cta', value);
        } else {
            this.removeAttribute('cta');
        }
    }

    set static (value) {
        if (value) {
            this.setAttribute('static', ''); // boolean
        } else {
            this.removeAttribute('static');
        }
    }

    set status (value) {
        if (value) {
            this.setAttribute('status', value);
        } else {
            this.removeAttribute('status');
        }
    }

    set type (value) {
        if (value) {
            this.setAttribute('type', value);
        } else {
            this.removeAttribute('type');
        }
    }

    // PUBLIC METHODS
    dismiss () {
        this.remove();
    }

    // PRIVATE METHODS
    _onDismiss (evt) {
        evt.preventDefault();

        if (this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.dismiss();
        }
    }

    _onSubmit (evt) {
        evt.preventDefault();
        this.$emit('submit');
    }

    // PRIVATE GETTERS
    get _elIcon () {
        return this.shadowRoot.getElementById('icon');
    }

    get _elStatus () {
        return this.shadowRoot.getElementById('status');
    }

    get _btnCta () {
        return this.shadowRoot.getElementById('cta');
    }

    get _btnDismiss () {
        return this.shadowRoot.getElementById('dismiss');
    }
}
