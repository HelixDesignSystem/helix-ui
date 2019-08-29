import { HXElement } from '../../interfaces/HXElement/index.js';
import { KEYS, defer, preventKeyScroll } from '../../utils';

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

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onTargetOpen = this._onTargetOpen.bind(this);
        this._onTargetClose = this._onTargetClose.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('expanded');
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex') && !this.disabled) {
            this.setAttribute('tabindex', 0);
        }

        if (this.target) {
            this.expanded = this.target.hasAttribute('open');
        } else {
            this.expanded = false;
        }

        this._addTargetListeners();
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', preventKeyScroll);
        this.addEventListener('keyup', this._onKeyUp);
    }

    $onDisconnect () {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', preventKeyScroll);
        this.removeEventListener('keyup', this._onKeyUp);

        this._removeTargetListeners();
    }

    static get $observedAttributes () {
        return [ 'aria-expanded' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'aria-expanded') {
            if (this.target) {
                let setTo = (newVal === 'true');
                if (this.target.open !== setTo) {
                    this.target.open = setTo;
                }
            }
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
        if (this.isConnected && !this._target) {
            let targetId = this.getAttribute('aria-controls');
            this._target = this.getRootNode().querySelector(`[id="${targetId}"]`);
        }
        return this._target;
    }

    /**
     * Simulates mouse click
     */
    click () {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }

    /** @private */
    _addTargetListeners () {
        if (this.target) {
            this.target.addEventListener('open', this._onTargetOpen);
            this.target.addEventListener('close', this._onTargetClose);
        }
    }

    /** @private */
    _onKeyUp (event) {
        switch (event.keyCode) {
            case KEYS.Space:
            case KEYS.Enter:
                this.click();
                break;
            default:
                break;
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

    /** @private */
    _onClick () {
        this.click();
    }

    /** @private */
    _removeTargetListeners () {
        if (this.target) {
            this.target.removeEventListener('open', this._onTargetOpen);
            this.target.removeEventListener('close', this._onTargetClose);
        }
    }
}
