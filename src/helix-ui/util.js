/** @module */
export { default as KEYS } from './util/keys';
export { getPosition, getPositionWithArrow } from './util/position';

/**
 * Communicate scroll events from elements at arbitrary depths in the DOM tree
 * (because 'scroll' events do not bubble).
 *
 * The event is dispatched from the `document` object, instead of bubbling from
 * the oritinal element, to avoid interfering with 'scroll' event listeners
 * attached to ancestor elements.
 *
 * We dispatch a CustomEvent so that we can communicate details about the
 * originating target via the `detail` property on the event.
 *
 * @param {Event} evt - "scroll" event object
 * @returns {Boolean}
 */
export function onScroll (evt) {
    let _evtScroll = new CustomEvent('scroll', {
        cancelable: true,
        bubbles: false,
        detail: {
            target: evt.target,
        },
    });

    return document.dispatchEvent(_evtScroll);
}//onScroll()
