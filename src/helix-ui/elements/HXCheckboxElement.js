import { HXElement } from './HXElement';
import shadowMarkup from './HXCheckboxElement.html';
import shadowStyles from './HXCheckboxElement.less';

/**
 * Defines behavior for the `<hx-checkbox>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXCheckboxElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-checkbox';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    /** @override */
    $onConnect () {
        this.addEventListener('click', this._onClick);
    }

    /** @override */
    $onDisconnect () {
        this.removeEventListener('click', this._onClick);
    }

    /**
     * @readonly
     * @type {HTMLElement}
     */
    get controlElement () {
        return this.getRootNode().querySelector(`[id="${this.htmlFor}"]`);
    }

    /**
     * ID of associated checkbox control.
     *
     * @type {string}
     */
    get htmlFor () {
        return this.getAttribute('for') || '';
    }
    set htmlFor (value) {
        this.setAttribute('for', value);
    }

    /** @private */
    _onClick () {
        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.click();
        }
    }
}
