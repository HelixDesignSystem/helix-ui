import { HXElement } from './HXElement';
import shadowStyles from './_hx-tabset.less';

const tagName = 'hx-tabset';
const template = document.createElement('template');

template.innerHTML = `
    <style>${shadowStyles}</style>
    <div id ="head">
      <slot name="tabs"></slot>
    </div>
    <div id ="body">
      <slot></slot>
    </div>
`;

export class HXTabsetElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'selected' ];
    }

    constructor () {
        super(tagName, template);
        this.$head = this.shadowRoot.querySelector('#head'); // TODO: normalize naming
        this._onHeadClick = this._onHeadClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('selected');
        this.$head.addEventListener('click', this._onHeadClick);
        this.$defaultAttribute('role', 'tablist');
        if (!this.hasAttribute('selected')) {
            this._selectPanelByIndex(0);
        }
    }

    disconnectedCallback () {
        this.$head.removeEventListener('click', this._onHeadClick);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this._selectPanelById(newValue);
    }

    get selected () {
        return this.getAttribute('selected');
    }

    set selected (id) {
        if (this.querySelector(`hx-tabpanel#${id}`)) {
            this.setAttribute('selected', id);
        } else {
            throw new Error(`Tab with id "${id}" not found`);
        }
    }

    get tabs () {
        return Array.from(this.querySelectorAll('.hxTab'));
    }

    get panels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    _selectPanelById (id) {
        this._selectPanel(this.querySelector(`hx-tabpanel#${id}`));
    }

    _selectPanelByIndex (idx) {
        if (idx < 0 || idx >= this.panels.length) {
            throw new Error('Panel index out of bounds');
        } else {
            this._selectPanel(this.panels[idx]);
        }
    }

    _selectPanel (panel) {
        if (panel) {
            this._reset();
            panel.open = true;
            var selectedIndex = this.panels.indexOf(panel);
            this.tabs[selectedIndex].classList.add('current');
        }
    }

    _reset () {
        this.panels.forEach(panel => panel.open = false);
        this.tabs.forEach(tab => tab.classList.remove('current'));
    }

    _onHeadClick (event) {
        event.preventDefault();
        this._selectPanelByIndex(this.tabs.indexOf(event.target));
    }
}//HXTabsetElement
