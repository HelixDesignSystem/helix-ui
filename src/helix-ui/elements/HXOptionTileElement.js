import { HXElement } from './HXElement';
import shadowStyles from './HXOptionTileElement.less';
import shadowMarkup from './HXOptionTileElement.html';

/**
 * Defines behavior for the `<hx-option-tile>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXOptionTileElement extends HXElement {
    static get is () {
        return 'hx-option-tile';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
}
