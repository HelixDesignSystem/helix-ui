import { HXElement } from './HXElement';

/**
 * Fires when the element's contents are concealed.
 *
 * @event Tabpanel:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Tabpanel:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tabpanel>` element.
 *
 * @emits Tabpanel:close
 * @emits Tabpanel:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTabpanelElement extends HXElement {
    static get is () {
        return 'hx-tabpanel';
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'tabpanel');
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);

        this.setAttribute('aria-expanded', isOpen);
        this.setAttribute('tabindex', (isOpen ? 0 : -1));

        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
}
