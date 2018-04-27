import { HXElement } from './HXElement';
import shadowStyles from './HXErrorElement.less';

const tagName = 'hx-error';
const template = document.createElement('template');

template.innerHTML = `
  <style>${shadowStyles}</style>
  <hx-icon type="exclamation-circle"></hx-icon>
  <slot></slot>
`;

export class HXErrorElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);
    }
}//HXErrorElement
