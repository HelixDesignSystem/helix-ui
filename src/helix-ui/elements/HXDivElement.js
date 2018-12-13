import { HXElement } from './HXElement';
import { onScroll } from '../utils';
import shadowMarkup from './HXDivElement.html';
import shadowStyles from './HXDivElement.less';

/**
 * Nullable string denoting direction for scrolling.
 *
 * Valid Values:
 *   - 'horizontal'
 *   - 'vertical'
 *   - 'both'
 *
 * @typedef {Enum<string>|Null} ScrollDirection
 */

/**
 * Defines behavior for the `<hx-div>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXDivElement extends HXElement {
    static get is () {
        return 'hx-div';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    static get $observedAttributes () {
        return [ 'scroll' ];
    }

    // FIXME: ensure 'scroll' event listener added on connect (if scroll attr present)
    // FIXME: ensure 'scroll' event listener is removed on disconnect

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'scroll') {
            // FIXME: only run if connected
            if (newVal !== null) {
                this._resetScroll();
                this.addEventListener('scroll', onScroll);
            } else {
                // FIXME: listener doesn't get removed if element disconnects
                this.removeEventListener('scroll', onScroll);
            }
        }
    }

    /** @type {ScrollDirection} */
    get scroll () {
        return this.getAttribute('scroll');
    }

    /** @type {ScrollDirection} */
    set scroll (newVal) {
        if (newVal === null) {
            this.removeAttribute('scroll');
        } else {
            this.setAttribute('scroll', newVal);
        }
    }

    /** @private */
    _resetScroll () {
        // reset scroll by scrolling to top left corner
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
}
