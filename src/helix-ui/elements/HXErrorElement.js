import { HXElement } from './HXElement';
import shadowStyles from './HXErrorElement.less';
import shadowMarkup from './HXErrorElement.html';

export class HXErrorElement extends HXElement {
    static get is () {
        return 'hx-error';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}//HXErrorElement
