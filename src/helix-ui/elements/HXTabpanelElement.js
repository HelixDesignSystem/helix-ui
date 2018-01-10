import { HXElement } from './HXElement';
import { HXRevealElement } from './HXRevealElement';

export class HXTabpanelElement extends HXRevealElement {
    static get is () {
        return 'hx-tabpanel';
    }

    connectedCallback () {
        super.connectedCallback();
        this.$defaultAttribute('role', 'tabpanel');
    }

    // because we are inheriting HXReveal, the only attribute we are watching
    // is "open"
    attributeChangedCallback (attr, oldVal, newVal) {
        super.attributeChangedCallback(arguments);
        this.setAttribute('tabindex', (newVal !== null) ? 0 : -1);
    }
}//HXTabpanelElement
