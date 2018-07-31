import { HXElement } from './HXElement';
import ICONS from '../icons';

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

    static get icons () {
        return ICONS;
    }

    $onCreate (type) {
        if (type) {
            this.type = type;
        }
    }

    $onConnect () {
        this.$upgradeProperty('type');
        this.$defaultAttribute('aria-hidden', true);
        this._render();
    }

    static get $observedAttributes () {
        return [ 'type' ];
    }

    $onAttributeChange (attr) {
        if (attr === 'type') {
            this._render();
        }
    }

    get type () {
        return this.getAttribute('type');
    }

    set type (newVal) {
        this.setAttribute('type', newVal);
    }

    _render () {
        // erase previously injected markup
        this.innerHTML = '';

        if (this.type in ICONS) {
            // create surrogate DIV to add raw SVG markup
            const tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = ICONS[this.type];
            // grab SVG from surrogate DIV
            const svg = tmpDiv.firstElementChild;
            // Prevent IE/Edge from adding SVG to focus order
            svg.setAttribute('focusable', 'false');

            // inject SVG into Light DOM
            this.appendChild(svg);
        }
    }//_render()
}
