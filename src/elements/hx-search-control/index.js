import { HXFormControlElement } from '../../interfaces/HXFormControlElement/index.js';

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
export class HXSearchControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-search-control';
    }

    // $onCreate () {
    //     this._onControlInput = this._onControlInput.bind(this);
    //     this._onResetClick = this._onResetClick.bind(this);
    //     this._onHxchange = this._onHxchange.bind(this);
    // }

    $onConnect () {

        this.addEventListener('input', this._onControlInput);
        this.addEventListener('click', this._onResetClick);
        this.addEventListener('change', this._onHxchange);
      
    }

    $onDisconnect () {

        this.removeEventListener('input', this._onControlInput);
        this.removeEventListener('click', this._onResetClick);
        this.removeEventListener('change', this._onHxchange);
      
    }

    /**
     * Fetch the first `<input type="search">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="search"]');
    }

    /** @private */
    get _btnReset () {
        return this.querySelector('button.hxClear');
    }

    /**
     * Show or hide reset based off of the input value.
     * @private
     */
    _onControlInput (evt) {
        this._showHideReset(evt.target);
    }

    /**
     * Clear value and focus input when user presses "X" via the UI.
     * @private
     */
    _onResetClick (evt) {
        evt.preventDefault();
        this.controlElement.value = '';
        this.controlElement.focus();
        this._btnReset.hidden = true;
    }

    /**
     * Determines whether to show/hide reset ONLY when the input is "enabled".
     * Light DOM CSS handles hiding the reset button when "disabled".
     * @private
     */
    _showHideReset (elInput) {
        let hasValue = (elInput.value !== '');
        this._btnReset.hidden = !hasValue;
    }
}
