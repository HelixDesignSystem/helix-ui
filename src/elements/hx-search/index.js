import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Defines behavior for the `<hx-search>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @see HXSearchAssistanceElement
 * @since 0.4.0
 */
export class HXSearchElement extends HXElement {
    static get is () {
        return 'hx-search';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
