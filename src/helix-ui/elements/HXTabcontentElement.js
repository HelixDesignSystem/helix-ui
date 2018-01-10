import { HXElement } from './HXElement';

export class HXTabcontentElement extends HXElement {
    static get is () {
        return 'hx-tabcontent';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'presentation');
    }
}//HXTabcontentElement
