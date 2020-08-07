import { HXElement } from '../../interfaces/HXElement/index.js';

import shadowMarkup from './_shadow.html';
import shadowStyles from './_shadow.scss';

/**
 * Defines behavior for the `<hx-toggle>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 1.0.0
 */
export class HXToggleElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-toggle';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onConnect () {
        this.$upgradeProperty('toggled');
    }

    /**
     * Property reflected the `toggled` state of [list (default) || grid].
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
}
