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
    }//$observedAttributes

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
    }//$onAttributeChange

    // GETTERS
    get icon () {
        return this.getAttribute('icon');
    }

    get name () {
        return this.getAttribute('name');
    }

    get href () {
        return this.getAttribute('href');
    }

    get loading () {
        return this.hasAttribute('loading');
    }

    get valid () {
        return !this.hasAttribute('invalid');
    }

    // SETTERS
    set icon (newVal) {
        this.setAttribute('icon', newVal);
    }

    set name (newVal) {
        this.setAttribute('name', newVal);
    }

    set href (newVal) {
        this.setAttribute('href', newVal);
    }

    set loading (newVal) {
        if (newVal) {
            this.setAttribute('loading', '');
        } else {
            this.removeAttribute('loading');
        }
    }

    set valid (newVal) {
        if (newVal) {
            this.removeAttribute('invalid');
        } else {
            this.setAttribute('invalid', '');
        }
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
    // https://regex101.com/r/K8XCbn/2
    get _extension () {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(this.name)[1];
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();

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
}
