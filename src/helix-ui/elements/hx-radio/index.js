import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Applies Shadow DOM to the `<hx-radio>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXRadioElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-radio';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
