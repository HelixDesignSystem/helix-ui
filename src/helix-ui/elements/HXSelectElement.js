import { HXElement } from './HXElement';
import shadowMarkup from './HXSelectElement.html';
import shadowStyles from './HXSelectElement.less';

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
