import { HXElement } from './HXElement';

export class HXTabElement extends HXElement {
    static get is () {
        return 'hx-tab';
    }

    connectedCallback () {
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
    }

    static get observedAttributes () {
        return ['current'];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        this.setAttribute('aria-selected', newVal !== null);
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
}//HXTabElement
