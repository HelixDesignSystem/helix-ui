import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Fires when the element's contents are concealed.
 *
 * @event AccordionPanel:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event AccordionPanel:open
 * @since 0.4.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-accordion-panel>` element.
 *
 * @emits AccordionPanel:close
 * @emits AccordionPanel:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
export class HXAccordionPanelElement extends HXElement {
    static get is () {
        return 'hx-accordion-panel';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this._btnToggle.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this._btnToggle.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch  (attr) {
            case 'disabled':
                this._btnToggle.disabled = hasValue;
                break;
            case 'open':
                this._btnToggle.setAttribute('aria-expanded', hasValue);
                this._elBody.setAttribute('aria-expanded', hasValue);
                this.$emit(hasValue ? 'open' : 'close');
                break;
        }
    }

    /**
     * @default false
     * @type {Boolean}
     * @description
     * Property reflecting the "open" HTML attribute, indicating whether or not
     * the element's contents (excluding the header) should be shown.
     */
    get open () {
        return this.hasAttribute('open');
    }
    set open (newVal) {
        if (newVal) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    /** @private */
    get _btnToggle () {
        return this.shadowRoot.getElementById('hxToggle');
    }

    /** @private */
    get _elBody () {
        return this.shadowRoot.getElementById('hxBody');
    }

    /** @private */
    _onClick (evt) {
        evt.preventDefault();

        if (!this.disabled) {
            this.open = !this.open;
        }
    }
}
