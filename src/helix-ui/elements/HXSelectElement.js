import { HXElement } from './HXElement';
import shadowMarkup from './HXSelectElement.html';
import shadowStyles from './HXSelectElement.less';

/**
 * Defines behavior for the `<hx-select>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXSelectElement extends HXElement {
    static get is () {
        return 'hx-select';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
