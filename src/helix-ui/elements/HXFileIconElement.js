import { HXElement } from './HXElement';
import shadowStyles from './HXFileIconElement.less';
import shadowMarkup from './HXFileIconElement.html';

/**
 * Defines behavior for the `<hx-file-icon>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXFileIconElement extends HXElement {
    static get is () {
        return 'hx-file-icon';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }
        
    $onConnect () {
        this.$upgradeProperty('type');
    }

    static get $observedAttributes () {
        return [ 'type' ];
    }//$observedAttributes

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'type') {
            this._elIcon.type = newVal;
        }
    }//$onAttributeChange

    // GETTERS
    get type () {
        return this.getAttribute('type');
    }

    // SETTERS
    set type (newVal) {
        return this.setAttribute('type', newVal);
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('icon');
    }
}
