import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Applies Shadow DOM to the `<hx-select>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXSelectElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-select';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
