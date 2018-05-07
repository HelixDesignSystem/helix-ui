import { HXElement } from './HXElement';

/**
 * Fires when the element's contents are revealed.
 *
 * @event Reveal:open
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are disclosed.
 *
 * @event Reveal:close
 * @type {CustomEvent}
 */

/**
 * Defines behavior for an `<hx-reveal>` element.
 *
 * @emits Reveal:close
 * @emits Reveal:open
 * @extends HXElement
 * @hideconstructor
 */
export class HXRevealElement extends HXElement {
    static get is () {
        return 'hx-reveal';
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-expanded', isOpen);

        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    /**
     * Property reflecting the `open` HTML attribute, indicating whether or not
     * the element's contents should be shown.
     *
     * @default false
     * @type {Boolean}
     */
    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
    get open () {
        return this.hasAttribute('open');
    }
}//HXRevealElement
