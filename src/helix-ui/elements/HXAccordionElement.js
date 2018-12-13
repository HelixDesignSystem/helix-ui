import { HXElement } from './HXElement';

/**
 * Fires in single-panel mode, when the current panel changes.
 *
 * @event Accordion:panelchange
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-accordion>` element.
 *
 * @emits Accordion:panelchange
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    $onCreate () {
        this._onPanelOpen = this._onPanelOpen.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('currentPanel');
        // FIXME: panels are not connected at this point
        this.panels.forEach(panel => {
            panel.addEventListener('open', this._onPanelOpen);
        });

        // FIXME: initialize on connect
    }

    $onDisconnect () {
        // FIXME: panels may not be present on disconnect
        // (react disconnects children before the parent)
        this.panels.forEach(panel => {
            panel.removeEventListener('open', this._onPanelOpen);
        });
    }

    static get $observedAttributes () {
        return [ 'current-panel' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-panel') {
            if (newVal !== null) {
                // FIXME: this may not initialize correctly if called while disconnected
                this._openPanel(Number(newVal));
                this.$emit('panelchange');
            }
        }
    }

    /**
     * Array of `<hx-accordion-panel>` descendants.
     *
     * @readonly
     * @type {HXAccordionPanelElement[]}
     * @todo
     * Needs tweaked for nested accordions (e.g. multi-level navigation).
     * As it currently is, it returns ALL panels within the accordion,
     * not just the immediate children.
     */
    get panels () {
        return Array.from(this.querySelectorAll('hx-accordion-panel'));
    }

    /**
     * Zero-based index of the currently open panel.
     *
     * - **multi-panel** mode _(default)_
     *   - If unset, the user can open multiple panels at once.
     * - **single-panel** mode
     *   - If set, the user can only open one panel at a time.
     *
     * @type {Number}
     * @todo Needs updated to return Integer or null/undefined.
     * @todo Needs renamed. Too similar to nextPanel() and previousPanel() methods.
     */
    get currentPanel () {
        return Number(this.getAttribute('current-panel'));
    }
    set currentPanel (idx) {
        if (idx !== null) {
            let maxIndex = this.panels.length - 1;

            if (idx >= 0 && idx <= maxIndex) {
                this.setAttribute('current-panel', idx);
            }
        } else {
            this.removeAttribute('current-panel');
        }
    }

    /**
     * Select next panel, when in single-panel mode.
     */
    selectNext () {
        if (this._isNavigable) {
            this.currentPanel += 1;
        }
    }

    /**
     * Select previous panel, when in single-panel mode.
     */
    selectPrevious () {
        if (this._isNavigable) {
            this.currentPanel -= 1;
        }
    }

    /** @private */
    get _isNavigable () {
        return this.hasAttribute('current-panel');
    }

    /** @private */
    _onPanelOpen (evt) {
        let idx = this.panels.indexOf(evt.target);
        if (this._isNavigable) {
            this.currentPanel = idx;
        }
    }

    // FIXME: only works correctly if connected to DOM
    /** @private */
    _openPanel (index) {
        if (this._isNavigable) {
            this.panels.forEach((panel, idx) => {
                if (Number(index) === idx) {
                    panel.open = true;
                    panel.focus();
                } else  {
                    panel.open = false;
                    panel.blur();
                }
            });
        }
    }

    /**
     * @deprecated Use {@link HXAccordionElement#selectNext|selectNext()}
     */
    nextPanel () {
        this._$replaceWith('HXAccordionElement#selectNext()');
        this.selectNext();
    }

    /**
     * @deprecated Use {@link HXAccordionElement#selectPrevious|selectPrevious()}
     */
    previousPanel () {
        this._$replaceWith('HXAccordionElement#selectPrevious()');
        this.selectPrevious();
    }
}
