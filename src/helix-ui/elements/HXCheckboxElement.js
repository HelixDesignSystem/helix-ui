import { HXElement } from './HXElement';
import shadowMarkup from './HXCheckboxElement.html';
import shadowStyles from './HXCheckboxElement.less';

/**
 * Applies Shadow DOM to the `<hx-checkbox>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXCheckboxElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-checkbox';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
