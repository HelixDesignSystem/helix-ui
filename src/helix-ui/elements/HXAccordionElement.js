import { HXElement } from './HXElement';

export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    constructor () {
        super();
        this._onPanelOpen = this._onPanelOpen.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('currentPanel');
        this.panels.forEach(panel => {
            panel.addEventListener('open', this._onPanelOpen);
        });
    }

    disconnectedCallback () {
        this.panels.forEach(panel => {
            panel.removeEventListener('open', this._onPanelOpen);
        });
    }

    static get observedAttributes () {
        return [ 'current-panel' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        if (newVal !== null) {
            this._openPanel(Number(newVal));

            if (newVal !== oldVal) {
                this.$emit('panelchange');
            }
        }
    }

    // PUBLIC PROPERTIES

    // TODO: needs tweaked for nested accordions (e.g. multi-level navigation)
    // As it currently is, this will return ALL panels within the accordion,
    // not just the immediate children.
    get panels () {
        return Array.from(this.querySelectorAll('hx-accordion-panel'));
    }

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

    // PUBLIC METHODS

    nextPanel () {
        if (this._isNavigable) {
            this.currentPanel += 1;
        }
    }

    previousPanel () {
        if (this._isNavigable) {
            this.currentPanel -= 1;
        }
    }

    // PRIVATE PROPERTIES

    get _isNavigable () {
        return this.hasAttribute('current-panel');
    }

    // PRIVATE METHODS

    _onPanelOpen (evt) {
        let idx = this.panels.indexOf(evt.target);
        if (this._isNavigable) {
            this.currentPanel = idx;
        }
    }

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
}//HXAccordionElement
