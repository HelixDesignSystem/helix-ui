import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-tab>` element.
 *
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
    }

    static get $observedAttributes () {
        return [ 'current' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current') {
            this.setAttribute('aria-selected', newVal !== null);
        }
    }

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
}
