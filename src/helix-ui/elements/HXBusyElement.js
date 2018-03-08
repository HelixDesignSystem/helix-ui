import { HXElement } from './HXElement';

const tagName = 'hx-busy';
// leave ShadowDOM template empty to remove LightDOM children
const template = document.createElement('template');

export class HXBusyElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);
    }

    connectedCallback () {
        this.$upgradeProperty('paused');
        this.$defaultAttribute('aria-hidden', true);
    }

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
}//HXBusyElement
