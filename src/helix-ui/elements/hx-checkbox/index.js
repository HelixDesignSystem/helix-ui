import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

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
