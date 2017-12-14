import { HXElement } from './HXElement';

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
        this.setAttribute('aria-expanded', newVal === '');
    }

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
