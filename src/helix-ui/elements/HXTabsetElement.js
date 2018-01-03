import { HXElement } from './HXElement';
import { KEYS } from '../util';

export class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    static get observedAttributes () {
        return [ 'current-tab', 'tab-side' ];
    }

    constructor () {
        super();
        this.$tablist = this.querySelector('hx-tablist');
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTabClick = this._onTabClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('tab-side', 'top');

        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this.$tablist.addEventListener('keyup', this._onKeyUp);
        this.$tablist.addEventListener('keydown', this.$preventScroll);
        this.tabs.forEach( (tab) => {
            tab.addEventListener('click', this._onTabClick);
        });
    }

    disconnectedCallback () {
        this.$tablist.removeEventListener('keyup', this._onKeyUp);
        this.$tablist.removeEventListener('keydown', this.$preventScroll);
        this.tabs.forEach( (tab) => {
            tab.removeEventListener('click', this._onTabClick);
        });
    }

    attributeChangedCallback (attr, oldValue, newVal) {
        switch (attr) {
            case 'current-tab':
                if (!isNaN(newVal)) {
                    this.currentTab = Number(newVal);
                }
                break;

            case 'tab-side':
                switch (newVal) {
                    case 'top':
                    case 'bottom':
                        this.$tablist.setAttribute('aria-orientation', 'horizontal');
                        break;
                    case 'left':
                    case 'right':
                        this.$tablist.setAttribute('aria-orientation', 'vertical');
                        break;
                    default: /* do nothing */ break;
                }
                break;//tab-side
            default: /* do nothing */ break;
        }//switch
    }

    get currentTab () {
        return this._currentTab || 0;
    }

    set currentTab (idx) {
        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (idx < 0 || idx >= this.tabs.length) {
            throw new RangeError(`'currentTab' index is out of bounds`);
        }

        this._currentTab = idx;

        this.tabs.forEach( (tab, tabIdx) => {
            if (idx === tabIdx) {
                tab.current = true;
                tab.setAttribute('tabindex', 0);
            } else {
                tab.current = false;
                tab.setAttribute('tabindex', -1);
                tab.blur();
            }
        });

        this.tabpanels.forEach( (tabpanel, panelIdx) => {
            tabpanel.open = (idx === panelIdx);
        });
    }//SET:currentTab

    get tabSide () {
        return this.getAttribute('tab-side');
    }

    set tabSide (newVal) {
        this.setAttribute('tab-side', newVal);
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
        switch (this.tabSide) {
            case 'top':
            case 'bottom':
                if (evt.keyCode === KEYS.Right) {
                    this._selectNext();
                }

                if (evt.keyCode === KEYS.Left) {
                    this._selectPrevious();
                }
                break;
            case 'left':
            case 'right':
                if (evt.keyCode === KEYS.Down) {
                    this._selectNext();
                }

                if (evt.keyCode === KEYS.Up) {
                    this._selectPrevious();
                }
                break;
            default: /* do nothing */ break;
        }//tabSide
    }//_onKeyUp()

    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
    }

    _setupIds () {
        this.tabs.forEach( (tab, idx) => {
            let tabpanel = this.tabpanels[idx];
            // Default tab and panel ID
            let tabId = `hxTab-${this.$generateId()}`;
            let tabpanelId = `hxTabPanel-${this.$generateId()}`;

            // Set or keep Tab ID
            if (tab.hasAttribute('id')) {
                tabId = tab.getAttribute('id');
            } else {
                tab.setAttribute('id', tabId);
            }

            // Set or keep Panel ID
            if (tabpanel.hasAttribute('id')) {
                tabpanelId = tabpanel.getAttribute('id');
            } else {
                tabpanel.setAttribute('id', tabpanelId);
            }

            tab.setAttribute('aria-controls', tabpanelId);
            tabpanel.setAttribute('aria-labeledby', tabId);
        });
    }//_setupIds
}//HXTabsetElement
