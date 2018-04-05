import { HXElement } from './HXElement';
import Icons from '../icons';

export class HXIconElement extends HXElement {
    static get is () {
        return 'hx-icon';
    }

    static get icons () {
        return Icons;
    }

    static get observedAttributes () {
        return [ 'type' ];
    }

    constructor (type) {
        super();

        if (type) {
            this.type = type;
        }
    }

    connectedCallback () {
        this.$upgradeProperty('type');
        this.$defaultAttribute('aria-hidden', true);
        this._render();
    }

    attributeChangedCallback () {
        this._render();
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

        if (this.type in Icons) {
            // create surrogate DIV to add raw SVG markup
            const tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = Icons[this.type];
            // grab SVG from surrogate DIV
            const svg = tmpDiv.firstElementChild;
            // Prevent IE/Edge from adding SVG to focus order
            svg.setAttribute('focusable', 'false');

            // inject SVG into Light DOM
            this.appendChild(svg);
        }
    }//_render()
}//HXIconElement
