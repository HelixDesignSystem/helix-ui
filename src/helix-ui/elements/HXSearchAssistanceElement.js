import { HXElement } from './HXElement';
import { getPosition } from '../utils/position';
import { onScroll } from '../utils';

/**
 * Fires when the element's contents are concealed.
 *
 * @event SearchAssistance:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event SearchAssistance:open
 * @since 0.6.0
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

    $onConnect () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');
        this.$defaultAttribute('position', 'bottom-start');
        this.addEventListener('scroll', onScroll);
    }

    $onDisconnect () {
        this.removeEventListener('scroll', onScroll);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            let isOpen = (newVal !== null);
            this.$emit(isOpen ? 'open' : 'close');
        }
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
