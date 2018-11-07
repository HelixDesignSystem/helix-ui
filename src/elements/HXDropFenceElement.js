import { HXElement } from './HXElement';
import shadowStyles from './HXDropFenceElement.less';
import shadowMarkup from './HXDropFenceElement.html';

/**
 * Defines behavior for the `<hx-drop-fence>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.14.0
 */
export class HXDropFenceElement extends HXElement {
    static get is () {
        return 'hx-drop-fence';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
