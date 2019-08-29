import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.less';

// number of characters to avoid truncation at start/end of file name
const PRE_TRUNC = 14;

/**
 * Fires when user dismisses element, when loading or invalid
 *
 * @event FileTile:cancel
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Fires when user dismisses element, when downloadable
 *
 * @event FileTile:delete
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Fires when user clicks retry button, when invalid
 *
 * @event FileTile:retry
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-file-tile>` element.
 *
 * @emits FileTile:cancel
 * @emits FileTile:delete
 * @emits FileTile:retry
 * @extends HXElement
 * @hideconstructor
 * @since 0.12.0
 */
export class HXFileTileElement extends HXElement {
    static get is () {
        return 'hx-file-tile';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
        this._onRetry = this._onRetry.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('details');
        this.$upgradeProperty('href');
        this.$upgradeProperty('icon');
        this.$upgradeProperty('name');
        this.$upgradeProperty('progress');
        this.$upgradeProperty('readonly');

        this._btnDismiss.addEventListener('click', this._onDismiss);
        this._btnRetry.addEventListener('click', this._onRetry);
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
        this._btnRetry.removeEventListener('click', this._onRetry);
    }

    static get $observedAttributes () {
        return [
            'details',
            'href',
            'icon',
            'name',
            'progress',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'details':
                this._elDetails.innerText = newVal;
                break;

            case 'href':
                this._attrHrefUpdate(oldVal, newVal);
                break;

            case 'icon':
                this._elIcon.type = newVal;
                break;

            case 'name':
                this._attrNameUpdate(oldVal, newVal);
                break;

            case 'progress':
                this._elProgress.value = newVal;
                break;
        }
    }

    /**
     * https://regex101.com/r/K8XCbn/2
     * @readonly
     * @type {String}
     */
    get extension () {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(this.name)[1] || '';
    }

    /**
     * If present, the dismiss will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get readonly () {
        return this.hasAttribute('readonly');
    }
    set readonly (value) {
        if (value) {
            this.setAttribute('readonly', '');
        } else {
            this.removeAttribute('readonly');
        }
    }

    /**
     * URL to download the file.
     *
     * @type {String}
     */
    get href () {
        return this.getAttribute('href');
    }
    set href (newVal) {
        if (newVal === null) {
            this.removeAttribute('href');
        } else {
            this.setAttribute('href', newVal);
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
     * @default false
     * @readonly
     * @type {Boolean}
     */
    get loading () {
        return this.hasAttribute('progress');
    }

    /**
     * File name to display
     * @type {String}
     */
    get name () {
        return this.getAttribute('name') || '';
    }
    set name (newVal) {
        if (newVal === null) {
            this.removeAttribute('name');
        } else {
            this.setAttribute('name', newVal);
        }
    }

    /**
     * load progress of the file
     *
     * @type {Integer|Null}
     */
    get progress () {
        if (!this.loading) {
            return null;
        }

        let _strVal = this.getAttribute('progress');
        let _intVal = parseInt(_strVal) || 0;
        return _intVal;
    }
    set progress (newVal) {
        if (newVal === null) {
            this.removeAttribute('progress');
        } else {
            this.setAttribute('progress', newVal);
        }
    }

    /**
     * @default false
     * @readonly
     * @type {Boolean}
     */
    get truncated () {
        // to preserve start and end, name must exceed
        // twice the preserved character length
        if (this.name) {
            return this.name.length > (2 * PRE_TRUNC);
        } else {
            return false;
        }
    }

    /**
     * @default true
     * @type {Boolean}
     */
    get invalid () {
        return this.hasAttribute('invalid');
    }
    set invalid (newVal) {
        if (newVal) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    /**
     * Simulates clicking "X" (i.e., the dismiss button)
     */
    dismiss () {
        if (this.loading || this.invalid) {
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
     * Simulates clicking the retry button
     */
    retry () {
        this.$emit('retry');
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }

    /** @private */
    get _btnRetry () {
        return this.shadowRoot.getElementById('hxRetry');
    }

    /** @private */
    get _elDetails () {
        return this.shadowRoot.getElementById('hxDetails');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elLink () {
        return this.shadowRoot.getElementById('hxLink');
    }

    /** @private */
    get _elName () {
        return this.shadowRoot.getElementById('hxName');
    }

    /** @private */
    get _elProgress () {
        return this.shadowRoot.getElementById('hxProgress');
    }

    /** @private */
    _attrHrefUpdate (oldVal, newVal) {
        if (newVal !== null) {
            this._elLink.href = newVal;
        } else {
            this._elLink.removeAttribute('href');
        }
    }

    /** @private */
    _attrNameUpdate (oldVal, newVal) {
        this._elIcon.extension = (this.extension !== '' ? this.extension : null);

        if (this.truncated) {
            this._renderName();
            this._elLink.setAttribute('title', this.name);
        } else {
            this._elName.innerText = this.name;
            this._elLink.removeAttribute('title');
        }

        if (newVal === null) {
            this._elLink.removeAttribute('download');
        } else {
            let _name = newVal.trim();
            if (_name === '') {
                this._elLink.removeAttribute('download');
            } else {
                this._elLink.download = _name;
            }
        }
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    _onRetry (evt) {
        evt.preventDefault();
        this.retry();
    }

    /** @private */
    _renderName () {
        let _name = this.name;
        this._elName.innerHTML = `
            <span>${_name.slice(0, -PRE_TRUNC)}</span>
            <span>${_name.slice(-PRE_TRUNC)}</span>
        `;
    }
}
