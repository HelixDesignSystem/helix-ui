import { HXElement } from './HXElement';
import shadowMarkup from './HXRadioElement.html';
import shadowStyles from './HXRadioElement.less';

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
