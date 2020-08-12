import { HXElement } from '../../interfaces/HXElement/index.js';

/**
 * Fires when the currently active tab changes.
 *
 * - Only fires in single-panel mode.
 *
 * @event Tabset:tabchange
 * @since 0.24.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-navigation-control>` element
 *
 * @emits Tabset:tabchange
 * @extends HXElement
 * @hideconstructor
 * @listens Tab:hxtabclick
 * @since 0.24.0
 */
export class HXNavigationControlElement extends HXElement {
    static get is () {
        return 'hx-navigation-control';
    }
}
