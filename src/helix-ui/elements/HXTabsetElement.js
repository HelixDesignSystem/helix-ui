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
        this.$tablist = this.querySelector('hx-tablist');
        this.$tablist.addEventListener('keyup', this._onKeyUp);
        this.$tablist.addEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this._onTabClick);
        });
    }

    $onDisconnect () {
        // FIXME: convert this.$tablist to getter
        this.$tablist.removeEventListener('keyup', this._onKeyUp);
        this.$tablist.removeEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this._onTabClick);
        });
    }

    static get $observedAttributes () {
        return [ 'current-tab' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-tab') {
            // FIXME: only run if connected
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
        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (idx < 0 || idx >= this.tabs.length) {
            throw new RangeError('currentTab index is out of bounds');
        }

        this.setAttribute('current-tab', idx);
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
     * All `<hx-tabpanel>` elements within the tabset.
     * @readonly
     * @type {HXTabpanelElement[]}
     */
    get tabpanels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    /**
     * Select next tab in tabset.
     */
    selectNext () {
        // if current tab is the last tab
        if (this.currentTab === (this.tabs.length - 1)) {
            // select first
            this.currentTab = 0;
        } else {
            // select next
            this.currentTab += 1;
        }
        // FIXME: this.tabs might return an empty array
        this.tabs[this.currentTab].focus();
    }

    /**
     * Select previous tab in tabset.
     */
    selectPrevious () {
        // if current tab is the first tab
        if (this.currentTab === 0) {
            // select last
            this.currentTab = (this.tabs.length - 1);
        } else {
            // select previous
            this.currentTab -= 1;
        }
        // FIXME: this.tabs might return an empty array
        this.tabs[this.currentTab].focus();
    }

    /**
     * Handle navigating the tabs via arrow keys
     * @private
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
    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
    }

    /** @private */
    _activateTab (idx) {
        // FIXME: this.tabs will return empty array before tabset connects
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

        // FIXME: this.tabpanels will return empty array before tabset connects
        this.tabpanels.forEach((tabpanel, panelIdx) => {
            tabpanel.open = (idx === panelIdx);
        });
    }

    /** @private */
    _setupIds () {
        let tabsetId = this.getAttribute('id');
        // FIXME: this.tabs will return empty array before connect
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
