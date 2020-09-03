import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.scss';

/**
 * Defines behavior for the `<hx-switch>` element.
 * NOTE: `<hx-switch>` can have various default options, or it can be overriden.
 *
 *@extends HXElement
 * @hideconstructor
 * @since 0.24.0
 */
export class HXSwitchElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-switch';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onConnect () {
        this.$upgradeProperty('onlabel');
        this.$upgradeProperty('offlabel');
        this.$upgradeProperty('toggled');

        if (!this.hasAttribute('onlabel') && !this.hasAttribute('offlabel')) {
            this.setAttribute('onlabel', '');
            this.setAttribute('offlabel', '');
        } else {
            this.syncLabels();
        }
    }

    static get $observedAttributes () {
        return [ 'onlabel', 'offlabel' ];
    }

    // eslint-disable-next-line no-unused-vars
    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'onlabel') {
            this.syncLabels();
        } else {
            this.syncLabels(true); // sync off label
        }
    }

    /**
     * Label `off` getter/setter
     */
    get offlabel () {
        return this.getAttribute('offlabel');
    }
    set offlabel (newVal) {
        this.setAttribute('offlabel', newVal);
    }

    /**
     * Label `on` getter/setter
     */
    get onlabel () {
        return this.getAttribute('onlabel');
    }
    set onlabel (newVal) {
        this.setAttribute('onlabel', newVal);
    }

    /**
     * Property reflecting the `toggled` state of the Switch component.
     */
    get toggled () {
        return this.hasAttribute('toggled');
    }
    set toggled (isToggled) {
        if (isToggled) {
            this.setAttribute('toggled', '');
        } else {
            this.removeAttribute('toggled');
        }
    }

    // eslint-disable-next-line complexity
    syncLabels (isOffLabel = false) {
        if (this.hasAttribute('onlabel') && !isOffLabel) {
            let attr = this.getAttribute('onlabel').toUpperCase();

            let off;

            switch (attr) {
                case 'ON':
                    off = 'OFF';
                    break;
                case 'YES':
                    off = 'NO';
                    break;
                case '':
                    off = '';
                    break;
                default: { // off label override
                    // do nothing - passthrough value
                    break;
                }
            }

            if (this.hasAttribute('offlabel') && off !== undefined) {
                this.setAttribute('offlabel', off);
            }
        } else if (this.hasAttribute('offlabel')) {
            let attr = this.getAttribute('offlabel').toUpperCase();

            let on;

            switch (attr) {
                case 'OFF':
                    on = 'ON';
                    break;
                case 'NO':
                    on = 'YES';
                    break;
                case '':
                    on = '';
                    break;
                default: { // on label override
                    // do nothing - passthrough value
                    break;
                }
            }

            if (this.hasAttribute('onlabel') && on !== undefined) {
                this.setAttribute('onlabel', on);
            }
        }
    }
}
