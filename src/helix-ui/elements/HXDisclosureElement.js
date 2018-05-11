import { HXElement } from './HXElement';
import { KEYS } from '../util';

/**
 * Defines behavior for the `<hx-disclosure>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXDisclosureElement extends HXElement {
    static get is () {
        return 'hx-disclosure';
    }

    static get observedAttributes () {
        return super.observedAttributes.concat([
            'aria-expanded',
        ]);
    }

    constructor () {
        super();
        this._onTargetOpen = this._onTargetOpen.bind(this);
        this._onTargetClose = this._onTargetClose.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        this.$upgradeProperty('expanded');
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex') && !this.disabled) {
            this.setAttribute('tabindex', 0);
        }

        if (this.target) {
            this.expanded = this.target.hasAttribute('open');
            this.target.addEventListener('open', this._onTargetOpen);
            this.target.addEventListener('close', this._onTargetClose);
        } else {
            this.expanded = false;
        }

        this.addEventListener('click', this._toggle);
        this.addEventListener('keydown', this.$preventScroll);
        this.addEventListener('keyup', this._keyUp);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this._toggle);
        this.removeEventListener('keydown', this.$preventScroll);
        this.removeEventListener('keyup', this._keyUp);

        if (this.target) {
            this.target.removeEventListener('open', this._onTargetOpen);
            this.target.removeEventListener('close', this._onTargetClose);
        }
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);

        const hasValue = (newVal !== null);
        switch(attr) {
            case 'aria-expanded':
                if (this.target) {
                    let setTo = (newVal === 'true');
                    if (this.target.open !== setTo) {
                        this.target.open = setTo;
                    }
                }
                break;
        }
    }

    /**
     * @default false
     * @type {Boolean}
     */
    get expanded () {
        return this.getAttribute('aria-expanded') === 'true';
    }
    set expanded (newVal) {
        this.setAttribute('aria-expanded', !!newVal);
    }

    /**
     * @readonly
     * @type {HTMLElement}
     */
    get target () {
        if (!this._target) {
            let targetId = this.getAttribute('aria-controls');
            this._target = this.getRootNode().getElementById(targetId);
        }
        return this._target;
    }

    /** @private */
    _keyUp (event) {
        switch (event.keyCode) {
            case KEYS.Space:
            case KEYS.Enter:
                this._toggle();
                break;
            default:
                break;
        }
    }

    /** @private */
    _toggle () {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }

    /** @private */
    _onTargetOpen () {
        this.expanded = true;
    }

    /** @private */
    _onTargetClose () {
        this.expanded = false;
    }
}
