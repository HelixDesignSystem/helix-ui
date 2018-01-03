import { HXElement } from './HXElement';
import { HXRevealElement } from './HXRevealElement';

export class HXTabpanelElement extends HXRevealElement {
    static get is () {
        return 'hx-tabpanel';
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$defaultAttribute('role', 'tabpanel');
        // initialize
        this.setAttribute('aria-expanded', this.open);
    }

    // because we are inheriting HXReveal, the only attribute we are watching
    // is "open"
    attributeChangedCallback (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        this.setAttribute('aria-expanded', hasValue);
        this.setAttribute('tabindex', hasValue ? 0 : -1);
    }
}//HXTabpanelElement
