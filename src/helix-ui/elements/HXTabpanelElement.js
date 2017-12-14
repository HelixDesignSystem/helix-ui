import { HXElement } from './HXElement';
import shadowStyles from './_hx-tabpanel.less';

const tagName = 'hx-tabpanel';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <slot id="content"></slot>
`;

export class HXTabpanelElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$defaultAttribute('role', 'tabpanel');
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
}//HXTabpanelElement
