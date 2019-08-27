import { Revealable } from './Revealable.js';
import { mix } from '../../utils';
import { offsetFunctionMap } from '../../utils/offset';
import {
    normalizePosition,
    optimizePositionForCollisions,
} from '../../utils/alignment';

/**
 * @typedef {Object} OptimumPositionMetadata
 * @description
 * Calculated metadata describing a positionable element's optimum position.
 *
 * @prop {Coordinate} x - optimum x coordinate
 * @prop {Coordinate} y - optimum y coordinate
 * @prop {PositionString} position - optimum position
 */

/**
 * @typedef {Object} PositionableRect
 * @description
 * Calculated, DOMRect-like object
 *
 * @prop {Number} bottom - distance from top of viewport to bottom edge of rect
 * @prop {Number} left - distance from left of viewport to left edge of rect
 * @prop {Number} right - distance from left of viewport to right edge of rect
 * @prop {Number} top - distance from top of viewport to top edge of rect
 */

/**
 * @typedef {Object} PredicateCollisions
 * @global
 * @description
 * Metadata object with predicate values for quick collision evaluation.
 *
 * @prop {Boolean} anywhere - true if any edge collides
 * @prop {Boolean} bottom - true if bottom edge collides
 * @prop {Boolean} horizontal - true if left or right edge collide
 * @prop {Boolean} left - true if left edge collides
 * @prop {Boolean} right - true if right edge collides
 * @prop {Boolean} top - true if top edge collides
 * @prop {Boolean} vertical - true if top or bottom edge collide
 */

/**
 * @typedef {Object} XYDeltas
 * @description x and y adjustments for alignment
 *
 * @prop {Number} dX - x delta
 * @prop {Number} dY - y delta
 */

/**
 * @interface
 * @since 0.15.0
 * @implements Revealable
 *
 * @description
 * Defines behavior needed to calculate absolute coordinates
 * and apply them to an instance.
 */
export const Positionable = (superclass) => {
    class ProtoClass extends mix(superclass, Revealable) {}

    /** @lends Positionable */
    class _Positionable extends ProtoClass {
        /** @override */
        $onCreate () {
            super.$onCreate();

            this.__onDocumentClick = this.__onDocumentClick.bind(this);
            this.__onDocumentScroll = this.__onDocumentScroll.bind(this);
            this.__onWindowResize = this.__onWindowResize.bind(this);

            this.DEFAULT_POSITION = 'bottom-center';
            this.POSITION_OFFSET = 0;
        }

        /** @override */
        $onConnect () {
            super.$onConnect();

            this.$upgradeProperty('position');
            this.$upgradeProperty('relativeTo');

            this.$defaultAttribute('position', this.DEFAULT_POSITION);

            this.addEventListener('open', this.__onOpen);
            this.addEventListener('close', this.__onClose);

            if (this.open) {
                this.$emit('open');
            }
        }

        /** @override */
        $onDisconnect () {
            super.$onDisconnect();

            this.removeEventListener('open', this.__onOpen);
            this.removeEventListener('close', this.__onClose);

            this.__removeOpenListeners();
        }

        /** @override */
        static get $observedAttributes () {
            let attrs = super.$observedAttributes;
            return attrs.concat([ 'position' ]);
        }

        /** @override */
        $onAttributeChange (attr, oldVal, newVal) {
            super.$onAttributeChange(attr, oldVal, newVal);

            if (attr === 'position') {
                this.setShadowPosition(newVal);
                this.reposition();
            }
        }

        /**
         * External element that controls positioned element visibility.
         * This is commonly a `<button>` or `<hx-disclosure>`.
         *
         * @readonly
         * @type {HTMLElement}
         */
        get controlElement () {
            if (this.isConnected) {
                return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
            }
        }

        /**
         * Optimum position calculated by internal algorithm.
         * Will return undefined if element hasn't been repositioned.
         *
         * @readonly
         * @type {PositionString|undefined}
         */
        get optimumPosition () {
            return this._optimumPosition;
        }

        /**
         * Where to position the element against its relativeElement.
         *
         * **NOTE:** Values are normalized upon setting, which means that
         * the value retrieved may differ from the value being set.
         *
         * ```javascript
         * el.position = 'top';
         * el.position; // 'top-center'
         *
         * el.position = 'bottom-center';
         * el.position; // 'bottom-center'
         * ```
         *
         * @type {PositionString}
         */
        get position () {
            let _configured = this.getAttribute('position') || this.DEFAULT_POSITION;
            return normalizePosition(_configured);
        }
        set position (value) {
            let _position = normalizePosition(value);
            this.setAttribute('position', _position);
        }

        /**
         * Reference element used to calculate positionable element's position.
         *
         * @readonly
         * @type {HTMLElement|undefined}
         */
        get relativeElement () {
            if (!this.isConnected) {
                return;
            }

            if (this.relativeTo) {
                return this.getRootNode().querySelector(`[id="${this.relativeTo}"]`);
            } else {
                return this.controlElement;
            }
        }

        /**
         * ID of an element to relatively position against.
         *
         * @type {String}
         */
        get relativeTo () {
            return this.getAttribute('relative-to');
        }
        set relativeTo (value) {
            this.setAttribute('relative-to', value);
        }

        /**
         * Calculate and apply new (x,y) coordinates.
         */
        reposition () {
            if (this.open && this.relativeElement) {
                let { x, y, position } = this.__calculatePosition();

                /*
                 * FYI: `getClientRect()` (via `getBoundingClientRect()`) may incorrectly calculate
                 * the `width` property if the `left` CSS property is not explicitly defined.
                 */
                this.style.top = `${y}px`;
                this.style.left = `${x}px`;

                this._optimumPosition = position;
                this.setShadowPosition(position);

                this.$emit('reposition');
            }
        }

        /**
         * Used to communicate position changes to Shadow DOM for subclasses that care.
         *
         * @abstract
         * @ignore
         * @param {NormalizedPositionString}
         */
        setShadowPosition (position) {} // eslint-disable-line no-unused-vars

        /**
         * Add active event listeners (e.g, document `click`)
         * These listeners rely on `this.controlElement` to manipulate
         * the open state of the positionable element.
         */
        __addActiveListeners () {
            if (this.controlElement) {
                document.addEventListener('click', this.__onDocumentClick);
            }
        }

        /**
         * Add event listeners that only apply when open.
         */
        __addOpenListeners () {
            this.__addActiveListeners();
            this.__addPassiveListeners();
        }

        /**
         * Add passive event listeners (e.g., document `scroll` and
         * window `resize`). These listeners rely on `this.relativeElement`
         * to reposition the positionable element.
         */
        __addPassiveListeners () {
            if (this.relativeElement) {
                document.addEventListener('scroll', this.__onDocumentScroll, { passive: true });
                window.addEventListener('resize', this.__onWindowResize, { passive: true });
            }
        }

        /**
         * Calculate optimum position and fixed {x,y} coordinates needed
         * to arrange the positionable element in relation to its
         * `relativeElement`, taking viewport size into account.
         *
         * @returns {OptimumPositionMetadata}
         */
        __calculatePosition () {
            if (!this.relativeElement) {
                return { x: 0, y: 0 };
            }

            let posRect = this.getBoundingClientRect();
            let relRect = this.relativeElement.getBoundingClientRect();

            let position = this.position;
            let deltas = this.__getDeltas(position);
            let calculate = offsetFunctionMap[position];

            // calculate initial coords
            let coords = calculate(posRect, relRect, deltas);

            // check if any edge of the element is off screen
            let isOffscreen = this.__getViewportCollisions(coords);

            if (isOffscreen.anywhere) {
                let optimumPosition = optimizePositionForCollisions(position, isOffscreen);
                let optimumDeltas = this.__getDeltas(optimumPosition);
                let optimumCalculate = offsetFunctionMap[optimumPosition];

                // recalculate coords based on optimum position
                let optimumCoords = optimumCalculate(posRect, relRect, optimumDeltas);

                return {
                    position: optimumPosition,
                    x: optimumCoords.x,
                    y: optimumCoords.y,
                };
            }

            return {
                position,
                x: coords.x,
                y: coords.y,
            };
        }

        /**
         * Calculate X and Y adjustments based on position.
         *
         * @param {PositionString} position
         * @returns {XYDeltas}
         */
        __getDeltas (position) {
            let isLeftOrRight = /^(left|right)/.test(position);
            let margin = 0; // main-axis adjustment
            let offset = this.__getOffset(); // cross-axis adjustment

            let dX = isLeftOrRight ? margin : offset;
            let dY = isLeftOrRight ? offset : margin;

            /*
             * Invert dX to shift positioned element LEFT
             *
             *  - top-right
             *  - top-end
             *  - bottom-right
             *  - bottom-end
             */
            if (/^(top|bottom)-(right|end)/.test(position)) {
                dX = -dX;
            }

            /*
             * Invert dY to shift positioned element UP
             *
             *  - left-bottom
             *  - left-end
             *  - right-bottom
             *  - right-end
             */
            if (/^(left|right)-(bottom|end)/.test(position)) {
                dY = -dY;
            }

            return { dX, dY };
        }

        /**
         * Calculate offset based on class configuration and
         * positionable element's configured position.
         */
        __getOffset () {
            let offset = this.POSITION_OFFSET || 0;

            /*
             * Remove offset if positioned on major axis
             * so that the point of an optional arrow always aligns
             * to the center of the reference element.
             */
            if (/-(center|middle)$/.test(this.position)) {
                offset = 0;
            }

            return offset;
        }

        /**
         * Calculates DOMRect-like metadata as if the positioned element
         * were placed at the given coordinates.
         *
         * @param {XYCoordinates} coords
         * @returns {PositionableRect}
         */
        __getRectAtCoords (coords) {
            let { x, y } = coords;
            let { height, width } = this.getBoundingClientRect();

            return {
                bottom: y + height,
                left: x,
                right: x + width,
                top: y,
            };
        }

        /**
         * Given a set of coordinates, determine if any edge of the
         * positionable element collides with the viewport.
         *
         * @param {XYCoordinates} coords
         * @returns {PredicateCollisions}
         * Value returned only if collisions are detected.
         */
        __getViewportCollisions (coords) {
            let rect = this.__getRectAtCoords(coords);

            let bottom = rect.bottom > window.innerHeight;
            let left = rect.left < 0;
            let right = rect.right > window.innerWidth;
            let top = rect.top < 0;
            let vertically = (top || bottom);
            let horizontally = (left || right);
            let anywhere = (vertically || horizontally);

            return {
                anywhere,
                bottom,
                horizontally,
                left,
                right,
                top,
                vertically,
            };
        }

        /**
         * Positionable 'close' event listener.
         */
        __onClose () {
            this.__removeOpenListeners();
        }

        /**
         * Document 'click' event listener.
         * @param {Event} evt
         */
        __onDocumentClick (evt) {
            if (!this.controlElement) {
                return;
            }

            let inComponent = this.contains(evt.target);
            let inControl = this.controlElement.contains(evt.target);
            let isBackground = (!inComponent && !inControl);

            if (this.open && isBackground) {
                this.open = false;
            }
        }

        /**
         * Document 'scroll' event listener.
         */
        __onDocumentScroll () {
            this.reposition();
        }

        /**
         * Positionable 'open' event listener.
         */
        __onOpen () {
            this.__addOpenListeners();
            this.reposition();
        }

        /**
         * Window 'resize' event listener.
         */
        __onWindowResize () {
            this.reposition();
        }

        /**
         * Remove event listeners that only apply when open.
         */
        __removeOpenListeners () {
            // active listeners
            document.removeEventListener('click', this.__onDocumentClick);
            // passive listeners
            document.removeEventListener('scroll', this.__onDocumentScroll);
            window.removeEventListener('resize', this.__onWindowResize);
        }
    }

    return _Positionable;
};

