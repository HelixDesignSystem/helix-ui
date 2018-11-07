import { HXElement } from './HXElement';
import { HXErrorElement as shadow } from './templates.json';

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
        return `<style>${shadow.styles}</style>${shadow.markup}`;
    }
}
