import { KEYS } from '../util';

export class HXElement extends HTMLElement {
    static $define () {
        customElements.define(this.is, this);
    }

    constructor (tagName, template) {
        super();

        // Don't attach shadow DOM unless specified
        if (tagName && template) {
            this.attachShadow({ mode: 'open' });

            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(this);
            }

            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }//constructor

    // See: https://goo.gl/MDp6j5
    $upgradeProperty (prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    // See: https://goo.gl/MUFHD8
    $defaultAttribute (name, val) {
        if (!this.hasAttribute(name)) {
            this.setAttribute(name, val);
        }
    }

    // Utility method to generate a unique ID
    $generateId () {
        return Math
            .random()     // 0.7093288430261266
            .toString(36) // "0.pjag2nwxb2o"
            .substr(2,8); // "pjag2nwx"
    }//$generateId()

    // 'keydown' event listener to prevent page scrolling
    $preventScroll (evt) {
        switch (evt.keyCode) {
            case KEYS.Down:
            case KEYS.Left:
            case KEYS.Right:
            case KEYS.Space:
            case KEYS.Up:
                evt.preventDefault();
                break;
        }
    }//$preventScroll()

    $emit (evtName, details) {
        let evt = new CustomEvent(evtName, {
            bubbles: true,
            details: details
        });
        this.dispatchEvent(evt);
    }//$emit
}//HXElement
