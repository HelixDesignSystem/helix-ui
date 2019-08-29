import { HXElement } from '../../interfaces/HXElement/index.js';

/**
 * Fires when the element's contents are concealed.
 *
 * @event Reveal:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Reveal:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-reveal>` element.
 *
 * @emits Reveal:close
 * @emits Reveal:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXRevealElement extends HXElement {
    static get is () {
        return 'hx-reveal';
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            let isOpen = (newVal !== null);
            this.setAttribute('aria-expanded', isOpen);
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
}
