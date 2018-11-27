import { HXElement } from './HXElement';
import ICONS from '../icons';
import shadowStyles from './HXIconElement.less';
import shadowMarkup from './HXIconElement.html';

const DIV = document.createElement('div');

/**
 * Defines behavior for the `<hx-icon>` element.
 *
 * @extends HXElement
 * @since 0.1.0
 */
export class HXIconElement extends HXElement {
    static get is () {
        return 'hx-icon';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onConnect () {
        this.$upgradeProperty('type');
    }

    static get $observedAttributes () {
        return [ 'type' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'type') {
            this._attrTypeChange(oldVal, newVal);
        }
    }

    /** @type {string} */
    get type () {
        return this.getAttribute('type');
    }

    /** @type {string} */
    set type (newVal) {
        this.setAttribute('type', newVal);
    }

    /**
     * This function is dependent on all SVG markup containing
     * a SINGLE `<path>` element.
     *
     * This is expected SVG markup.
     * ```html
     * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
     *   <path d="..." />
     * </svg>
     * ```
     *
     * The following markup is not supported, because there are two `<path>`
     * elements in the SVG document.
     * ```html
     * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
     *   <path d="..." />
     *   <path d="..." />
     * </svg>
     * ```
     *
     * The following markup isn't supported, but it may still work.
     * However, the file contains unnecessary markup, which will directly
     * affect the file size of generated JavaScript assets.
     * ```html
     * <svg
     *   xmlns="http://www.w3.org/2000/svg"
     *   xmlns:xlink="http://www.w3.org/1999/xlink"
     *   viewBox="0 0 16 16"
     * >
     *   <defs>
     *     <path id="icon-a" d="..."/>
     *   </defs>
     *   <g fill="none" fill-rule="evenodd">
     *     <use fill="#000" xlink:href="#account-a"/>
     *   </g>
     * </svg>
     * ```
     */
    _attrTypeChange (oldVal, newVal) {
        let d = '';
        if (newVal in ICONS) {
            DIV.innerHTML = ICONS[newVal];
            let path = DIV.querySelector('path');
            d = (path ? path.getAttribute('d') : '');
        }
        this._svgPath.setAttribute('d', d);
    }

    /** @private */
    get _svgPath () {
        return this.shadowRoot.getElementById('hxPath');
    }
}
