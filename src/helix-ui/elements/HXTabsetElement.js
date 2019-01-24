import { HXElement } from './HXElement';

import { KEYS, defer, generateId, preventKeyScroll } from '../utils';

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
 * @since 0.2.0
 */
export class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTabClick = this._onTabClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('id', `tabset-${generateId()}`);
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this._tablist.addEventListener('keyup', this._onKeyUp);
        this._tablist.addEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this._onTabClick);
        });

        if (this.hasAttribute('current-tab')) {
            this._activateTab(this.currentTab);
        }
    }

    $onDisconnect () {
        this._tablist.removeEventListener('keyup', this._onKeyUp);
        this._tablist.removeEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this._onTabClick);
        });
    }

    static get $observedAttributes () {
        return [ 'current-tab' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-tab') {
            if (!isNaN(newVal)) {
                this._activateTab(Number(newVal));
                this.$emit('tabchange');
            }
        }
    }

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
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (idx < 0 || idx >= this.tabs.length) {
            throw new RangeError('currentTab index is out of bounds');
        }

        this.setAttribute('current-tab', idx);
    }

    /**
     * All `<hx-tabpanel>` elements within the tabset.
     * @readonly
     * @type {HXTabpanelElement[]}
     */
    get tabpanels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    /**
     * All `<hx-tab>` elements within the tabset.
     * @readonly
     * @type {HXTabElement[]}
     */
    get tabs () {
        return Array.from(this.querySelectorAll('hx-tablist > hx-tab'));
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

    /** @private */
    get _tablist () {
        return this.querySelector('hx-tablist');
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

    /**
     * @private
     * @todo migrate tab click listener logic to HXTabElement
     */
    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
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
            if (tabpanel.hasAttribute('id')) {
                tabpanelId = tabpanel.getAttribute('id');
            } else {
                tabpanel.setAttribute('id', tabpanelId);
            }

            tab.setAttribute('aria-controls', tabpanelId);
            tabpanel.setAttribute('aria-labelledby', tabId);
        });
    }
}
