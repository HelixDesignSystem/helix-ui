import { HXElement } from './HXElement';
import shadowMarkup from './HXFileTileElement.html';
import shadowStyles from './HXFileTileElement.less';

export class HXFileTileElement extends HXElement {
    static get is () {
        return 'hx-file-tile';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('icon');
        this.$upgradeProperty('name');
        this.$upgradeProperty('href');
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    static get $observedAttributes () {
        return [
            'href',
            'icon',
            'name',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'icon':
                this._elIcon.type = newVal;
                break;

            case 'href':
                if (newVal !== null) {
                    this._elLink.href = newVal;
                } else {
                    this._elLink.removeAttribute('href');
                }
                break;

            case 'name':
                this._elLink.innerText = newVal;
                this._elExt.innerText = this._extension || '';
                break;
        }
    }

    /**
     * Icon to appear within the empty file icon.
     * @type {String}
     */
    get icon () {
        return this.getAttribute('icon');
    }
    set icon (newVal) {
        this.setAttribute('icon', newVal);
    }

    /**
     * File name
     * @type {String}
     */
    get name () {
        return this.getAttribute('name');
    }
    set name (newVal) {
        this.setAttribute('name', newVal);
    }

    /**
     * URL to download the file
     * @type {String}
     */
    get href () {
        return this.getAttribute('href');
    }
    set href (newVal) {
        this.setAttribute('href', newVal);
    }

    /**
     * @default false
     * @type {Boolean}
     */
    get loading () {
        return this.hasAttribute('loading');
    }
    set loading (newVal) {
        if (newVal) {
            this.setAttribute('loading', '');
        } else {
            this.removeAttribute('loading');
        }
    }

    /**
     * @default true
     * @type {Boolean}
     */
    get valid () {
        return !this.hasAttribute('invalid');
    }
    set valid (newVal) {
        if (newVal) {
            this.removeAttribute('invalid');
        } else {
            this.setAttribute('invalid', '');
        }
    }

    /**
     * Simulates clicking "X" (i.e., the dismiss button)
     */
    dismiss () {
        if (this.loading || !this.valid) {
            if (this.$emit('cancel')) {
                this.remove();
            }
        } else {
            if (this.$emit('delete')) {
                // only if event was not canceled by consumer
                this.remove();
            }
        }
    }

    /**
     * https://regex101.com/r/K8XCbn/2
     * @private
     */
    get _extension () {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(this.name)[1];
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elExt () {
        return this.shadowRoot.getElementById('hxExt');
    }

    /** @private */
    get _elLink () {
        return this.shadowRoot.getElementById('hxLink');
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }
}
