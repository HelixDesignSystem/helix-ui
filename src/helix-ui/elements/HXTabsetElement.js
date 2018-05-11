import { HXElement } from './HXElement';
import { KEYS } from '../util';

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

    static get observedAttributes () {
        return [ 'current-tab' ];
    }

    constructor () {
        super();
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTabClick = this._onTabClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('id', this.$generateId());
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this.$tablist = this.querySelector('hx-tablist');
        this.$tablist.addEventListener('keyup', this._onKeyUp);
        this.$tablist.addEventListener('keydown', this.$preventScroll);
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this._onTabClick);
        });
    }

    disconnectedCallback () {
        this.$tablist.removeEventListener('keyup', this._onKeyUp);
        this.$tablist.removeEventListener('keydown', this.$preventScroll);
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this._onTabClick);
        });
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        if (!isNaN(newVal)) {
            this._openTab(Number(newVal));

            if (newVal !== oldVal) {
                this.$emit('tabchange');
            }
        }
    }

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

    get tabs () {
        return Array.from(this.querySelectorAll('hx-tablist > hx-tab'));
    }

    get tabpanels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    _selectNext () {
        // if current tab is the last tab
        if (this.currentTab === (this.tabs.length - 1)) {
            // select first
            this.currentTab = 0;
        } else {
            // select next
            this.currentTab += 1;
        }
        this.tabs[this.currentTab].focus();
    }//_selectNext()

    _selectPrevious () {
        // if current tab is the first tab
        if (this.currentTab === 0) {
            // select last
            this.currentTab = (this.tabs.length - 1);
        } else {
            // select previous
            this.currentTab -= 1;
        }
        this.tabs[this.currentTab].focus();
    }//_selectPrevious()

    // Handle navigating the tabs via arrow keys
    _onKeyUp (evt) {
        if (evt.keyCode === KEYS.Right) {
            this._selectNext();
        }

        if (evt.keyCode === KEYS.Left) {
            this._selectPrevious();
        }
    }//_onKeyUp()

    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
    }

    _openTab (idx) {
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
    }//_setupIds
}
