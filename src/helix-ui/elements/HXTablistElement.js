import { HXElement } from './HXElement';

export class HXTablistElement extends HXElement {
    static get is () {
        return 'hx-tablist';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'tablist');
    }
}//HXTablistElement
