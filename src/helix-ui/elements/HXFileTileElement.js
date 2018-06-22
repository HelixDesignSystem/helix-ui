import { HXElement } from './HXElement';
//import shadowMarkup from './HXFileTileElement.html';
//import shadowStyles from './HXFileTileElement.less';
const shadowMarkup = `<div><slot></slot></div>`;
const shadowStyles = ``;

export class HXFileTileElement extends HXElement {
    static get is () {
        return 'hx-file-tile';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    constructor () {
        super();
        this._onDelete = this._onDelete.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('icon');
        this.$upgradeProperty('name');
        this.$upgradeProperty('href');

        this._btnDelete.addEventListener('click', this._onDelete);
    }

    $onDisconnect () {
        this._btnDelete.removeEventListener('click', this._onDelete);
    }

    static get $observedAttributes () {
        return [
            'icon',
            'name',
            'href',
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

    /**
     * Programmatically dismiss the alert (removes element from the DOM).
     */
    delete () {
        this.remove();
    }

    // PRIVATE METHODS
    _onDelete (evt) {
        evt.preventDefault();

        if (this.$emit('delete')) {
            // only if event was not canceled by consumer
            this.delete();
        }
    }

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

    /** @private */
    get _btnDelete () {
        return this.shadowRoot.getElementById('hxDelete');
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
    get _extension () {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(this.name)[1];
    }
}
