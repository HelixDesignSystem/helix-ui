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

    $onDisconnect () {
        this._removeScrollListeners();
    }

    static get $observedAttributes () {
        return [ 'scroll' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'scroll') {
            if (newVal !== null) {
                this._resetScroll();
                this.addEventListener('scroll', onScroll);
            } else {
                this._removeScrollListeners();
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

    /** @private */
    _removeScrollListeners () {
        this.removeEventListener('scroll', onScroll);
    }
}
