import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

const ICONS = {
    'error': 'exclamation-circle',
    'info': 'info-circle',
    'success': 'checkmark-circle',
    'warning': 'exclamation-triangle',
};

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Alert:dismiss
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the CTA button is pressed.
 *
 * @event Alert:submit
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-alert>` element.
 *
 * @emits Alert:dismiss
 * @emits Alert:submit
 * @extends HXElement
 * @hideconstructor
 * @since 0.6.0
 */
export class HXAlertElement extends HXElement {
    static get is () {
        return 'hx-alert';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('cta');
        this.$upgradeProperty('persist');
        this.$upgradeProperty('status');
        this.$upgradeProperty('type');

        this._btnCta.addEventListener('click', this._onSubmit);
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnCta.removeEventListener('click', this._onSubmit);
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    static get $observedAttributes () {
        return [
            'cta',
            'status',
            'type',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
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
    }

    /**
     * Text for the Call To Action button.
     * If blank, the button will not be shown.
     *
     * @default ""
     * @type {String}
     */
    get cta () {
        return this.getAttribute('cta');
    }
    set cta (value) {
        if (value) {
            this.setAttribute('cta', value);
        } else {
            this.removeAttribute('cta');
        }
    }

    /**
     * Property reflecting the `persist` HTML attribute, indicating whether the
     * alert may be dismissed. If true, the dismiss button will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get persist () {
        return this.hasAttribute('persist');
    }
    set persist (value) {
        if (value) {
            this.setAttribute('persist', '');
        } else {
            this.removeAttribute('persist');
        }
    }

    /**
     * Status text to display before the alert message.
     * If blank, it will not be shown.
     *
     * @default ""
     * @type {String}
     */
    get status () {
        return this.getAttribute('status');
    }
    set status (value) {
        if (value) {
            this.setAttribute('status', value);
        } else {
            this.removeAttribute('status');
        }
    }

    /**
     * Indicates the type of alert to display.
     * Valid values are "info", "success", "warning", and "error".
     *
     * @default "info"
     * @type {String}
     */
    get type () {
        return this.getAttribute('type');
    }
    set type (value) {
        if (value) {
            this.setAttribute('type', value);
        } else {
            this.removeAttribute('type');
        }
    }

    /**
     * Dismiss the alert (removes element from the DOM).
     */
    dismiss () {
        if (!this.persist && this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.remove();
        }
    }

    /**
     * Simulate a mouse click on the CTA button.
     */
    submit () {
        this.$emit('submit');
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    _onSubmit (evt) {
        evt.preventDefault();
        this.submit();
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elStatus () {
        return this.shadowRoot.getElementById('hxStatus');
    }

    /** @private */
    get _btnCta () {
        return this.shadowRoot.getElementById('hxCta');
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}
