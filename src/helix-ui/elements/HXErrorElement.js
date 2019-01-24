import { HXElement } from './HXElement';
import shadowMarkup from './HXErrorElement.html';
import shadowStyles from './HXErrorElement.less';

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
