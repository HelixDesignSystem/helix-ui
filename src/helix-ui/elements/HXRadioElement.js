import { HXElement } from './HXElement';

/**
 * Defines behavior for the `<hx-radio>` element.
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
     * ID of associated radio control.
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
