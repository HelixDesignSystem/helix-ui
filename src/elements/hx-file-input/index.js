import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

/**
 * Defines behavior for the `<hx-file-input>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
export class HXFileInputElement extends HXElement {
    static get is () {
        return 'hx-file-input';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onConnect () {
        this.$upgradeProperty('icon');
    }

    static get $observedAttributes () {
        return [ 'icon' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'icon') {
            this._elIcon.type = newVal;
        }
    }

    /**
     * Icon to appear within the file selector.
     * @type {String}
     */
    get icon () {
        return this.getAttribute('icon');
    }
    set icon (newVal) {
        this.setAttribute('icon', newVal);
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }
}
