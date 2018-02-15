import { HXElement } from './HXElement';

export class HXMenuitemElement extends HXElement {
    static get is () {
        return 'hx-menuitem';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'menuitem');
    }
}//HXMenuitemElement
