import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

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
        return [ 'extension', 'type' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'extension':
                this._elExt.innerText = newVal;
                break;
            case 'type':
                this._elIcon.type = newVal;
                break;
        }
    }

    get extension () {
        return this.getAttribute('extension');
    }

    set extension (newVal) {
        if (newVal === null) {
            this.removeAttribute('extension');
        } else {
            this.setAttribute('extension', newVal);
        }
    }

    get type () {
        return this.getAttribute('type');
    }

    set type (newVal) {
        return this.setAttribute('type', newVal);
    }

    /** @private */
    get _elExt () {
        return this.shadowRoot.getElementById('hxExt');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }
}
