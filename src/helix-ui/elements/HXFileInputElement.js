import { HXElement } from './HXElement';
import shadowMarkup from './HXFileInputElement.html';
import shadowStyles from './HXFileInputElement.less';

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

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('icon');
        this.$upgradeProperty('label');
        this._elButton.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this._elButton.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'icon', 'label' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'icon':
                this._elIcon.type = newVal;
                break;
            case 'label':
                this._elLabel.innerText = newVal;
                break;
        }
    }

    /**
     * @readonly
     * @type {HTMLInputElement}
     */
    get fileInput () {
        return this.querySelector('input[type="file"]');
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

    /**
     * Label to display within the file selector.
     * @type {String}
     */
    get label () {
        return this.getAttribute('label');
    }
    set label (newVal) {
        this.setAttribute('label', newVal);
    }

    /**
     * Simulate a mouse click on the element.
     */
    click () {
        if (this.fileInput) {
            this.fileInput.click();
        }
    }

    /** @private */
    get _elButton () {
        return this.shadowRoot.getElementById('hxButton');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elLabel () {
        return this.shadowRoot.getElementById('hxLabel');
    }

    /** @private */
    _onClick (evt) {
        evt.preventDefault();
        this.click();
    }
}
