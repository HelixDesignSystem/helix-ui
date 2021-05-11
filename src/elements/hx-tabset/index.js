import { HXElement } from '../../interfaces/HXElement/index.js';
import { KEYS, defer, generateId, preventKeyScroll } from '../../utils';

/**
 * Fires when the currently active tab changes.
 *
 * - Only fires in single-panel mode.
 *
 * @event Tabset:tabchange
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tabset>` element
 *
 * @emits Tabset:tabchange
 * @extends HXElement
 * @hideconstructor
 * @listens Tab:hxtabclick
 * @since 0.2.0
 */
export class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('current-tab');
        this.$upgradeProperty('tabsize');
        this.$defaultAttribute('id', `tabset-${generateId()}`);
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this.tabSize = Number(this.getAttribute('tabsize')) || this.tabs.length;
        this._tablist.addEventListener('keyup', this._onKeyUp);
        this._tablist.addEventListener('keydown', preventKeyScroll);
        this.addEventListener('hxtabclick', this._onHxtabclick);
        this.update();
    }

    $onDisconnect () {
        this._tablist.removeEventListener('keyup', this._onKeyUp);
        this._tablist.removeEventListener('keydown', preventKeyScroll);
        this.removeEventListener('hxtabclick', this._onHxtabclick);
    }

    static get $observedAttributes () {
        return [ 'current-tab', 'tabsize' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-tab') {
            if (!isNaN(newVal)) {
                this._activateTab(Number(newVal));
                this.$emit('tabchange');
            }
        }
        if (attr === 'tabsize') {
            if (this.currentTab === 0 && !isNaN(newVal)) {
                this._activateTab(0);
                this.$emit('tabchange');
            }
        }
    }

    /* ---------- PUBLIC MEMBERS ---------- */

    /**
     * Zero-based index of the currently active tab.
     * @type {Number}
     */
    get currentTab () {
        return Number(this.getAttribute('current-tab') || 0);
    }
    set currentTab (idx) {
        // NOTE: Keep an eye on this logic for React compatibility
        if (!this.isConnected) {
            return;
        }

        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects a numeric index. Got ${typeof idx} instead.`);
        }
        if (this.tabs.length !== 0) {
            if (idx < 0 || idx >= this.tabs.length) {
                throw new RangeError('currentTab index is out of bounds');
            }
        }

        this._setupIds(); // account for dynamic tabs
        this.setAttribute('current-tab', idx);
    }

    /* ---------- PUBLIC MEMBERS ---------- */

    /**
     * Number of Tabs.
     * @type {Number}
     */
    get tabSize () {
        return Number(this.getAttribute('tabsize')) || this.tabs.length;
    }
    set tabSize (len) {
        this.setAttribute('tabsize', len);
    }
    
    /* ---------- PUBLIC METHODS ---------- */

    /**
     * All `<hx-tabpanel>` elements associated with the tabset.
     * @readonly
     * @type {HXTabpanelElement[]}
     */
    get tabpanels () {
        let _selector = `#${this.id} > hx-tabcontent > hx-tabpanel`;
        return Array.from(this.querySelectorAll(_selector));
    }

    /**
     * All `<hx-tab>` elements associated with the tabset.
     * @readonly
     * @type {HXTabElement[]}
     */
    get tabs () {
        this.$defaultAttribute('id', `tabset-${generateId()}`);  // accommodate Angular lifecycle

        let _selector = `#${this.id} > hx-tablist > hx-tab`;
        return Array.from(this.querySelectorAll(_selector));
    }

    /**
     * Select next tab in tabset.
     */
    selectNext () {
        if (!this.isConnected) {
            return;
        }

        // if current tab is the last tab
        if (this.currentTab === (this.tabs.length - 1)) {
            // select first
            this.currentTab = 0;
        } else {
            // select next
            this.currentTab += 1;
        }
        this.tabs[this.currentTab].focus();
    }

    /**
     * Select previous tab in tabset.
     */
    selectPrevious () {
        if (!this.isConnected) {
            return;
        }

        // if current tab is the first tab
        if (this.currentTab === 0) {
            // select last
            this.currentTab = (this.tabs.length - 1);
        } else {
            // select previous
            this.currentTab -= 1;
        }
        this.tabs[this.currentTab].focus();
    }

    /**
     * Synchronize DOM state with element configuration.
     * Useful for when the number of <hx-tab> and <hx-tabpanel>
     * elements changes after tabset connects to the DOM.
     */
    update () {
        this._setupIds();
        this._activateTab(this.currentTab);
    }

    /* ---------- PRIVATE PROPERTIES ---------- */

    /** @private */
    get _tablist () {
        return this.querySelector('hx-tablist');
    }

    /* ---------- PRIVATE METHODS ---------- */

    /** @private
     *
     * activates tab/panel pair with matching index
     * deactivates all other tab/panel pairs
    */
    _activateTab (idx) {
        this.tabs.forEach((tab, tabIdx) => {
            if (idx === tabIdx) {
                tab.current = true;
                tab.setAttribute('tabindex', 0);
            } else {
                tab.current = false;
                tab.setAttribute('tabindex', -1);
                tab.blur();
            }
        });

        this.tabpanels.forEach((tabpanel, panelIdx) => {
            tabpanel.open = (idx === panelIdx);
        });
    }

    /** @private */
    _onHxtabclick (evt) {
        evt.stopPropagation();
        let newIdx = this.tabs.indexOf(evt.target);

        if (newIdx === this.currentTab) {
            // update visual state if user clicks newly added tab
            // whose index matches the current tabset configuration
            this.update();
        } else {
            // otherwise, update logical state, which in turn
            // updates visual state
            this.currentTab = newIdx;
        }
    }

    /**
     * Handle navigating the tabs via arrow keys
     * @private
     * @todo migrate keyup listener logic to HXTablistElement
     */
    _onKeyUp (evt) {
        if (evt.keyCode === KEYS.Right) {
            this.selectNext();
        }

        if (evt.keyCode === KEYS.Left) {
            this.selectPrevious();
        }
    }

    /** @private */
    _setupIds () {
        let tabsetId = this.getAttribute('id');
        this.tabs.forEach((tab, idx) => {
            let tabpanel = this.tabpanels[idx];

            // Default tab and panel ID
            let tabId = `${tabsetId}-tab-${idx}`;
            let tabpanelId = `${tabsetId}-panel-${idx}`;

            // Set or keep tab ID
            if (tab.hasAttribute('id')) {
                tabId = tab.getAttribute('id');
            } else {
                tab.setAttribute('id', tabId);
            }

            // Set or keep panel ID
            if (tabpanel !== undefined) {
                if (tabpanel.hasAttribute('id')) {
                    tabpanelId = tabpanel.getAttribute('id');
                } else {
                    tabpanel.setAttribute('id', tabpanelId);
                }

                // sync tabpanel to tab
                tabpanel.setAttribute('aria-labelledby', tabId);
                tab.setAttribute('aria-controls', tabpanelId);
            }
        });
    }
}
