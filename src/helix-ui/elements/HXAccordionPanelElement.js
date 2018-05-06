import { HXElement } from './HXElement';
import shadowMarkup from './HXAccordionPanelElement.html';
import shadowStyles from './HXAccordionPanelElement.less';

/**
 * Fires when contents of the accordion panel are revealed.
 *
 * @event AccordionPanel:open
 * @since 0.4.0
 * @type {CustomEvent}
 */

/**
 * Fires when contents of the accordion panel are disclosed.
 *
 * @event AccordionPanel:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for an `<hx-accordion-panel>` element.
 *
 * @emits AccordionPanel:close
 * @emits AccordionPanel:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
export class HXAccordionPanelElement extends HXElement {
    static get is () {
        return `hx-accordion-panel`;
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    constructor () {
        super();

        this._onClick = this._onClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this._btnToggle.addEventListener('click', this._onClick);
    }

    disconnectedCallback () {
        this._btnToggle.removeEventListener('click', this._onClick);
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);

        if (newVal !== oldVal) {
            this._btnToggle.setAttribute('aria-expanded', isOpen);
            this._elBody.setAttribute('aria-expanded', isOpen);

            this.$emit(isOpen ? 'open' : 'close');
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
        return this.shadowRoot.getElementById('toggle');
    }

    /** @private */
    get _elBody () {
        return this.shadowRoot.getElementById('body');
    }

    /** @private */
    _onClick (evt) {
        evt.preventDefault();

        if (!this.disabled) {
            this.open = !this.open;
        }
    }
}
