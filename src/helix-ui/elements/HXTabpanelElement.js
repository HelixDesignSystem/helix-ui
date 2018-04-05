import { HXElement } from './HXElement';

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
}//HXTabpanelElement
