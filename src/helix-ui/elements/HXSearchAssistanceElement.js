import { HXElement } from './HXElement';
import { getPosition } from '../util';

/**
 * Fires when the element's contents are concealed.
 *
 * @event SearchAssistance:close
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event SearchAssistance:open
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-search-assistance>` element.
 *
 * @emits SearchAssistance:close
 * @emits SearchAssistance:open
 * @extends HXElement
 * @hideconstructor
 * @see HXSearchElement
 * @since 0.6.0
 */
export class HXSearchAssistanceElement extends HXElement {
    static get is () {
        return 'hx-search-assistance';
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);
        if (newVal !== oldVal) {
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');
        this.$defaultAttribute('position', 'bottom-start');
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        return this.getAttribute('position');
    }

    set relativeTo (value) {
        this.setAttribute('relative-to', value);
    }

    get relativeTo () {
        return this.getAttribute('relative-to');
    }

    get relativeElement () {
        return this.getRootNode().getElementById(this.relativeTo);
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    _setPosition () {
        var offset = getPosition(this, this.relativeElement, {
            position: this.position,
            margin: 4,
        });
        this.style.top = offset.y + 'px';
        this.style.left = offset.x + 'px';
    }
}
