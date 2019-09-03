import { HXElement } from '../../interfaces/HXElement/index.js';

/**
 * Fires when non-current tab is clicked.
 *
 * @event Tab:hxtabclick
 * @since 0.16.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tab>` element.
 *
 * @emits Tab:hxtabclick
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTabElement extends HXElement {
    static get is () {
        return 'hx-tab';
    }

    $onConnect () {
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
        this.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'current' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current') {
            this.setAttribute('aria-selected', newVal !== null);
        }
    }

    /**
     * True if tab is selected.
     *
     * @type {Boolean}
     */
    get current () {
        return this.hasAttribute('current');
    }
    set current (newVal) {
        if (newVal) {
            this.setAttribute('current', true);
        } else {
            this.removeAttribute('current');
        }
    }

    /** @private */
    _onClick () {
        if (!this.current) {
            this.$emit('hxtabclick', { bubbles: true });
        }
    }
}
