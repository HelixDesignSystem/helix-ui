import { HXElement } from './HXElement';
import shadowMarkup from './HXToastElement.html';
import shadowStyles from './HXToastElement.less';

const ICONS = {
    'error': 'exclamation-circle',
    'info': 'info-circle',
    'success': 'checkmark',
};

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Toast:dismiss
 * @since 0.7.0
 * @type {CustomEvent}
 */

/**
 * Fires when the CTA button is pressed.
 *
 * @event Toast:submit
 * @since 0.7.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-toast>` element.
 *
 * @emits Toast:dismiss
 * @emits Toast:submit
 * @extends HXElement
 * @hideconstructor
 * @since 0.7.0
 */
export class HXToastElement extends HXElement {
    static get is () {
        return 'hx-toast';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    constructor () {
        super();
        this._onDismiss = this._onDismiss.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('cta');
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
            'type',
        ];
    }//observedAttributes

    attributeChangedCallback (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch (attr) {
            case 'cta':
                this._btnCta.textContent = (hasValue ? newVal : '');
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

    get _btnCta () {
        return this.shadowRoot.getElementById('cta');
    }

    get _btnDismiss () {
        return this.shadowRoot.getElementById('dismiss');
    }
}
