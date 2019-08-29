import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Defines behavior for the `<hx-error>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
export class HXErrorElement extends HXElement {
    static get is () {
        return 'hx-error';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
