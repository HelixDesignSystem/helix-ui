import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-busy>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
export class HXBusyElement extends HXElement {
    static get is () {
        return 'hx-busy';
    }

    static get template () {
        return ``;
    }

    connectedCallback () {
        this.$upgradeProperty('paused');
        this.$defaultAttribute('aria-hidden', true);
    }

    /**
     * Pause or resume animation.
     *
     * @default false
     * @type {Boolean}
     */
    get paused () {
        return this.hasAttribute('paused');
    }
    set paused (isPaused) {
        if (isPaused) {
            this.setAttribute('paused', '');
        } else {
            this.removeAttribute('paused');
        }
    }
}
