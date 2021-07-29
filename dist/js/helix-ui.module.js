/*! @license @nocompile
Copyright 2017-2021 Rackspace US, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// Keep track of prepared templates
const TEMPLATE_CACHE = {};

/**
 * Define functionality common to all HelixUI elements.
 *
 * @extends external:HTMLElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXElement extends HTMLElement {
    /**
     * Defines the name of the element to register in the Custom Element registry
     *
     * @abstract
     * @default undefined
     * @type {String}
     */
    static get is () {}

    /**
     * Defines the innerHTML of the ShadowDOM.
     *
     * If undefined, no Shadow Root will be created.
     *
     * @abstract
     * @default undefined
     * @type {String}
     */
    static get template () {}

    /**
     * Defines a list of attributes to watch for changes
     * (in addition to those defined by {@link HXElement.observedAttributes}).
     *
     * @abstract
     * @default []
     * @ignore
     * @type {Array<String>}
     */
    static get $observedAttributes () {
        return [];
    }

    /**
     * HelixUI lifecycle callback called at the end of construction.
     *
     * Use this callback to apply pre-connect setup logic.
     *
     * @abstract
     * @ignore
     */
    $onCreate () {}

    /**
     * HelixUI lifecycle method called at the end of the connectedCallback()
     * Custom Element lifecycle method.
     *
     * Use this callback to initialize an element's behavior.
     *
     * @abstract
     * @ignore
     */
    $onConnect () {}

    /**
     * HelixUI lifecycle method. Called at the end of {@link HXElement.disconnectedCallback}.
     *
     * @abstract
     * @ignore
     */
    $onDisconnect () {}

    /**
     * HelixUI lifecycle method called when an observed attribute's value changes.
     *
     * @abstract
     * @ignore
     * @param {String} attr - name of the attribute that changed
     * @param {String} newVal - value of the attribute after the change
     * @param {String} oldVal - value of the attribute before the change
     */
    $onAttributeChange (attr, oldVal, newVal) {} // eslint-disable-line no-unused-vars

    /**
     * Register class with the customElements registry.
     * Note: the custom element is only registered if the "is" class property is defined.
     */
    static $define () {
        if (this.is) {
            customElements.define(this.is, this);
        }
    }

    // Called when an instance is created
    constructor () {
        super();
        this._$setupShadowDOM();

        this.$onAttributeChange = this.$onAttributeChange.bind(this);
        this.$onConnect = this.$onConnect.bind(this);
        this.$onCreate = this.$onCreate.bind(this);
        this.$onDisconnect = this.$onDisconnect.bind(this);
        this.$relayEvent = this.$relayEvent.bind(this);

        this.$onCreate();
    }//constructor

    // Called when an instance of the element is attached to the DOM.
    connectedCallback () {
        this._$tabIndex = this.getAttribute('tabindex');
        this.$upgradeProperty('disabled');
        this.setAttribute('hx-defined', '');
        this._$styleElement();
        this.$onConnect();
    }

    // Called when an instance of the element is removed from the DOM.
    disconnectedCallback () {
        this.$onDisconnect();
    }

    /**
     * Custom Elements API property used to determine when to call the
     * attributeChangedCallback() lifecycle method.
     *
     * @default ['disabled']
     * @ignore
     * @see HXElement.$observedAttributes
     * @type {Array<String>}
     */
    static get observedAttributes () {
        let common = [ 'disabled' ];
        let extra = this.$observedAttributes;
        return [ ...common, ...extra ];
    }

    // Called when an attribute is SET (not just when it changes).
    attributeChangedCallback (attr, oldVal, newVal) {
        if (attr === 'disabled') {
            if (newVal !== null) {
                this.removeAttribute('tabindex');
                this.setAttribute('aria-disabled', true);
                this.blur();
            } else {
                if (this._$tabIndex) {
                    this.setAttribute('tabindex', this._$tabIndex);
                }
                this.removeAttribute('aria-disabled');
            }
        }

        // Always call $onAttributeChange, so that we can run additional
        // logic against common attributes in subclasses, too.
        if (newVal !== oldVal) {
            this.$onAttributeChange(attr, oldVal, newVal);
        }
    }//attributeChangedCallback

    /* ===== PUBLIC PROPERTIES ===== */

    /**
     * Indicates whether the element is disabled.
     * A disabled element is nonfunctional and noninteractive.
     *
     * @default false
     * @type {Boolean}
     */
    get disabled () {
        return this.hasAttribute('disabled');
    }
    set disabled (value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    /* ===== PUBLIC METHODS ===== */

    /**
     * Assign a value to an HTML attribute, if the attribute isn't present.
     *
     * @param {String} name - name of the attribute to set
     * @param {String} val - value to assign
     * @see https://goo.gl/MUFHD8
     */
    $defaultAttribute (name, val) {
        if (!this.hasAttribute(name)) {
            this.setAttribute(name, val);
        }
    }

    /**
     * Emit a custom event
     *
     * @param {String} evtName - name of event
     * @param {Object} opts - options to configure the event
     * @param {Boolean} [opts.cancelable=true] - whether the event can be canceled
     * @param {Boolean} [opts.bubbles=false] - whether the event bubbles up the DOM tree
     * @param {*} [opts.detail] - additional information to communicated along with the event
     *
     * @returns {Boolean}
     * Returns true if the event was not canceled by an event listener.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
     */
    $emit (evtName, opts) {
        let options = Object.assign({}, {
            cancelable: true,
            bubbles: false,
        }, opts);

        let evt = new CustomEvent(evtName, options);

        return this.dispatchEvent(evt);
    }//$emit

    /**
     * Relay an event within the ShadowDOM, retargeting the event to the custom element
     *
     * @param {Event} oldEvent - event to relay
     * @returns {Boolean} Returns true if the event was not canceled by an event listener.
     */
    $relayEvent (oldEvent) {
        // Emit new event of same name
        let newEvent = new CustomEvent(oldEvent.type, {
            bubbles: oldEvent.bubbles,
            cancelable: oldEvent.cancelable,
        });
        return this.dispatchEvent(newEvent);
    }//$relayEvent()

    /**
     * Relay events that do not bubble. For instance, `focus` and `blur` events
     * on an `<input>` within the ShadowDOM.
     *
     * @param {HTMLElement} el - element to attach non-bubbling event listeners
     */
    $relayNonBubblingEvents (el) {
        el.addEventListener('focus', this.$relayEvent);
        el.addEventListener('blur', this.$relayEvent);
    }

    /**
     * Remove events relayed by `$relayNonBubblingEvents`
     *
     * @param {HTMLElement} el - element to remove non-bubbline event listeners
     */
    $removeNonBubblingRelays (el) {
        el.removeEventListener('focus', this.$relayEvent);
        el.removeEventListener('blur', this.$relayEvent);
    }

    /**
     * Captures the value from the unupgraded instance and deletes the property
     * so it does not shadow the custom element's own property setter. This way,
     * when the element's definition does finally load, it can immediately
     * reflect the correct state.
     *
     * @param {String} prop - property name to upgrade
     * @see https://goo.gl/MDp6j5
     */
    $upgradeProperty (prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    /* ===== PRIVATE PROPERTIES ===== */
    // TBD

    /* ===== PRIVATE METHODS ===== */

    /**
     * @private
     * @description
     * Prepares a template for injection into the shadow root
     * @param {String} strTemplate - HTML template content
     * @returns {HTMLTemplate}
     */
    _$prepareTemplate (strTemplate) {
        let _elementName = this.constructor.is;

        if (TEMPLATE_CACHE[_elementName]) {
            return TEMPLATE_CACHE[_elementName];
        }

        let _template = document.createElement('template');
        _template.innerHTML = strTemplate;

        if (window.ShadyCSS) {
            // modifies 'template' variable in-place
            ShadyCSS.prepareTemplate(_template, _elementName);
        }

        // cache prepared template, so it isn't prepared more than once
        TEMPLATE_CACHE[_elementName] = _template;

        return _template;
    }//_$prepareTemplate()

    /**
     * @private
     * @description
     * If a ShadowDOM needs to be setup, this method handles:
     *
     * 1. preparing the <template> element
     * 2. attaching a shadow root
     * 3. applying ShadyDOM styling (if needed)
     * 4. stamping the template
     */
    _$setupShadowDOM () {
        // Don't do anything unless the "template" class property is defined.
        if (this.constructor.template) {
            let _template = this._$prepareTemplate(this.constructor.template);
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(_template.content.cloneNode(true));
        }
    }//_$setupShadowDOM()

    /**
     * @description
     * Style the element using ShadyCSS, if needed.
     *
     * @note: has the potential to modify the `[class]` attribute
     * of the element, so avoid running in the constructor.
     */
    _$styleElement () {
        // short circuit if browser natively supports ShadowDOM
        if (!window.ShadyCSS) {
            return;
        }

        ShadyCSS.styleElement(this);
    }
}

/**
 * @module HelixUI/Utils/Alignment
 * @description
 * Alignment logic in regards to positioning
 *
 * See https://codepen.io/CITguy/pen/b1286136d695391a40a6d708b765361c
 */

/**
 * @typedef {String} AlignmentString
 * @global
 *
 * @description
 * Positions are composed of alignments (e.g., the position `top-left`
 * has alignments `top` and `left`).  Some alignments are axis-specific,
 * while others are not. Alignments `start` and `end` may apply to either
 * horizontal (x-axis) alignment OR vertical (y-axis) aligment.
 *
 * Values:
 * - `bottom`
 * - `center`
 * - `end`
 * - `left`
 * - `middle`
 * - `right`
 * - `start`
 * - `top`
 */

/**
 * @typedef {String} PositionString
 * @global
 *
 * @description
 *
 * **Supported Positions**
 *
 * The following, normalized values are suported.
 * - `bottom-start`
 * - `bottom-left`
 * - `bottom-center`
 * - `bottom-right`
 * - `bottom-end`
 * - `center-middle`
 * - `left-start`
 * - `left-top`
 * - `left-middle`
 * - `left-bottom`
 * - `left-end`
 * - `right-start`
 * - `right-top`
 * - `right-middle`
 * - `right-bottom`
 * - `right-end`
 * - `top-start`
 * - `top-left`
 * - `top-center`
 * - `top-right`
 * - `top-end`
 *
 *
 * **Deprecated Positions**
 *
 * Support for the following values will be removed in a future release.
 * - `bottom`
 * - `center`
 * - `left`
 * - `right`
 * - `top`
 */

const OPPOSITE_ALIGNMENTS = {
    'bottom': 'top',
    'center': 'center',
    'end': 'start',
    'left': 'right',
    'middle': 'middle',
    'right': 'left',
    'start': 'end',
    'top': 'bottom',
};

/**
 * Convert position string into vertical alignment, horizontal alignment,
 * and main axis properties.
 *
 * @param {PositionString} position user-configured position string
 * @returns {Object} alignment metadata
 */
function getAlignment (position) {
    let crossAlign; // cross-axis alignment
    let crossAxis = getCrossAxis(position);
    let mainAlign; // main-axis alignment
    let mainAxis = getMainAxis(position);
    // x-axis and y-axis alignment (in relation to viewport coordinates)
    let yAlign = getVerticalAlignment(position);
    let xAlign = getHorizontalAlignment(position);

    // https://regex101.com/r/1oRJf8/7
    let startEndMatch = position.match(/(start|end)$/);
    if (startEndMatch) {
        if (mainAxis === 'x') {
            yAlign = startEndMatch[0];
        } else {
            xAlign = startEndMatch[0];
        }
    }

    // determine main-axis and cross-axis alignment
    if (mainAxis === 'x') {
        mainAlign = xAlign;
        crossAlign = yAlign;
    } else {
        mainAlign = yAlign;
        crossAlign = xAlign;
    }

    return {
        crossAlign,
        crossAxis,
        mainAlign,
        mainAxis,
        xAlign,
        yAlign,
    };
}

/**
 * Determine secondary axis (x or y; opposite of main axis) from position.
 *
 * @param {PositionString} position
 * @returns {Enum<String>}
 */
function getCrossAxis (position) {
    return (getMainAxis(position) === 'x' ? 'y' : 'x');
}

/**
 * Determine x-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
function getHorizontalAlignment (position) {
    let xAlign = 'center';

    // https://regex101.com/r/1oRJf8/5
    let hMatch = position.match(/^(left|right)|(left|right)$/);
    if (hMatch) {
        xAlign = hMatch[0];
    }

    return xAlign;
}

/**
 * Determine primary axis (x or y) from position
 *
 * @param {PositionString} position
 * @returns {Enum}
 */
function getMainAxis (position) {
    // https://regex101.com/r/1oRJf8/1
    if (/^(top|bottom)/.test(position)) {
        return 'y';
    } else {
        return 'x';
    }
}

/**
 * Determine y-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
function getVerticalAlignment (position) {
    let yAlign = 'middle';

    // https://regex101.com/r/1oRJf8/4
    let vMatch = position.match(/^(top|bottom)|(top|bottom)$/);
    if (vMatch) {
        yAlign = vMatch[0];
    }

    return yAlign;
}

/**
 * Calculates position string that is horizontally opposite of given position.
 *
 * @param {PositionString} position
 * @returns {PositionString} horizontally inverted position string
 */
function invertPositionHorizontally (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newXAlign = OPPOSITE_ALIGNMENTS[xAlign];
    return mainAxis === 'x' ? `${newXAlign}-${yAlign}` : `${yAlign}-${newXAlign}`;
}

/**
 * Calculates position string that is vertically opposite of given position.
 *
 * @param {PositionString} position
 * @returns {PositionString} vertically inverted position string
 */
function invertPositionVertically (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newYAlign = OPPOSITE_ALIGNMENTS[yAlign];
    return mainAxis === 'x' ? `${xAlign}-${newYAlign}` : `${newYAlign}-${xAlign}`;
}

/**
 * Normalize user-configured position to "{mainAlign}-{crossAlign}" format.
 *
 * - "top" -> "top-center"
 * - "right" -> "right-middle"
 * - "center" -> "center-middle"
 * - etc.
 *
 * @param {PositionString} position
 * @returns {PositionString}
 */
function normalizePosition (position) {
    let { crossAlign, mainAlign } = getAlignment(position);
    return `${mainAlign}-${crossAlign}`;
}

/**
 * @param {PositionString} position
 * @param {PredicateCollisions} collides
 */
function optimizePositionForCollisions (position, collides) {
    let { xAlign, yAlign } = getAlignment(position);

    // ----- COLLIDE WITH TOP EDGE -----
    // CHANGE
    // - 'top-*'            -> 'bottom-*'
    // - '(left|right)-top' -> '(left|right)-bottom'
    // - '(left|right)-end' -> '(left|right)-start'
    //
    // IGNORE
    // - 'bottom-*'
    // - '{H}-bottom'
    // - '{H}-start'
    // - '{H}-middle'
    if (collides.top && yAlign.match(/top|end/)) {
        position = invertPositionVertically(position);
    }

    // ----- COLLIDE WITH BOTTOM EDGE -----
    // CHANGE
    // - 'bottom-*'            -> 'top-*'
    // - '(left|right)-bottom' -> '(left|right)-top'
    // - '(left|right)-start'  -> '(left|right)-end'
    //
    // IGNORE
    // - 'top-*'
    // - '{H}-top'
    // - '{H}-middle'
    // - '{H}-end'
    if (collides.bottom && yAlign.match(/bottom|start/)) {
        position = invertPositionVertically(position);
    }

    // ----- COLLIDE WITH LEFT EDGE -----
    // CHANGE
    // - 'left-*'            -> 'right-*'
    // - '(top|bottom)-left' -> '(top|bottom)-right'
    // - '(top|bottom)-end'  -> '(top|bottom)-start'
    //
    // IGNORE
    // - 'right-*'
    // - '{V}-right'
    // - '{V}-start'
    // - '{V}-center'
    if (collides.left && xAlign.match(/left|end/)) {
        position = invertPositionHorizontally(position);
    }

    // ----- COLLIDE WITH RIGHT EDGE -----
    // CHANGE
    // - 'right-*'            -> 'left-*'
    // - '(top|bottom)-right' -> '(top|bottom)-left'
    // - '(top|bottom)-start' -> '(top|bottom)-end'
    //
    // IGNORE
    // - 'left-*'
    // - '(top|bottom)-left'
    // - '(top|bottom)-center'
    // - '(top|bottom)-end'
    if (collides.right && xAlign.match(/right|start/)) {
        position = invertPositionHorizontally(position);
    }

    // TODO: What if both sides of an axis collide?
    // e.g., both left/right or top/bottom collide

    return position;
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getAlignment: getAlignment,
    getCrossAxis: getCrossAxis,
    getHorizontalAlignment: getHorizontalAlignment,
    getMainAxis: getMainAxis,
    getVerticalAlignment: getVerticalAlignment,
    invertPositionHorizontally: invertPositionHorizontally,
    invertPositionVertically: invertPositionVertically,
    normalizePosition: normalizePosition,
    optimizePositionForCollisions: optimizePositionForCollisions
});

/**
 * @module HelixUI/Utils/Offset
 * @description
 * Utilities to calculate coordinates of an offset element
 * in relation to a relative element.
 *
 * @example <caption>Positioning a menu below a button</caption>
 * let elOffset = document.querySelector('menu');
 * let elReference = document.querySelector('button');
 *
 * // grab bounding DOMRects
 * let offRect = elOffset.getBoundingClientRect();
 * let refRect = elRef.getBoundingClientRect();
 *
 * // Calculate coordinates
 * let { x, y } = getBottom(offRect, refRect);
 */

/**
 * @external DOMRect
 * @description Object returned by Element.getBoundingClientRect().
 *
 * - MDN: [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect)
 */

/**
 * @global
 * @typedef {Number} Coordinate
 * @description Numeric, pixel coordinate
 */

/**
 * @typedef {Object} OffsetDelta
 * @description
 * Calculated metadata
 *
 * @prop {Integer} dH - height difference between target element and offset element
 * @prop {Integer} dW - width difference between target element and offset element
 * @prop {Integer} dX - X delta (a positive value shifts the target RIGHT)
 * @prop {Integer} dY - Y delta (a positive value shifts the target DOWN)
 */

/**
 * @typedef {Object} OffsetOptions
 * @description
 * Offset configuration object
 *
 * @default {}
 * @prop {Integer} [dX=0] - X offset (a positive value shifts the target RIGHT)
 * @prop {Integer} [dY=0] - Y offset (a positive value shifts the target DOWN)
 */

/**
 * @typedef {Object} XYCoordinates
 * @global
 *
 * @prop {Coordinate} x - X coordinate
 * @prop {Coordinate} y - Y coordinate
 */

/**
 * Utility function to calculate delta metadata
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {OffsetDelta}
 */
function _getDeltas (off, ref, opts = {}) {
    // height delta
    let dH = ref.height - off.height;
    // width delta
    let dW = ref.width - off.width;
    // X delta
    let dX = opts.dX || 0;
    // Y delta
    let dY = opts.dY || 0;

    return { dH, dW, dX, dY };
}

/**
 * Calculate { x, y } coordinates needed to center align two elements.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getCenter (off, ref, opts = {}) {
    let { dW, dH, dX, dY } = _getDeltas(off, ref, opts);

    let x = ref.left + (dW / 2) + dX;
    let y = ref.top + (dH / 2) + dY;

    return { x, y };
}

/**
 * Calculate { x, y } coordinates needed to position a target element above a
 * reference element, with their y-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getTop (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getCenter(off, ref, opts);
    let y = ref.top - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below a
 * reference element, with their y-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getBottom (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getCenter(off, ref, opts);
    let y = ref.top + ref.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left of a
 * reference element, with their x-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getLeft (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getCenter(off, ref, opts);
    let x = ref.left - off.width + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right of a
 * reference element, with their x-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getRight (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getCenter(off, ref, opts);
    let x = ref.left + ref.width + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getTopLeft (off, ref, opts) {
    let { x: xT, y } = getTop(off, ref, opts);
    let x = xT - (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getTopStart (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.left + dX;
    let { y } = getTop(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getTopEnd (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.right - off.width + dX;
    let { y } = getTop(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getTopRight (off, ref, opts) {
    let { x: xT, y } = getTop(off, ref, opts);
    let x = xT + (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getRightTop (off, ref, opts) {
    let { y: yR, x } = getRight(off, ref, opts);
    let y = yR - (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getRightStart (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getRight(off, ref, opts);
    let y = ref.top + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getRightEnd (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getRight(off, ref, opts);
    let y = ref.bottom - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and
 * slightly lower than the target element, so that the top edge of the target
 * element aligns with the x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getRightBottom (off, ref, opts) {
    let { x, y: yR } = getRight(off, ref, opts);
    let y = yR + (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getBottomRight (off, ref, opts) {
    let { x: xB, y } = getBottom(off, ref, opts);
    let x = xB + (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getBottomEnd (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.right - off.width + dX;
    let { y } = getBottom(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getBottomStart (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getBottom(off, ref, opts);
    let x = ref.left + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getBottomLeft (off, ref, opts) {
    let { x: xB, y } = getBottom(off, ref, opts);
    let x = xB - (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the top edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getLeftBottom (off, ref, opts) {
    let { x, y: yL } = getLeft(off, ref, opts);
    let y = yL + (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getLeftEnd (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);

    let { x } = getLeft(off, ref, opts);
    let y = ref.bottom - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getLeftStart (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getLeft(off, ref, opts);
    let y = ref.top + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {XYCoordinates}
 */
function getLeftTop (off, ref, opts) {
    let { x, y: yL } = getLeft(off, ref, opts);
    let y = yL - (off.height / 2);

    return { x, y };
}

/**
 * Key/value map of position values and their respective offset calculation function
 *
 * @enum {Function}
 * @name offsetFunctionMap
 */
const fnMap = {
    'bottom-center': getBottom,
    'bottom-end': getBottomEnd,
    'bottom-left': getBottomLeft,
    'bottom-right': getBottomRight,
    'bottom-start': getBottomStart,
    'center-middle': getCenter,
    'left-bottom': getLeftBottom,
    'left-end': getLeftEnd,
    'left-middle': getLeft,
    'left-start': getLeftStart,
    'left-top': getLeftTop,
    'right-bottom': getRightBottom,
    'right-end': getRightEnd,
    'right-middle': getRight,
    'right-start': getRightStart,
    'right-top': getRightTop,
    'top-center': getTop,
    'top-end': getTopEnd,
    'top-left': getTopLeft,
    'top-right': getTopRight,
    'top-start': getTopStart,
};
// position aliases
fnMap['left'] = fnMap['left-middle'];
fnMap['top'] = fnMap['top-center'];
fnMap['right'] = fnMap['right-middle'];
fnMap['bottom'] = fnMap['bottom-center'];
fnMap['center'] = fnMap['center-middle'];

const offsetFunctionMap = fnMap;

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCenter: getCenter,
    getTop: getTop,
    getBottom: getBottom,
    getLeft: getLeft,
    getRight: getRight,
    getTopLeft: getTopLeft,
    getTopStart: getTopStart,
    getTopEnd: getTopEnd,
    getTopRight: getTopRight,
    getRightTop: getRightTop,
    getRightStart: getRightStart,
    getRightEnd: getRightEnd,
    getRightBottom: getRightBottom,
    getBottomRight: getBottomRight,
    getBottomEnd: getBottomEnd,
    getBottomStart: getBottomStart,
    getBottomLeft: getBottomLeft,
    getLeftBottom: getLeftBottom,
    getLeftEnd: getLeftEnd,
    getLeftStart: getLeftStart,
    getLeftTop: getLeftTop,
    offsetFunctionMap: offsetFunctionMap
});

var _account = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.3209877,1.925 C15.1937339,1.925 15.9012346,2.55266234 15.9012346,3.32692308 L15.9012346,3.32692308 L15.9012346,12.6730769 C15.9012346,13.4473377 15.1937339,14.075 14.3209877,14.075 L14.3209877,14.075 L1.67901235,14.075 C0.806266074,14.075 0.0987654321,13.4473377 0.0987654321,12.6730769 L0.0987654321,12.6730769 L0.0987654321,3.32692308 C0.0987654321,2.55266234 0.806266074,1.925 1.67901235,1.925 L1.67901235,1.925 Z M14.3817664,2.9375 L1.61823362,2.9375 C1.32452093,2.9375 1.08641975,3.14355077 1.08641975,3.39772727 L1.08641975,3.39772727 L1.08641975,12.6022727 C1.08641975,12.8564492 1.32452093,13.0625 1.61823362,13.0625 L1.61823362,13.0625 L14.3817664,13.0625 C14.6754791,13.0625 14.9135802,12.8564492 14.9135802,12.6022727 L14.9135802,12.6022727 L14.9135802,3.39772727 C14.9135802,3.14355077 14.6754791,2.9375 14.3817664,2.9375 L14.3817664,2.9375 Z M4.77352384,5.03703704 C5.77220738,5.03703704 6.58170474,5.81216876 6.58170474,6.76994417 C6.58170474,7.19249135 6.42234125,7.59457478 6.13494361,7.91051384 L6.06686574,7.97726827 L6.18291452,8.06228815 L6.29795063,8.1551932 L6.39377546,8.239955 L6.48679499,8.3291328 L6.68280502,8.53971463 L6.84791255,8.74898994 C7.04338882,9.0174286 7.20171194,9.31720762 7.32429099,9.65124215 L7.40954528,9.90823651 L7.46141134,10.0969232 L7.49780689,10.2516718 L7.53075218,10.4169046 L7.64120973,11.1604938 L1.925,11.1604938 L2.03232231,10.4343866 L2.08549306,10.1783266 C2.16989209,9.81969718 2.29870746,9.47966351 2.47147878,9.15946536 C2.70468678,8.72571269 2.97907604,8.37974802 3.29842966,8.12096395 L3.46187102,7.99883415 L3.48499074,7.98407211 L3.3953975,7.89205113 C3.2497582,7.72806948 3.13731194,7.53957972 3.06369163,7.33510034 L3.01584429,7.17887586 L2.98308476,7.01745389 L2.96874942,6.88682149 L2.96458913,6.76994417 C2.96458913,5.81233572 3.77466191,5.03703704 4.77352384,5.03703704 Z M4.37095617,8.59928737 C3.96856309,8.73434917 3.62777007,9.05942158 3.33874494,9.59698967 C3.28312664,9.70006777 3.23327796,9.80596332 3.1897883,9.91301411 L3.12939674,10.0742489 L3.08606574,10.212816 L6.47996574,10.212816 L6.42802096,10.0382764 C6.4033844,9.96589884 6.37683649,9.8959478 6.3484803,9.82860894 L6.25809002,9.63461451 L6.18186356,9.49642558 L6.12110517,9.39871902 L6.05918119,9.30839189 L5.93276374,9.14582664 L5.78285898,8.98564388 L5.71528945,8.92161261 C5.28312788,8.52644011 4.87530461,8.43034392 4.37095617,8.59928737 Z M13.315625,8.49382716 C13.4953641,8.49382716 13.6410714,8.71492111 13.6410714,8.98765432 C13.6410714,9.23008384 13.5259446,9.43171197 13.3741244,9.47352526 L13.315625,9.48148148 L8.759375,9.48148148 C8.5796359,9.48148148 8.43392857,9.26038753 8.43392857,8.98765432 C8.43392857,8.7452248 8.54905535,8.54359667 8.70087559,8.50178338 L8.759375,8.49382716 L13.315625,8.49382716 Z M4.77352384,5.98355417 C4.31383137,5.98355417 3.94261036,6.33613037 3.94261036,6.76994417 C3.94261036,7.20398751 4.31406712,7.55705396 4.77352384,7.55705396 C5.23274576,7.55705396 5.60368352,7.20421623 5.60368352,6.76994417 C5.60368352,6.33590169 5.23298146,5.98355417 4.77352384,5.98355417 Z M13.315625,6.51851852 C13.4953641,6.51851852 13.6410714,6.73961247 13.6410714,7.01234568 C13.6410714,7.2547752 13.5259446,7.45640333 13.3741244,7.49821662 L13.315625,7.50617284 L8.759375,7.50617284 C8.5796359,7.50617284 8.43392857,7.28507889 8.43392857,7.01234568 C8.43392857,6.76991616 8.54905535,6.56828803 8.70087559,6.52647474 L8.759375,6.51851852 L13.315625,6.51851852 Z'/></svg>";

var _angleBottom = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 3.002c0-.284.123-.566.359-.763a1.006 1.006 0 0 1 1.409.126L7.997 7.4l4.235-5.043c.354-.42.984-.478 1.409-.126a.988.988 0 0 1 .127 1.398L7.997 10.5 2.232 3.638A.986.986 0 0 1 2 3.002zM14 13a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h10a1 1 0 0 1 1 1z'/></svg>";

var _angleDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.004 12.25L2.233 5.378a.988.988 0 0 1 .126-1.398 1.007 1.007 0 0 1 1.409.127l4.236 5.042 4.229-5.034c.352-.42.98-.478 1.408-.127.424.35.48.977.127 1.398L8.004 12.25z'/></svg>";

var _angleEnd = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.002 14a.991.991 0 0 1-.763-.359 1.006 1.006 0 0 1 .126-1.409L7.4 8.003 2.357 3.768a1.005 1.005 0 0 1-.126-1.409.988.988 0 0 1 1.398-.127L10.5 8.003l-6.862 5.765a.986.986 0 0 1-.636.232zM13 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z'/></svg>";

var _angleLeft = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.248 14a.986.986 0 0 1-.636-.232L3.75 8.003l6.871-5.77a.988.988 0 0 1 1.398.126 1.005 1.005 0 0 1-.126 1.41L6.85 8.002l5.035 4.23c.42.353.477.983.126 1.408a.991.991 0 0 1-.763.36z'/></svg>";

var _angleRight = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.388 2.232a.988.988 0 0 0-1.398.127 1.004 1.004 0 0 0 .126 1.409l5.033 4.229-5.042 4.235a1.005 1.005 0 0 0-.126 1.409.985.985 0 0 0 1.398.127l6.871-5.771-6.862-5.765z'/></svg>";

var _angleStart = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.998 14a.986.986 0 0 1-.636-.232L5.5 8.003l6.871-5.77a.988.988 0 0 1 1.398.126 1.005 1.005 0 0 1-.126 1.41L8.6 8.002l5.035 4.23c.42.353.477.983.126 1.408a.991.991 0 0 1-.763.36zM3 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z'/></svg>";

var _angleTop = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 12.998c0-.225.076-.45.232-.636L7.997 5.5l5.771 6.871a.988.988 0 0 1-.127 1.398 1.005 1.005 0 0 1-1.409-.126L7.997 8.6l-4.229 5.035c-.354.42-.984.477-1.409.126A.991.991 0 0 1 2 12.998zM14 3a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h10a1 1 0 0 1 1 1z'/></svg>";

var _angleUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13.001 12.25c-.287 0-.571-.122-.769-.356L7.996 6.85l-4.228 5.034a1.005 1.005 0 0 1-1.409.127.99.99 0 0 1-.127-1.4L7.996 3.75l5.772 6.87a.99.99 0 0 1-.127 1.4c-.188.155-.414.23-.64.23'/></svg>";

var _bell = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.82241729,0.00630234998 C7.07863262,0.0631722164 6.46191561,0.503853842 6.17480937,1.17468745 L6.12041448,1.31551205 L6.29907174,1.2543462 C4.86693113,1.70412166 3.79932216,2.63503457 3.01102551,4.00782053 C2.45332428,4.97909719 2.09868772,6.03952303 1.92835417,7.194212 L1.86056388,7.74494223 L1.792473,8.33426418 C1.78542198,8.39057211 1.77847065,8.44422761 1.77154717,8.49563565 L1.72976584,8.78035434 L1.68520457,9.03057352 L1.63441488,9.26573256 C1.62523931,9.30475069 1.61566055,9.34395128 1.60560673,9.38373933 C1.52170882,9.71655422 1.36753406,9.95957286 1.11499402,10.1491352 C0.869729271,10.3333088 0.65766662,10.5322604 0.478276322,10.7529875 C0.234125544,11.0533687 0.0773786956,11.3970988 0.00904095431,11.7764351 L0,11.8776139 L0,12.2207826 L0.0147311952,12.3496098 C0.089866589,12.6738508 0.181488311,12.937936 0.319785102,13.1881228 L0.393519536,13.3083985 C0.653268238,13.6915244 1.05108843,13.8958667 1.53894845,13.8958667 L5.51399213,13.8934359 L5.51750215,13.9174905 C5.53991578,14.0676223 5.57690922,14.2156548 5.62817767,14.355433 C5.95200659,15.2364139 6.62360115,15.7879119 7.56779898,15.9877637 L7.68597164,16.0001331 L8.31344106,16.0001331 L8.43673482,15.9866552 L8.62432732,15.9397828 C9.60369957,15.6658966 10.2434235,15.0104422 10.4613503,14.0133778 L10.4823835,13.8934359 L14.4505889,13.8960491 C14.9953901,13.8963406 15.4269956,13.6464099 15.6827223,13.1777186 C16.2239489,12.1857791 16.0702137,11.240156 15.240884,10.4564717 C15.1691119,10.3886011 15.0951799,10.3219298 15.0143634,10.251983 L14.7465363,10.0278406 C14.5648775,9.87996949 14.469402,9.69364868 14.3724685,9.3027401 L14.3128831,9.03796997 L14.2727677,8.81639052 L14.2364109,8.56331235 L14.1989216,8.24901649 L14.1157734,7.5091975 L14.0747825,7.22127027 C13.817534,5.58700231 13.2761282,4.22720215 12.3463906,3.07367913 L12.1674589,2.86152545 C11.5590043,2.17237278 10.8303015,1.66391632 9.97860343,1.34915879 L9.87317513,1.31272603 L9.82003244,1.17256021 C9.50829398,0.441774326 8.82410434,-0.00149553284 7.98356539,3.79143844e-06 L7.82241729,0.00630234998 Z M7.97868572,13.5591142 L9.32618774,13.8460736 L9.31131896,13.9065109 C9.16811917,14.3902905 8.85857789,14.6850763 8.33752935,14.8349471 L8.24335703,14.8583253 L7.75487594,14.8583253 L7.80414431,14.8711526 C7.23362135,14.750394 6.88376798,14.4631025 6.69958568,13.9620323 L6.66554452,13.8488597 L7.97868572,13.5591142 Z M7.98565969,1.14137167 C8.38210384,1.14066724 8.66043724,1.32417306 8.78634538,1.66068926 L8.81951075,1.76620322 C8.89423692,2.05452513 9.08895095,2.25832663 9.37610392,2.34905258 C10.2088033,2.61120633 10.8947985,3.09140895 11.4577382,3.78990278 C12.2514229,4.77462532 12.7191851,5.94946146 12.9472837,7.39854347 L12.984371,7.65998767 L13.086658,8.56675381 L13.1270209,8.87525866 L13.1701338,9.1398646 L13.2216657,9.39363805 C13.3840639,10.1254969 13.5677552,10.5399867 14.0256479,10.9127129 L14.2631819,11.1113342 C14.3336772,11.1722626 14.3968583,11.2291808 14.4568309,11.2858933 C14.9109341,11.7150031 14.9728449,12.0958154 14.6808067,12.6310518 L14.6490597,12.6814701 C14.6060694,12.7381744 14.556366,12.7546995 14.4511177,12.7546995 L11.6302212,12.7530275 L11.6511211,12.7491581 L6.59682285,12.7511702 L4.18478766,12.7506819 L4.19435024,12.7520989 L1.53864603,12.7545169 C1.41381846,12.7545169 1.37039712,12.7294148 1.3185563,12.6357321 L1.27302391,12.5457314 C1.22977581,12.4521752 1.19300704,12.3471026 1.15935554,12.2228648 L1.14087907,12.1512486 L1.14087907,11.9385828 L1.13230885,11.9787927 C1.1666255,11.7883042 1.2420913,11.6228153 1.36397953,11.472855 C1.45200348,11.3645477 1.5553958,11.2611164 1.67509041,11.1609775 L1.80025371,11.0618775 C2.26896778,10.71005 2.56657243,10.2409493 2.71225487,9.66304058 L2.77567299,9.39409485 L2.82921333,9.12445659 L2.87677782,8.8329127 L2.92226836,8.49825007 L3.01283634,7.70782836 C3.14022864,6.55223669 3.46239079,5.51385237 4.00080544,4.57616468 C4.65346971,3.43957688 5.49967949,2.70171534 6.64081124,2.34333354 C6.90571616,2.26026739 7.0640896,2.08707495 7.14696497,1.86032026 L7.17795113,1.75996696 C7.26708396,1.41369852 7.52125605,1.19021227 7.86701131,1.14848955 L7.98565969,1.14137167 Z'/></svg>";

var _billing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13,0 C13.8284271,0 14.5,0.7163444 14.5,1.6 L14.5,1.6 L14.5,14.4 C14.5,15.2836556 13.8284271,16 13,16 L13,16 L3,16 C2.17157288,16 1.5,15.2836556 1.5,14.4 L1.5,14.4 L1.5,1.6 C1.5,0.7163444 2.17157288,0 3,0 L3,0 Z M12.9242424,1.14285714 L3.07575758,1.14285714 C2.80379918,1.14285714 2.58333333,1.37901464 2.58333333,1.67032967 L2.58333333,1.67032967 L2.58333333,14.3296703 C2.58333333,14.6209854 2.80379918,14.8571429 3.07575758,14.8571429 L3.07575758,14.8571429 L12.9242424,14.8571429 C13.1962008,14.8571429 13.4166667,14.6209854 13.4166667,14.3296703 L13.4166667,14.3296703 L13.4166667,1.67032967 C13.4166667,1.37901464 13.1962008,1.14285714 12.9242424,1.14285714 L12.9242424,1.14285714 Z M10.84375,12.5714286 C11.0681157,12.5714286 11.25,12.8272659 11.25,13.1428571 C11.25,13.4233827 11.1062889,13.6566953 10.916774,13.7050792 L10.84375,13.7142857 L5.15625,13.7142857 C4.93188432,13.7142857 4.75,13.4584484 4.75,13.1428571 C4.75,12.8623316 4.89371107,12.629019 5.08322605,12.5806351 L5.15625,12.5714286 L10.84375,12.5714286 Z M10.84375,10.8571429 C11.0681157,10.8571429 11.25,11.1129801 11.25,11.4285714 C11.25,11.709097 11.1062889,11.9424096 10.916774,11.9907935 L10.84375,12 L5.15625,12 C4.93188432,12 4.75,11.7441627 4.75,11.4285714 C4.75,11.1480458 4.89371107,10.9147333 5.08322605,10.8663493 L5.15625,10.8571429 L10.84375,10.8571429 Z M8.04225,2.28571429 L8.06238826,2.28770626 L8.13808147,2.31238072 L8.18331157,2.3471878 C8.22138039,2.38734831 8.24158333,2.43910844 8.24154484,2.49904654 L8.24154484,2.49904654 L8.22425,3.04114286 L8.36206115,3.07195326 C8.66686794,3.15150104 8.9251497,3.28946143 9.1354245,3.48589611 L9.1354245,3.48589611 L9.2558167,3.61077433 C9.524779,3.92030936 9.65966667,4.3026483 9.65966667,4.752 L9.65966667,4.752 L9.65777844,4.90924476 L9.63438911,4.98909693 L9.6013949,5.0368122 C9.56332608,5.07697272 9.51426179,5.09828571 9.46033333,5.09828571 L9.46033333,5.09828571 L8.79561174,5.09629374 L8.71991853,5.07161928 L8.67468843,5.0368122 C8.63661961,4.99665169 8.61641667,4.94489156 8.61641667,4.888 L8.61641667,4.888 L8.61665487,4.80757462 L8.60972263,4.69333984 C8.58766766,4.52282306 8.51082096,4.37607381 8.37591682,4.24935367 C8.21287154,4.0961996 7.98448648,4.01828571 7.68583333,4.01828571 C7.44047991,4.01828571 7.2566476,4.07268155 7.13131776,4.17754259 C7.01162752,4.27768509 6.95241667,4.41769105 6.95241667,4.608 C6.95241667,4.74295743 6.98392722,4.84804473 7.04556871,4.92775695 C7.113464,5.01555632 7.21787522,5.09816739 7.35953873,5.17411598 C7.38955413,5.19020782 7.42289577,5.20723911 7.45956557,5.22520848 L7.45956557,5.22520848 L7.71953786,5.34427069 L8.25962843,5.57154056 C8.51538988,5.68379988 8.72675458,5.78773191 8.89400255,5.88357446 C9.11299657,6.00907043 9.30075405,6.18434439 9.45665872,6.40836504 C9.61765721,6.63970505 9.69758333,6.92609436 9.69758333,7.264 C9.69758333,7.71399503 9.56352502,8.08920198 9.29578634,8.38318013 C9.02979479,8.67523992 8.66307738,8.85160563 8.22656732,8.90611162 L8.256,8.901 L8.26244511,9.39724476 L8.23905577,9.47709693 L8.20606157,9.5248122 C8.16799274,9.56497272 8.11892846,9.58628571 8.065,9.58628571 L8.065,9.58628571 L7.45336174,9.58429374 L7.37766853,9.55961928 L7.33243843,9.5248122 C7.29436961,9.48465169 7.27416667,9.43289156 7.27417873,9.37429443 L7.27417873,9.37429443 L7.28391667,8.89371429 L7.14284755,8.86466605 C6.83243138,8.78677625 6.57092032,8.65414839 6.35965548,8.46643645 L6.35965548,8.46643645 L6.23893685,8.34719644 C5.96871993,8.0506147 5.83333333,7.67407495 5.83333333,7.224 L5.83333333,7.224 L5.83522156,7.00275524 L5.85861089,6.92290307 L5.8916051,6.8751878 C5.92967392,6.83502728 5.97873821,6.81371429 6.03266667,6.81371429 L6.03266667,6.81371429 L6.68980493,6.81570626 L6.76549813,6.84038072 L6.81072823,6.8751878 C6.84879706,6.91534831 6.869,6.96710844 6.869,7.024 L6.869,7.024 L6.8687149,7.16771405 L6.87602124,7.27830085 C6.89915558,7.44131679 6.98000215,7.57987187 7.12315389,7.69797508 C7.29950902,7.84347179 7.54409343,7.91771429 7.86025,7.91771429 C8.13433563,7.91771429 8.33294228,7.85616065 8.45974489,7.73826185 C8.58526456,7.62155592 8.64675,7.47423822 8.64675,7.288 C8.64675,7.16439137 8.61451776,7.06344423 8.55000038,6.98049333 C8.47945638,6.8897939 8.37373744,6.80584833 8.2320446,6.72988402 C8.20178444,6.71366096 8.16851462,6.69640446 8.13226092,6.67812663 L8.13226092,6.67812663 L7.87913854,6.55630075 L7.55564107,6.41054464 C7.21284426,6.2702099 6.93318083,6.13758194 6.71621592,6.01223957 C6.48942715,5.88122189 6.30006801,5.70286164 6.14903601,5.47809187 C5.99375129,5.2469931 5.91675,4.96123008 5.91675,4.624 C5.91675,4.19029148 6.04427926,3.8286346 6.2991267,3.54533025 C6.5517137,3.26453875 6.89365164,3.09059195 7.29676601,3.02988838 L7.2655,3.03542857 L7.25330489,2.47475524 L7.27669423,2.39490307 L7.30968843,2.3471878 C7.34775726,2.30702728 7.39682154,2.28571429 7.45075,2.28571429 L7.45075,2.28571429 L8.04225,2.28571429 Z'/></svg>";

var _calendar = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6 3h4V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1zM3 7v2h2V7H3zm4 0v2h2V7H7zm4 0v2h2V7h-2zm-4 4v2h2v-2H7zm-4 0v2h2v-2H3zm1-9v3h1V2H4zm7 0v3h1V2h-1z'/></svg>";

var _chart = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15 12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v9h13zM11.267 2H15v3.78l-1.174-1.19-4.05 4.049a1 1 0 0 1-1.413 0l-1.42-1.42-2.68 2.679a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l3.387-3.386a.996.996 0 0 1 1.414 0l1.42 1.42 3.35-3.351L11.267 2z'/></svg>";

var _checkmark = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.038 14.997c-.438 0-.858-.192-1.145-.53L1.355 9.111a1.5 1.5 0 0 1 2.289-1.939l3.171 3.742 5.392-9.175a1.5 1.5 0 0 1 2.586 1.52L8.331 14.257a1.5 1.5 0 0 1-1.293.74'/></svg>";

var _checkmarkCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.16 5.9l-4.164 5.418a1 1 0 0 1-.74.39c-.018.002-.035.002-.053.002-.273 0-.535-.113-.725-.312L3.91 8.694a1 1 0 0 1 1.45-1.378l1.763 1.856 3.451-4.492A1 1 0 0 1 12.16 5.9M8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7'/></svg>";

var _clock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm1-7.478V3a1 1 0 1 0-2 0v4.792a.998.998 0 0 0 .278.83l2.558 2.613a.989.989 0 0 0 1.407.008l.007-.008a1 1 0 0 0 .008-1.406L9 7.522z'/></svg>";

var _cog = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.006 10.16A2.19 2.19 0 0 1 5.82 7.973a2.19 2.19 0 0 1 2.187-2.188 2.19 2.19 0 0 1 2.188 2.188 2.19 2.19 0 0 1-2.188 2.187m6.778-3.458l-1.292-.209a5.673 5.673 0 0 0-.73-1.635l.807-.972a.246.246 0 0 0-.014-.323L12.22 2.23a.253.253 0 0 0-.326-.019l-1.058.834a5.634 5.634 0 0 0-1.615-.626l-.085-1.2A.238.238 0 0 0 8.904 1H7.019a.243.243 0 0 0-.237.218l-.102 1.23a5.63 5.63 0 0 0-1.539.618L4.03 2.209a.256.256 0 0 0-.327.021L2.369 3.563a.253.253 0 0 0-.019.326l.845 1.059a5.65 5.65 0 0 0-.688 1.597l-1.29.1A.241.241 0 0 0 1 6.88v1.886c0 .12.098.23.217.245l1.228.148a5.62 5.62 0 0 0 .647 1.669l-.741.93a.25.25 0 0 0 .018.325l1.333 1.333a.263.263 0 0 0 .33.024l.915-.677c.547.35 1.157.609 1.81.756l.094 1.263a.24.24 0 0 0 .235.218h1.761c.12 0 .232-.097.247-.217l.16-1.264a5.634 5.634 0 0 0 1.776-.735l.862.654a.26.26 0 0 0 .329-.022l1.334-1.333a.263.263 0 0 0 .023-.331l-.671-.903c.33-.563.568-1.187.69-1.852l1.185-.094A.24.24 0 0 0 15 8.668V6.955a.267.267 0 0 0-.216-.253'/></svg>";

var _copy = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9 6c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h7zm5-5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h1V3H8v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1h7z'/></svg>";

var _critical = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.7243621,1.5 C11.9186443,1.5 12.0980697,1.59444093 12.1917823,1.74636766 L12.1917823,1.74636766 L15.9322869,7.76595073 C16.022571,7.91069172 16.022571,8.08930828 15.9322869,8.23507581 L15.9322869,8.23507581 L12.1917823,14.2536323 C12.0980697,14.4055591 11.9186443,14.5 11.7243621,14.5 L11.7243621,14.5 L4.27535223,14.5 C4.08221282,14.5 3.90278745,14.4055591 3.807932,14.2536323 L3.807932,14.2536323 L0.0685702041,8.23507581 C-0.0228567347,8.08930828 -0.0228567347,7.91069172 0.0685702041,7.76595073 L0.0685702041,7.76595073 L3.807932,1.74636766 C3.90278745,1.59444093 4.08221282,1.5 4.27535223,1.5 L4.27535223,1.5 Z M10.3879795,4.73411646 L7.96260323,7.15807851 L5.66551634,4.86038553 L4.85739431,5.66850756 L7.15438018,7.96630156 L4.73112524,10.3909707 L5.49715758,11.1570031 L7.92088393,8.73280531 L10.2196207,11.030734 L11.0277428,10.222612 L8.72910698,7.92458226 L11.1540118,5.50014881 L10.3879795,4.73411646 Z' fill='#D6251F'/></svg>";

var _download = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1zm-7 .674l.003-6.671a1 1 0 1 1 2 0L9 8.679l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 8.674z'/></svg>";

var _envelope = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.995 2C15.55 2 16 2.458 16 3.019v1.055L8.017 8.861 0 4.062V3.019C0 2.458.453 2 1.005 2h13.99zm-6.978 8.885c.189 0 .379-.05.545-.15L16 6.276V12.982c0 .56-.45 1.019-1 1.019H1c-.549 0-1-.458-1-1.02V6.263l7.473 4.474c.165.099.355.149.544.149z'/></svg>";

var _exclamationCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.85 0 7 3.15 7 7s-3.15 7-7 7-7-3.15-7-7 3.15-7 7-7zm.5 11.5c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _exclamationDiamond = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.692 7.253c.41.412.41 1.082 0 1.492l-6.946 6.948c-.41.41-1.082.41-1.492 0L.308 8.745a1.057 1.057 0 0 1 0-1.493L7.254.308c.41-.41 1.082-.41 1.492 0l6.946 6.946zM8.5 12.5c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _exclamationTriangle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.832 13.3c.438.88-.016 1.697-.944 1.698C11.925 15.001 9.962 15 8 15c-1.973 0-3.944.002-5.914 0-.608 0-1.054-.39-1.084-.985a1.395 1.395 0 0 1 .145-.663C3.123 9.44 5.104 5.533 7.088 1.627c.2-.393.5-.634.925-.627.433.007.72.272.923.674 1.68 3.317 3.364 6.632 5.046 9.947.284.56.57 1.117.851 1.68zm-6.332.2c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _externalLink = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11 9a1 1 0 1 1 2 0v4.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 13.5v-9A1.5 1.5 0 0 1 2.5 3H7a1 1 0 1 1 0 2H3v8h8V9zm2-4.586L7.707 9.707a1 1 0 1 1-1.414-1.414L11.586 3H10a1 1 0 1 1 0-2h5v5a1 1 0 1 1-2 0V4.414z'/></svg>";

var _file = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 0h8.5L14 2.5V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zm10 3h-1.5c-.323 0-.5-.183-.5-.5V1H3v14h10V3z'/></svg>";

var _filter = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.811 2.084L9.909 6.986v7.378a.644.644 0 0 1-.387.587.743.743 0 0 1-.25.049.592.592 0 0 1-.447-.189L6.28 12.266a.63.63 0 0 1-.189-.447V6.986L1.19 2.084a.626.626 0 0 1-.14-.696c.1-.229.329-.388.587-.388h12.727c.258 0 .487.16.586.389a.626.626 0 0 1-.139.695'/></svg>";

var _fishHook = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 5.5 L8.5 11.5 L5 11.5 L5 11.5 C5 14.6045752 9.80584391 14.6654492 9.99430837 11.6826221 L10 11.5 L10.0000889 5.82932572 C8.8348501 5.41751442 8 4.30625206 8 3 C8 1.34314575 9.34314575 0 11 0 C12.6568542 0 14 1.34314575 14 3 C14 4.30588222 13.1656226 5.41688515 12.0009007 5.82897577 L12 11.5 C12 17.3333333 3 17.3333333 3 11.5 L3 5.5 Z M11 2 C10.4477153 2 10 2.44771525 10 3 C10 3.55228475 10.4477153 4 11 4 C11.5522847 4 12 3.55228475 12 3 C12 2.44771525 11.5522847 2 11 2 Z'></path></svg>";

var _flag = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 2.5c1.566.783 3.13.95 5.315.303.472-.14.685.1.685.471v7.419c0 .2-.027.322-.281.441-1.899.887-3.813.82-5.719-.134-1.333-.667-2.667-.722-4-.5V14a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1c.496 0 .908.526.987 1C5.32 1.774 6.662 1.831 8 2.5z'/></svg>";

var _globe = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.54 13.34a7.007 7.007 0 0 1-2.594 1.39c.434-.64.793-1.495 1.057-2.497a6.535 6.535 0 0 1 1.537 1.108zm-6.602-1.438A6.525 6.525 0 0 1 8 11.57c.72 0 1.414.117 2.062.332C9.59 13.778 8.801 15.003 8 15.003c-.8 0-1.59-1.225-2.062-3.1zM3.46 13.341c.453-.44.97-.814 1.537-1.108.264 1.002.623 1.856 1.057 2.498a7.007 7.007 0 0 1-2.594-1.39zm9.797-.703a7.536 7.536 0 0 0-2.028-1.413c.155-.843.25-1.762.274-2.725H15a6.962 6.962 0 0 1-1.743 4.138zm-7.53-1.79A16.764 16.764 0 0 1 5.501 8.5h4.998a16.764 16.764 0 0 1-.226 2.349A7.532 7.532 0 0 0 8 10.5c-.792 0-1.556.122-2.273.349zm-2.984 1.79A6.962 6.962 0 0 1 1 8.5h3.497c.025.963.119 1.882.274 2.725a7.536 7.536 0 0 0-2.028 1.413zM13.257 3.36A6.962 6.962 0 0 1 15 7.498h-3.497a17.615 17.615 0 0 0-.274-2.725 7.536 7.536 0 0 0 2.028-1.413zm-7.53 1.79c.717.226 1.48.349 2.273.349.792 0 1.556-.123 2.273-.349.123.725.203 1.516.226 2.349H5.501c.023-.833.103-1.624.226-2.349zM2.743 3.36a7.536 7.536 0 0 0 2.028 1.413c-.155.843-.25 1.762-.274 2.725H1A6.962 6.962 0 0 1 2.743 3.36zm9.797-.698c-.453.44-.97.814-1.537 1.108-.264-1.001-.623-1.856-1.057-2.497a7.007 7.007 0 0 1 2.594 1.39zm-6.602 1.44C6.41 2.225 7.199 1 8 1c.8 0 1.59 1.226 2.062 3.101A6.525 6.525 0 0 1 8 4.433c-.72 0-1.414-.116-2.062-.332zM3.46 2.661a7.007 7.007 0 0 1 2.594-1.39c-.434.642-.793 1.497-1.057 2.498A6.535 6.535 0 0 1 3.46 2.662z'/></svg>";

var _grid = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9 10 L9 14 C9 14.553 9.448 15 10 15 L14 15 C14.552 15 15 14.553 15 14 L15 10 C15 9.448 14.552 9 14 9 L10 9 C9.448 9 9 9.448 9 10 M9 2 L9 6 C9 6.553 9.448 7 10 7 L14 7 C14.552 7 15 6.553 15 6 L15 2 C15 1.448 14.552 1 14 1 L10 1 C9.448 1 9 1.448 9 2 M1 10 L1 14 C1 14.553 1.448 15 2 15 L6 15 C6.552 15 7 14.553 7 14 L7 10 C7 9.448 6.552 9 6 9 L2 9 C1.448 9 1 9.448 1 10 M2 1 L6 1 C6.552 1 7 1.448 7 2 L7 6 C7 6.553 6.552 7 6 7 L2 7 C1.448 7 1 6.553 1 6 L1 2 C1 1.448 1.448 1 2 1'/></svg>";

var _heartbeatOutline = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.01582209 5.72757766 L9.34691943 10.8910602 C9.44287277 11.264693 9.82464455 11.4903019 10.1992709 11.3933207 C10.389136 11.3443197 10.5473569 11.2187546 10.6392271 11.0492927 L10.6800583 10.9614992 L11.5334306 8.68091002 L14.0874225 8.67580575 C13.7505651 11.7363278 11.1485964 14.1251276 8.00051039 14.1251276 C4.85140357 14.1251276 2.25045571 11.7373487 1.91257747 8.6768266 L3.91432738 8.68091002 L5.05964273 12.2202129 C5.17805323 12.5877206 5.57207437 12.7888289 5.94057601 12.6704098 C6.13758658 12.6071168 6.29376595 12.4590929 6.37236602 12.2712557 L6.40401021 12.1742745 L8.01582209 5.72757766 Z M8.00051039 1.87589325 C11.2118848 1.87589325 13.8546847 4.36065335 14.1057966 7.50896894 L11.2088225 7.51407321 C10.9536274 7.51509406 10.7219103 7.65393029 10.5994167 7.87137232 L10.5545024 7.96937436 L10.1074007 9.16581595 L8.68647466 3.65626367 C8.62318629 3.408196 8.42821728 3.21525448 8.17914692 3.15298235 C7.83820634 3.06723057 7.49318265 3.24792183 7.36252279 3.5633659 L7.32985782 3.66136795 L5.66802771 10.310194 L4.92081662 7.99897915 C4.83711265 7.74274464 4.61662413 7.56001167 4.35530441 7.52224005 L4.25526795 7.51407321 L1.89522421 7.50998979 C2.14531535 4.36065335 4.7881152 1.87589325 8.00051039 1.87589325 L8.00051039 1.87589325 Z M8.00051039 1 C4.1348159 1 1 4.13402363 1 8.00102085 C1 11.8659764 4.1348159 15 8.00051039 15 C11.8651841 15 15 11.8659764 15 8.00102085 C15 4.13402363 11.8651841 1 8.00051039 1 L8.00051039 1 Z'/></svg>";

var _heartbeatFill = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 -4.26325641e-14 C12.418278 -4.26325641e-14 16 3.581722 16 8 C16 12.418278 12.418278 16 8 16 C3.581722 16 0 12.418278 0 8 C0 3.581722 3.581722 -4.26325641e-14 8 -4.26325641e-14 Z M8 1.14285714 C4.21290457 1.14285714 1.14285714 4.21290457 1.14285714 8 C1.14285714 11.7870954 4.21290457 14.8571429 8 14.8571429 C11.7870954 14.8571429 14.8571429 11.7870954 14.8571429 8 C14.8571429 4.21290457 11.7870954 1.14285714 8 1.14285714 Z M8.01538894 5.77367024 L9.3191083 10.8314485 C9.41363658 11.1981709 9.78755414 11.4188278 10.1542765 11.3242996 C10.3400454 11.2764148 10.4957631 11.1534038 10.5858787 10.9872373 L10.6253051 10.9007058 L11.461759 8.66641094 L13.9637727 8.66151017 C13.6333985 11.6599626 11.0842385 14 8 14 C4.91530401 14 2.36705823 11.6604811 2.03632622 8.66250676 L3.99756704 8.66627243 L5.11870742 12.1329539 C5.23524115 12.4932882 5.62181907 12.6909276 5.98215337 12.5743939 C6.17512784 12.5119851 6.32883654 12.3680784 6.40496213 12.1836797 L6.43638227 12.0882958 L8.01538894 5.77367024 Z M8 2 C11.1457456 2 13.7348584 4.43429992 13.9808775 7.51865095 L11.1433889 7.52409954 C10.8935389 7.52452915 10.6668039 7.66039593 10.546956 7.87350502 L10.5023809 7.96939694 L10.0636584 9.14129096 L8.67267164 3.74495874 C8.60991183 3.50148212 8.41893165 3.31188018 8.17500686 3.25088545 C7.8410092 3.16736751 7.5029519 3.34436945 7.37522415 3.65327298 L7.3434301 3.74977246 L5.7149063 10.2624226 L4.9828348 7.99878212 C4.90162121 7.74766133 4.68494647 7.56836072 4.4292649 7.53120511 L4.33174425 7.52407216 L2.0190366 7.51965608 C2.2644995 4.4348288 4.8530974 2 8 2 Z'/></svg>";

var _helpCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.789 6.858c-.14.278-.366.562-.677.853l-.733.657c-.209.192-.354.39-.435.591a2.55 2.55 0 0 0-.134.541H6.985c0-.367.07-.838.21-1.183.142-.347.368-.647.684-.9.314-.254.554-.486.717-.697.165-.211.247-.444.247-.697 0-.618-.278-.927-.831-.927-.254 0-.46.09-.618.27-.14.159-.217.377-.24.748H5c.034-.893.293-1.498.792-1.93.527-.456 1.267-.684 2.22-.684.95 0 1.684.21 2.206.632.52.422.782 1.02.782 1.8 0 .339-.07.648-.211.926m-2.075 5.861A.98.98 0 0 1 8 13a.98.98 0 0 1-.714-.28A.965.965 0 0 1 7 12c0-.291.095-.532.286-.72A.98.98 0 0 1 8 11a.968.968 0 0 1 1 1 .969.969 0 0 1-.286.72M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7'/></svg>";

var _information = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8,0 C12.418,0 16,3.582 16,8 C16,12.418 12.418,16 8,16 C3.582,16 0,12.418 0,8 C0,3.582 3.582,0 8,0 Z M8.66666667,6 L7.33333333,6 L7.33333333,12.6666667 L8.66666667,12.6666667 L8.66666667,6 Z M8.66666667,3.33333333 L7.33333333,3.33333333 L7.33333333,4.66666667 L8.66666667,4.66666667 L8.66666667,3.33333333 Z' fill='#296CDC'/></svg>";

var _inputFile = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15 4c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V5c0-.005.003-.009.003-.013 0-.005-.003-.008-.003-.013V3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1h9zm-7.3 8.022l.053-.001a1 1 0 0 0 .74-.39l3.237-4.214a1.001 1.001 0 0 0-1.586-1.219L7.62 9.485 6.426 8.23a1 1 0 1 0-1.45 1.378l2 2.103c.19.199.451.311.724.311z'/></svg>";

var _kbdArrowDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 16L13 11.087 8.856 11.087 8.856 0 7.144 0 7.144 11.087 3 11.087z'/></svg>";

var _kbdArrowLeft = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M0 8L4.913 13 4.913 8.856 16 8.856 16 7.144 4.913 7.144 4.913 3z'/></svg>";

var _kbdArrowRight = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M16 8L11.087 13 11.087 8.856 0 8.856 0 7.144 11.087 7.144 11.087 3z'/></svg>";

var _kbdArrowUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 0L3 4.913 7.144 4.913 7.144 16 8.856 16 8.856 4.913 13 4.913z'/></svg>";

var _kbdCapslock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.752 12.605h6.496V16H4.752v-3.395zm.939.967v1.454h4.618v-1.454H5.691zM1.5 6.688L7.996 0 14.5 6.688h-3.252v4.078H4.752V6.688H1.5zm6.496-5.313l-4.313 4.44h2.008v3.977h4.618V5.815h2l-4.313-4.44z'/></svg>";

var _kbdCmd = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.128 6.257a3.02 3.02 0 0 1-1.236-.254A3.168 3.168 0 0 1 .9 5.322c-.28-.286-.5-.618-.66-.996A3.041 3.041 0 0 1 0 3.128c0-.437.082-.844.245-1.223A3.15 3.15 0 0 1 .913.913 3.137 3.137 0 0 1 3.128 0c.426 0 .828.079 1.206.236.379.157.711.376.996.655a3.109 3.109 0 0 1 .927 2.237v2.106h3.486V3.128A3.087 3.087 0 0 1 10.67.891c.285-.28.617-.498.996-.655.378-.157.78-.236 1.206-.236a3.137 3.137 0 0 1 2.215.913c.282.283.505.613.668.992.163.379.245.786.245 1.223 0 .42-.08.819-.24 1.198-.16.378-.38.71-.66.996-.28.285-.61.512-.992.681a3.02 3.02 0 0 1-1.236.254h-2.106v3.486h2.106c.442 0 .855.085 1.236.254.382.169.712.396.992.681.28.286.5.618.66.996.16.38.24.778.24 1.198 0 .437-.082.844-.245 1.223a3.15 3.15 0 0 1-.668.992 3.137 3.137 0 0 1-2.215.913c-.426 0-.828-.079-1.206-.236a3.118 3.118 0 0 1-.996-.655 3.109 3.109 0 0 1-.927-2.237v-2.106H6.257v2.106a3.087 3.087 0 0 1-.927 2.237c-.285.28-.617.498-.996.655-.378.157-.78.236-1.206.236a3.137 3.137 0 0 1-2.215-.913 3.15 3.15 0 0 1-.668-.992A3.059 3.059 0 0 1 0 12.872c0-.42.08-.819.24-1.198.16-.378.38-.71.66-.996.28-.285.61-.512.992-.681a3.02 3.02 0 0 1 1.236-.254h2.106V6.257H3.128zm2.106-1.023V3.128a2.097 2.097 0 0 0-.607-1.49c-.19-.189-.412-.339-.669-.45a2.071 2.071 0 0 0-.83-.166c-.29 0-.562.056-.812.166-.25.111-.47.261-.66.45a2.097 2.097 0 0 0-.607 1.49c0 .297.053.574.161.83a2.068 2.068 0 0 0 1.918 1.276h2.106zm-2.106 5.532c-.29 0-.562.054-.812.161a2.068 2.068 0 0 0-1.105 1.114 2.12 2.12 0 0 0-.162.83 2.097 2.097 0 0 0 1.267 1.94c.25.111.521.167.812.167.297 0 .574-.056.83-.166a2.068 2.068 0 0 0 1.114-1.119c.108-.256.162-.53.162-.821v-2.106H3.128zm9.744-5.532a2.08 2.08 0 0 0 1.472-.607c.19-.19.338-.412.446-.669a2.12 2.12 0 0 0 .161-.83 2.097 2.097 0 0 0-1.271-1.94 1.997 1.997 0 0 0-.808-.166c-.297 0-.574.056-.83.166a2.068 2.068 0 0 0-1.114 1.119c-.108.256-.162.53-.162.821v2.106h2.106zm-2.106 5.532v2.106a2.097 2.097 0 0 0 .607 1.49c.19.189.412.339.669.45.256.11.533.166.83.166.285 0 .555-.056.808-.166.253-.111.475-.261.664-.45a2.097 2.097 0 0 0 .607-1.49 2.12 2.12 0 0 0-.161-.83 2.068 2.068 0 0 0-1.918-1.276h-2.106zm-1.023-4.51H6.257v3.487h3.486V6.257z'/></svg>";

var _kbdDelete = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.595 14L0 8.25 5.595 2.5H16V14H5.595zM1.58 8.25l4.484 4.6h8.817v-9.2H6.064L1.58 8.25zm7.773.808L6.851 11.63l-.787-.816L8.56 8.25 6.064 5.678l.787-.808 2.502 2.564L11.85 4.87l.794.808-2.496 2.572 2.496 2.564-.794.816-2.496-2.572z'/></svg>";

var _kbdEject = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M0 15v-3h16v3H0zm0-6l7.995-8L16 9H0z'/></svg>";

var _kbdOption = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M0 1h5.562l6.135 12.364H16V15h-5.562L4.294 2.627H0V1zm9.499 0H16v1.627H9.499V1z'/></svg>";

var _kbdReturn = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M16 8.35c0 .692-.25 1.3-.749 1.825-.499.525-1.103.788-1.813.788H7.419V13.5L0 9.963l7.419-3.567v2.537h5.155c.347 0 .645-.11.893-.329.249-.218.373-.502.373-.85V2.5H16v5.85z'/></svg>";

var _kbdShift = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M0 8.489L7.995 0 16 8.489h-4.002V16H4.002V8.489H0zm7.995-6.743L2.687 7.382h2.471v7.391h5.684V7.382h2.462L7.995 1.746z'/></svg>";

var _kbdSpace = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M16 11L16 16 0 16 0 11 1.167 11 1.167 13.904 14.833 13.904 14.833 11z'/></svg>";

var _kbdTab = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M16 12h-1.39V4H16v8zm-2.781-4L9.16 12V8.685H0v-1.37h9.16V4l4.059 4z'/></svg>";

var _key = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10 11.414l-1.793 1.793a1 1 0 1 1-1.414-1.414L8.586 10 7.032 8.446a4 4 0 1 1 1.414-1.414l6.261 6.26a1 1 0 0 1-1.414 1.415l-1.043-1.043-1.043 1.043a1 1 0 1 1-1.414-1.414l1.043-1.043-.836-.836zM5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'/></svg>";

var _list = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1 14 C1 14.553 1.448 15 2 15 L14 15 C14.552 15 15 14.553 15 14 C15 13.448 14.552 13 14 13 L2 13 C1.448 13 1 13.448 1 14 M1 10 C1 10.553 1.448 11 2 11 L14 11 C14.552 11 15 10.553 15 10 C15 9.448 14.552 9 14 9 L2 9 C1.448 9 1 9.448 1 10 M1 6 C1 6.553 1.448 7 2 7 L14 7 C14.552 7 15 6.553 15 6 C15 5.448 14.552 5 14 5 L2 5 C1.448 5 1 5.448 1 6 M2 1 L14 1 C14.552 1 15 1.448 15 2 C15 2.553 14.552 3 14 3 L2 3 C1.448 3 1 2.553 1 2 C1 1.448 1.448 1 2 1'/></svg>";

var _lock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12 7h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2V5a4 4 0 1 1 8 0v2zm-2 0V5a2 2 0 1 0-4 0v2h4z'/></svg>";

var _mimeArchive = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13 0a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h4v2h2V0h4zM8 14.5c1.16 0 1.75-.314 1.75-1.833 0-.651-.268-1.398-.75-2.223V9H7v1.444c-.482.825-.75 1.572-.75 2.223 0 1.519.59 1.833 1.75 1.833zm0-2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM7 8h2V6H7v2zm0-3h2V3H7v2z'/></svg>";

var _mimeAudio = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.142 4.22A1.01 1.01 0 0 1 5 3.75c.553 0 1 .434 1 .97v6.562c0 .34-.185.654-.485.83a1.019 1.019 0 0 1-1.373-.333L3 9.936h-.02C1.885 9.931 1 9.07 1 8.01V8c0-1.057.877-1.92 1.971-1.935H3L4.142 4.22zm4.298 8.678a1 1 0 1 1-.88-1.796C8.515 10.635 9 9.662 9 8s-.486-2.635-1.44-3.102a1 1 0 1 1 .88-1.796C10.153 3.94 11 5.634 11 8c0 2.366-.847 4.06-2.56 4.898zm3.12 1.93a1 1 0 1 1-1.12-1.656C12.156 12.009 13 10.322 13 8c0-2.323-.843-4.01-2.56-5.172a1 1 0 0 1 1.12-1.656C13.844 2.717 15 5.03 15 8c0 2.97-1.157 5.283-3.44 6.828z'/></svg>";

var _mimeCode = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.78 10.577a1.124 1.124 0 0 1-.138 1.536 1.016 1.016 0 0 1-1.472-.145L0 7.975l3.174-3.948a1.016 1.016 0 0 1 1.473-.135c.443.387.5 1.075.13 1.536L2.721 7.984l2.059 2.593zm6.44 0l2.058-2.593-2.054-2.556a1.124 1.124 0 0 1 .129-1.536 1.016 1.016 0 0 1 1.473.135L16 7.975l-3.17 3.993a1.016 1.016 0 0 1-1.472.145 1.124 1.124 0 0 1-.139-1.536zM7.58 13.254c-.182.571-.775.88-1.322.69-.548-.19-.844-.809-.662-1.38l3.137-9.818c.183-.571.775-.88 1.323-.69.548.19.844.809.661 1.38l-3.137 9.818z'/></svg>";

var _mimeData = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1 1h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm10 4h4V3h-4v2zM6 5h4.001V3H6v2zM1 5h4V3H1v2zm10 3.001h4V6h-4v2.001zm-5 0h4.001V6H6v2.001zm-5 0h4V6H1v2.001zM11 11h4V9h-4v2zm-5 0h4.001V9H6v2zm-5 0h4V9H1v2zm10 3h4v-2h-4v2zm-5 0h4.001v-2H6v2zm-5 0h4v-2H1v2z'/></svg>";

var _mimeImage = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.484 6.985a3.017 3.017 0 0 1-3.498-2.974A3.017 3.017 0 0 1 11.01 1a3.017 3.017 0 0 1 3.022 3.011 3.015 3.015 0 0 1-2.306 2.926L15 10.235v3.761c0 .555-.451 1.004-1.008 1.004H2.008C1.45 15 1 14.55 1 13.996v-3.761L4.933 5.47 8 8.346l3.484-1.36zM5.12 8.403l-2.106 2.551v2.039h9.97V11.06l-1.793-1.805-3.644 1.424L5.12 8.403zm5.888-3.388c.556 0 1.007-.45 1.007-1.004s-.45-1.004-1.007-1.004c-.557 0-1.008.45-1.008 1.004s.451 1.004 1.008 1.004z'/></svg>";

var _mimeSystem = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6.284 6.594a2.73 2.73 0 0 1-.305.225l.183.963-.566.229-.539-.819a2.736 2.736 0 0 1-1.145-.01l-.552.811-.562-.237.198-.961c-.33-.217-.6-.496-.804-.816l-.963.183L1 5.596l.818-.54a2.735 2.735 0 0 1 .01-1.145l-.81-.552.236-.561.961.198c.217-.33.496-.6.816-.804l-.183-.963L3.414 1l.54.818a2.736 2.736 0 0 1 1.145.01l.552-.81.562.236-.198.961c.329.217.6.496.804.816l.963-.183.229.566-.819.538c.077.372.076.762-.01 1.147l.811.552-.237.562-.806-.166 1.023.715a3.74 3.74 0 0 1 1.134-.471l.238-1.285h1.247l.243 1.284c.406.096.789.256 1.133.472l1.088-.766.881.883-.757 1.094c.217.347.378.732.473 1.142L15 9.344v1.247l-1.347.235c-.094.41-.256.794-.472 1.141l.757 1.088-.88.882-1.089-.758a3.773 3.773 0 0 1-1.142.474l-.235 1.346H9.345l-.229-1.346a3.776 3.776 0 0 1-1.142-.473l-1.093.758-.884-.882.766-1.088a3.74 3.74 0 0 1-.471-1.133l-1.286-.244V9.344l1.285-.237c.095-.406.256-.789.47-1.134L5.998 6.88l.287-.286zm.307-.307l.26-.26-.056-.012a2.747 2.747 0 0 1-.204.272zm3.415 5.598a1.881 1.881 0 1 0 0-3.763 1.881 1.881 0 0 0 0 3.763zM5.888 5.091a1.501 1.501 0 1 0-2.764-1.172A1.501 1.501 0 0 0 5.888 5.09z'/></svg>";

var _mimeText = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 1h12.023a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h12.023a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2zm0 4h12.023a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h5a1 1 0 1 1 0 2H2a1 1 0 0 1 0-2z'/></svg>";

var _mimeVideo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 3.746c0-.393.118-.778.338-1.106a2.035 2.035 0 0 1 2.802-.556l6.459 4.247a1.981 1.981 0 0 1 .003 3.321l-6.46 4.262c-.332.219-.722.336-1.122.336-1.115 0-2.02-.894-2.02-1.996V3.746zm2.02 0v8.508l6.46-4.262-6.46-4.246z'/></svg>";

var _minus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 9a1 1 0 1 1 0-2h10a1 1 0 0 1 0 2H3z'/></svg>";

var _minusCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.859 0 7 3.141 7 7 0 3.86-3.141 7-7 7s-7-3.14-7-7c0-3.859 3.141-7 7-7zm4 8a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2h8z'/></svg>";

var _ok = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8,0 C12.418,0 16,3.582 16,8 C16,12.418 12.418,16 8,16 C3.582,16 0,12.418 0,8 C0,3.582 3.582,0 8,0 Z M11.2998316,4.97631073 L6.58578644,9.69035594 L4.70016835,7.80473785 L3.75735931,8.7475469 L6.58578644,11.575974 L7.52859548,10.633165 L12.2426407,5.91911977 L11.2998316,4.97631073 Z' fill='#008B38'/></svg>";

var _paperclip = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.977 13.037A3.244 3.244 0 0 1 1 10.71c0-.878.347-1.705.977-2.326l5.12-5.05A4.61 4.61 0 0 1 10.356 2c1.231 0 2.39.473 3.26 1.333C14.52 4.223 15 5.366 15 6.581c0 1.215-.48 2.358-1.351 3.218L9.816 13.58a.754.754 0 0 1-1.03 0 .714.714 0 0 1 0-1.016l3.833-3.782c.597-.588.925-1.37.925-2.202a3.07 3.07 0 0 0-.925-2.2 3.18 3.18 0 0 0-2.262-.944c-.843 0-1.635.324-2.23.912L3.006 9.4c-.356.35-.55.815-.55 1.31 0 .496.194.961.55 1.312.709.7 1.947.7 2.656 0l5.054-4.986a.562.562 0 0 0 0-.807.577.577 0 0 0-.4-.162.56.56 0 0 0-.399.167l-4.817 4.892a.736.736 0 0 1-1.03.014.704.704 0 0 1-.22-.505.707.707 0 0 1 .205-.51l4.819-4.892a2.02 2.02 0 0 1 1.416-.603c.545.01 1.048.192 1.435.563.396.39.615.904.615 1.445 0 .535-.212 1.036-.595 1.414l-5.053 4.985A3.347 3.347 0 0 1 4.335 14c-.854 0-1.708-.32-2.358-.963z'/></svg>";

var _payment = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5 15A5 5 0 1 1 5 5a5 5 0 0 1 0 10zm.496-3.433c-.101.093-.24.139-.418.139-.242 0-.43-.068-.561-.203-.132-.136-.2-.333-.2-.593H3c0 .472.152.851.456 1.14.304.287.741.459 1.309.51v.69h.622v-.686c.488-.04.873-.185 1.157-.43.282-.247.423-.564.423-.954 0-.23-.043-.427-.132-.59a1.393 1.393 0 0 0-.367-.43 2.631 2.631 0 0 0-.559-.33c-.215-.098-.443-.19-.687-.281-.242-.09-.418-.184-.528-.285a.508.508 0 0 1-.165-.4c0-.166.048-.297.145-.392.095-.094.228-.141.4-.141.193 0 .342.064.446.191.105.127.157.31.157.547H7c0-.433-.138-.79-.41-1.071-.273-.281-.647-.453-1.124-.513V6.75h-.624v.72c-.495.041-.892.186-1.188.435a1.192 1.192 0 0 0-.447.952c0 .23.043.426.126.588.083.161.203.304.359.427.157.122.344.23.561.324.215.094.452.186.707.277.256.091.435.189.536.29.103.103.153.244.153.424 0 .161-.05.289-.153.38zm6.772-3.939a.5.5 0 0 1-.286-.089L10.5 6.524v-2.99c0-.294.232-.534.518-.534.285 0 .517.24.517.535v2.413l1.02.698a.546.546 0 0 1 .144.742.512.512 0 0 1-.43.24zM7.308 4.46a5.954 5.954 0 0 0-.956-.307A5.002 5.002 0 0 1 16 6a5 5 0 0 1-5.083 5A6.04 6.04 0 0 0 11 10a4 4 0 1 0-3.693-5.54z'/></svg>";

var _pencil = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.423 10.716L9.567 3.56l2.802 2.807-7.145 7.158-2.801-2.808zm-1.415 3.895l.708-3.186 2.8 2.807-3.122.759a.32.32 0 0 1-.386-.38zm13.85-11.355a.489.489 0 0 1-.004.693l-.776.765.007.007-.953.924-2.802-2.807.34-.33c.004-.003.005-.01.01-.015l1.373-1.351a.498.498 0 0 1 .7.003l2.104 2.11z'/></svg>";

var _pending = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8,0 C12.418,0 16,3.582 16,8 C16,12.418 12.418,16 8,16 C3.582,16 0,12.418 0,8 C0,3.582 3.582,0 8,0 Z M10.6666667,4 L9.33333333,4 L9.333,9.333 L4,9.33333333 L4,10.6666667 L10.6666667,10.6666667 L10.6666667,4 Z' fill='#9E9E9E'/></svg>";

var _phone = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.177 10.059h-3.294a.823.823 0 0 0-.824.824v.823c-3.294 0-5.713-2.522-5.765-5.764h.823a.824.824 0 0 0 .825-.824V1.824A.824.824 0 0 0 5.117 1H1.823A.824.824 0 0 0 1 1.824v4.118A9.058 9.058 0 0 0 10.059 15h4.118a.822.822 0 0 0 .823-.823v-3.294a.823.823 0 0 0-.823-.824'/></svg>";

var _plus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 7H9V2a1 1 0 1 0-2 0v5H2a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0V9h5a1 1 0 1 0 0-2'/></svg>";

var _plusOrMinus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4 15a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H4zM7 5V2a1 1 0 1 1 2 0v3h3a1 1 0 0 1 0 2H9v3a1 1 0 0 1-2 0V7H4a1 1 0 1 1 0-2h3z'/></svg>";

var _redo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.585 6a5 5 0 1 0-1.098 5.583 1 1 0 0 1 1.395 1.434A7 7 0 1 1 14 4.39V2a1 1 0 0 1 2 0v6h-6a1 1 0 1 1 0-2h2.585z'/></svg>";

var _search = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6.494 10a3.502 3.502 0 0 1-3.496-3.5c0-1.93 1.568-3.5 3.496-3.5A3.502 3.502 0 0 1 9.99 6.5c0 1.93-1.568 3.5-3.496 3.5m8.213 3.292l-3.683-3.683a5.475 5.475 0 0 0 .963-3.109c0-3.038-2.459-5.5-5.493-5.5A5.497 5.497 0 0 0 1 6.5C1 9.538 3.46 12 6.494 12a5.456 5.456 0 0 0 3.118-.975l3.683 3.683a.998.998 0 0 0 1.412-.001 1 1 0 0 0 0-1.415'/></svg>";

var _server = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.5 11h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm0-5h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm0-5h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zM11 13.032c.022.534.493.98 1.02.968.533-.012.983-.474.98-1.007a1.016 1.016 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 13.032zm0-5c.022.534.493.98 1.02.968.533-.012.983-.474.98-1.007a1.016 1.016 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 8.032zm0-5c.022.534.492.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 14h6v-2H3v2zm0-5h6V7H3v2zm0-5h6V2H3v2z'/></svg>";

var _shieldLock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.69101596 0.0455212915 C7.88595914 -0.0153993643 8.09488196 -0.0151677534 8.2896896 0.0461849783 L8.2896896 0.0461849783 L15.2236905 2.22997978 C15.6472522 2.36337635 15.9321058 2.7601179 15.9230896 3.20409755 C15.7831866 10.0937501 13.1389757 14.3430325 7.99045688 15.9519446 C2.84355914 14.343515 0.180188185 10.0962988 0.000344012718 3.21029587 C-0.0113275869 2.76340528 0.275028473 2.3630559 0.701720379 2.22970881 L0.701720379 2.22970881 Z M7.95958588 2.28527794 C6.69722074 2.28527794 5.6738716 3.30862708 5.6738716 4.57099222 L5.6738716 4.57099222 L5.6738716 5.71384937 L4.53101445 5.71384937 C4.21542317 5.71384937 3.95958588 5.96968665 3.95958588 6.28527794 L3.95958588 6.28527794 L3.95958588 10.7138494 C3.95958588 11.0294407 4.21542317 11.2852779 4.53101445 11.2852779 L4.53101445 11.2852779 L11.3881573 11.2852779 C11.7037486 11.2852779 11.9595859 11.0294407 11.9595859 10.7138494 L11.9595859 10.7138494 L11.9595859 6.28527794 C11.9595859 5.96968665 11.7037486 5.71384937 11.3881573 5.71384937 L11.3881573 5.71384937 L10.2453002 5.71384937 L10.2453002 4.57099222 C10.2453002 3.30862708 9.22195102 2.28527794 7.95958588 2.28527794 Z M7.95958588 7.28527794 C8.51187063 7.28527794 8.95958588 7.73299319 8.95958588 8.28527794 C8.95958588 8.65495897 8.75898626 8.97778744 8.46070018 9.15085019 L8.46070018 9.15085019 L8.45958588 10.2852779 L7.45958588 10.2852779 L7.45945638 9.15142081 L7.36361004 9.08835811 C7.11843327 8.90611086 6.95958588 8.6142448 6.95958588 8.28527794 C6.95958588 7.73299319 7.40730113 7.28527794 7.95958588 7.28527794 Z M7.95958588 3.42813508 C8.59076845 3.42813508 9.10244302 3.93980965 9.10244302 4.57099222 L9.10244302 4.57099222 L9.10244302 5.71384937 L6.81672874 5.71384937 L6.81672874 4.57099222 C6.81672874 3.93980965 7.32840331 3.42813508 7.95958588 3.42813508 Z'/></svg>";

var _serverConfig = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.646 9c-.269.3-.497.636-.678 1H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545h13c.276 0 .5.246.5.546v2.1A4.483 4.483 0 0 0 12 7.5a4.483 4.483 0 0 0-3 1.146V7H3v2h5.646zm-.678 5c.18.364.41.7.678 1H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545h6.112a4.515 4.515 0 0 0-.112 1H3v2h4.968zM1.5 1h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm12.854 10.354l.553.09a.114.114 0 0 1 .093.108v.734a.103.103 0 0 1-.093.101l-.508.04a2.427 2.427 0 0 1-.296.794l.288.387a.113.113 0 0 1-.01.142l-.572.571a.112.112 0 0 1-.141.01l-.37-.28c-.23.145-.486.253-.76.314l-.07.542a.11.11 0 0 1-.105.093h-.755a.103.103 0 0 1-.1-.093l-.04-.542a2.427 2.427 0 0 1-.776-.324l-.393.29a.113.113 0 0 1-.141-.01l-.572-.571a.108.108 0 0 1-.007-.14l.318-.398a2.408 2.408 0 0 1-.278-.716l-.526-.063A.11.11 0 0 1 9 12.328v-.808c0-.051.042-.097.093-.1l.553-.044c.063-.245.163-.475.295-.684l-.362-.454a.109.109 0 0 1 .007-.14l.572-.57a.11.11 0 0 1 .14-.01l.477.367c.203-.118.424-.208.66-.265l.043-.527A.104.104 0 0 1 11.58 9h.807c.052 0 .097.042.1.094l.037.514c.247.054.48.146.692.268l.453-.357a.109.109 0 0 1 .14.008l.572.571a.106.106 0 0 1 .006.139l-.346.416c.14.213.245.45.313.701zm-3.289.634a.939.939 0 0 0 1.875 0 .939.939 0 0 0-.937-.937.939.939 0 0 0-.938.937zm-.064-8.956c.02.534.491.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 4h6V2H3v2z'/></svg>";

var _serverIncident = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.5 14l-.415.829a1.5 1.5 0 0 0-.073.171H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545H9l-.5 1H3v2h4.5zm7-4L13.34 7.683a1.5 1.5 0 0 0-2.683 0L9.499 10h-8c-.274 0-.5-.245-.5-.545v-2.91c0-.3.226-.545.5-.545h13c.277 0 .5.246.5.546v2.909c0 .3-.223.545-.5.545zm-13-9h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm13.428 13.272c.187.377-.007.727-.404.727-.842.002-1.683 0-2.524 0-.845 0-1.69.002-2.535 0-.26 0-.452-.166-.464-.421a.598.598 0 0 1 .062-.285c.846-1.676 1.696-3.35 2.545-5.024.086-.169.215-.272.397-.269.186.003.308.117.396.289.72 1.422 1.441 2.842 2.162 4.263.122.24.245.479.365.72zm-2.714.085a.215.215 0 0 0 .215-.214v-.429a.215.215 0 0 0-.215-.214h-.428a.215.215 0 0 0-.215.214v.429c0 .118.096.214.215.214h.428zm.028-1.285c.115 0 .223-.107.217-.215l.075-2.143c.014-.128-.086-.214-.202-.214h-.664a.206.206 0 0 0-.204.214l.064 2.143a.22.22 0 0 0 .216.215h.498zm-1.241-10.04c.02.534.491.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 9h6V7H3v2zm0-5h6V2H3v2z'/></svg>";

var _sort = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 12.174v-8.35L5.487 5.306a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415L8.003 0l3.948 3.887a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 3.82v8.36l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 12.174z'/></svg>";

var _sortDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 12.174V1a1 1 0 1 1 2 0v11.179l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 12.174z'/></svg>";

var _sortUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 3.824L5.487 5.306a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415L8.003 0l3.948 3.887a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 3.82v11.179a1 1 0 1 1-2 0V3.824z'/></svg>";

var _support = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.55300697,0 L8.95955126,0.0531636621 C9.22536868,0.0893601979 9.48336794,0.124425592 9.74248407,0.18776953 C12.6597744,0.906044539 14.5271976,2.62198657 15.2944941,5.29034995 C15.36039,5.51431601 15.3983639,5.73941322 15.4341041,5.95546129 L15.4341041,5.95546129 L15.4569381,6.09894872 C15.4688515,6.17251483 15.4802685,6.23786968 15.4921818,6.30272181 L15.4921818,6.30272181 L15.5,9.80473666 L15.4463898,10.1293743 C15.4128834,10.3227996 15.3771432,10.5411099 15.3179486,10.7582891 C14.6891452,13.0431955 13.1400328,14.6528102 10.7119358,15.5441499 C9.88879534,15.8461647 8.99194078,16 8.04817725,16 C7.38028307,15.9988689 6.94693366,15.5984447 6.9446999,14.9819724 L6.9446999,14.9819724 L6.94581678,14.8100389 C5.32857468,14.5102863 3.90902031,13.5329799 3.03226959,12.1156592 C1.71881881,11.7966773 0.723678816,10.7775186 0.549445551,9.56945917 C0.513705394,9.32060799 0.511471634,9.0796748 0.509237874,8.8466596 L0.509237874,8.8466596 L0.504770354,8.3319901 C0.499185955,7.7494521 0.495835315,7.26419229 0.510354754,6.76762107 C0.584068828,4.3786497 1.72105257,2.48172499 3.88668272,1.12887946 C4.88517335,0.506751502 6.02997526,0.136868151 7.29204956,0.0305408271 L7.29204956,0.0305408271 L7.40597131,0.00452456698 L8.55300697,0 Z M8.47482538,0.906044539 L7.52547746,0.910569106 C7.46851658,0.92640509 7.4227245,0.934323082 7.37358179,0.938847649 C6.27122132,1.03047013 5.27049692,1.35284553 4.40156435,1.89466242 C2.51180355,3.07444327 1.52001419,4.72251679 1.45523516,6.79589961 C1.4418326,7.28002828 1.44518324,7.77659951 1.44965076,8.25846589 L1.44965076,8.25846589 L1.4530014,8.79915164 C1.45411828,9.01633086 1.45523516,9.24142807 1.48650779,9.44164016 C1.59372826,10.2028986 2.15998638,10.8589608 2.96302303,11.1575822 C3.13949006,11.2220573 3.33494404,11.2673029 3.5594369,11.2933192 L3.5594369,11.2933192 L3.61416402,11.2989749 C3.70463129,11.3091552 3.77387785,11.3182043 3.84535816,11.3182043 L3.84535816,11.3182043 L3.92577351,11.315942 C4.01512391,11.3136797 4.01512391,11.2865323 4.01512391,11.2673029 C4.01959143,9.80926122 4.01847455,8.35121951 4.01512391,6.89204666 C4.01512391,6.86716154 4.00730575,6.85358784 4.00507199,6.85132556 C4.00395511,6.85019441 3.99278631,6.84453871 3.95816303,6.84453871 C3.80515048,6.8524567 3.6208653,6.87281725 3.43993075,6.90109579 L3.43993075,6.90109579 L3.38520364,6.91127607 C3.31372332,6.92258749 3.24782741,6.93276776 3.18193149,6.95086603 C3.10486678,6.97235772 3.02221767,7.00742312 2.93286727,7.0447508 L2.93286727,7.0447508 L2.8479844,7.08207847 C2.81894552,7.09452103 2.79102353,7.10470131 2.76421841,7.11488158 L2.76421841,7.11488158 L2.73629641,7.12506186 C2.69720561,7.1397667 2.65699794,7.1533404 2.61679026,7.17143867 C2.50398539,7.22120891 2.41686876,7.25966773 2.32863524,7.2969954 L2.32863524,7.2969954 L1.64845538,7.57638742 L1.6696761,6.86489926 C1.73445513,4.652386 2.76533529,2.99073878 4.73216081,1.92746554 C7.00277766,0.700176741 9.37503058,0.76465182 11.5898034,2.11184164 C13.5912522,3.32781902 14.3954058,5.39893955 14.3049385,6.91240721 L14.3049385,6.91240721 L14.281484,7.30378226 L13.7074077,7.36486391 L13.444941,7.20537292 C13.3924476,7.1748321 13.3354867,7.15447154 13.2762921,7.13184871 C13.2327338,7.11601273 13.1925261,7.10017674 13.1512016,7.08320961 C12.95128,6.9961117 12.7535923,6.93503005 12.5570214,6.90109579 L12.5570214,6.90109579 L12.4565023,6.88299753 C12.3425805,6.86150583 12.2387107,6.84114528 12.1370746,6.84114528 C12.0253866,6.84680099 11.9963477,6.86150583 11.9929971,6.86263697 L11.9929971,6.86263697 C11.9974646,6.86263697 11.9885296,6.89204666 11.9885296,6.94860375 L11.9885296,6.94860375 L11.9885296,9.77532697 C11.9874127,10.2651113 11.9874127,10.7537646 11.9896464,11.2412867 C11.9896464,11.300106 11.9896464,11.3148109 12.0901656,11.3148109 C12.1661135,11.3148109 12.2655158,11.3125486 12.3582168,11.2989749 L12.3582168,11.2989749 L12.4285803,11.2865323 C12.5882941,11.2571227 12.7457741,11.2254507 12.9099555,11.1903853 L12.9099555,11.1903853 L14.1441078,10.9370095 L13.6716676,11.7978084 C13.0037734,13.0183104 11.975127,13.8858961 10.5298844,14.4525981 L10.5298844,14.4525981 L9.9412887,14.683351 L9.87204214,13.9763874 C9.86980838,13.9017321 9.85640582,13.8779781 9.84858767,13.8644044 C9.84858767,13.8632732 9.82401631,13.8463061 9.72684776,13.8463061 L9.72684776,13.8463061 L8.80765559,13.845175 L8.00796958,13.8463061 C7.89181407,13.8463061 7.89181407,13.8576175 7.89181407,13.9390597 L7.89181407,13.9390597 L7.89069719,14.0815836 L7.89181407,14.1528455 C7.89069719,14.3270414 7.89069719,14.4989749 7.89181407,14.6709084 L7.89181407,14.6709084 L7.89069719,14.7761046 L7.89181407,14.978579 C7.89181407,15.0487098 7.90745039,15.0679392 7.90745039,15.0679392 C7.91303478,15.0735949 7.94095678,15.0860375 8.04817725,15.0894309 C8.87690215,15.0894309 9.66095184,14.954825 10.3746381,14.6924001 C12.5022943,13.9119123 13.8581865,12.5092966 14.4043408,10.5230117 C14.449016,10.3601273 14.476938,10.1927183 14.5082106,10.015129 L14.5082106,10.015129 L14.5562365,9.73799929 L14.5551196,6.39886886 C14.5428339,6.3513609 14.5271976,6.26539413 14.5082106,6.14775539 C14.4713536,5.91247791 14.4378472,5.71792153 14.384237,5.53467656 C13.7129921,3.20339343 12.0734124,1.70123719 9.50905617,1.07232238 C9.29684899,1.01915871 9.07347301,0.988617886 8.83669447,0.956945917 L8.83669447,0.956945917 L8.78866863,0.950159067 C8.6847988,0.936585366 8.58092897,0.920749381 8.47482538,0.906044539 L8.47482538,0.906044539 Z M8.00015142,3.99293036 C6.49124666,3.99293036 5.0549391,4.71799222 4.1212275,5.94301873 C4.31221396,5.97016614 4.49649915,6.05160834 4.63834289,6.17490279 C4.8438488,6.35362319 4.95888743,6.60813008 4.96112119,6.88865323 C4.96447183,8.35121951 4.96447183,9.81039236 4.96112119,11.2706964 C4.95888743,11.7050548 4.67966745,12.050053 4.24743493,12.1710852 C4.94325111,13.0081301 5.89594967,13.5906681 6.95363494,13.8236833 C7.01506334,13.2807352 7.4227245,12.9368682 8.0068527,12.9346059 C8.57981209,12.9334747 9.15612212,12.9312124 9.72796464,12.9346059 C10.1490284,12.935737 10.4718067,13.095228 10.6583256,13.3972428 C11.3016484,13.0850477 11.8232313,12.6970661 12.2442951,12.2185931 C12.226425,12.2185931 12.207438,12.2185931 12.1906848,12.2197243 L12.1906848,12.2197243 L12.1605291,12.2219866 C12.1370746,12.2242489 12.1136201,12.22538 12.0890488,12.22538 C11.4747648,12.2242489 11.0458829,11.8204312 11.044766,11.243549 C11.0425323,10.7548957 11.0425323,10.2651113 11.0436492,9.77532697 L11.0436492,9.77532697 L11.0436492,6.94860375 C11.0436492,6.63527748 11.1452852,6.38190173 11.3496743,6.19639449 C11.4904011,6.06744433 11.65905,5.99165783 11.8857766,5.95659244 C10.9531819,4.72364793 9.51352369,3.99293036 8.00015142,3.99293036 Z M6.44657147,7.99943443 C6.8062068,7.99943443 7.09994621,8.29579357 7.09994621,8.66115235 C7.09994621,9.02651113 6.8062068,9.32287027 6.44657147,9.32287027 C6.08581925,9.32287027 5.79319672,9.02651113 5.79319672,8.66115235 C5.79319672,8.29579357 6.08581925,7.99943443 6.44657147,7.99943443 Z M9.56166122,7.99943443 C9.92241343,7.99943443 10.215036,8.29579357 10.215036,8.66115235 C10.215036,9.02651113 9.92241343,9.32287027 9.56166122,9.32287027 C9.20090901,9.32287027 8.90828647,9.02651113 8.90828647,8.66115235 C8.90828647,8.29579357 9.20090901,7.99943443 9.56166122,7.99943443 Z M8.08838493,1.96366207 L8.05152789,1.96366207 C7.93872302,1.96366207 7.82480127,1.97158006 7.71311328,1.97836691 L7.71311328,1.97836691 L7.56345137,1.98854719 C7.49867234,1.99080947 7.43501018,1.9942029 7.37134803,2.00212089 C7.23843932,2.01795688 7.09994621,2.04736656 6.9670375,2.0756451 L6.9670375,2.0756451 L6.91901167,2.08582538 C6.88550527,2.09261223 6.85088199,2.09939908 6.81625871,2.10618593 C6.75929784,2.11636621 6.70457072,2.12654648 6.64760985,2.14125133 C6.47672722,2.18536585 6.30249396,2.24984093 6.14613077,2.30639802 C6.11485813,2.3165783 6.08470238,2.32562743 6.05454662,2.33580771 C6.0109883,2.34938141 5.9663131,2.36408625 5.92163791,2.38105338 C5.67927497,2.47833157 5.43356139,2.59370802 5.19343221,2.72265818 C3.76382593,3.49635914 2.9205816,4.65012372 2.6815693,6.15227996 C2.74858209,6.12739484 2.81336112,6.10590315 2.87702328,6.08780488 C2.92169848,6.01088724 2.96972431,5.93736303 3.01775015,5.86383881 L3.01775015,5.86383881 L3.09034734,5.75298692 C3.11268494,5.71792153 3.13390566,5.68398727 3.15512638,5.64892188 C3.19198341,5.58784023 3.22884045,5.52675857 3.27016501,5.46907034 C3.3371778,5.37631672 3.409775,5.29148109 3.48460595,5.20551432 L3.48460595,5.20551432 L3.55496938,5.12294097 C3.5817745,5.09240014 3.60634586,5.06072817 3.6320341,5.0290562 C3.67894305,4.96910569 3.72696889,4.91028632 3.77946224,4.85486037 C3.8542932,4.77681159 3.93470855,4.70554966 4.01624079,4.63428773 L4.01624079,4.63428773 L4.10000678,4.55963238 C4.13016254,4.53135384 4.15920141,4.50307529 4.18935717,4.47479675 C4.24408429,4.42163309 4.2988114,4.37073171 4.35912292,4.32209261 C4.44065515,4.25535525 4.5266549,4.19766702 4.61488842,4.13884765 L4.61488842,4.13884765 L4.71317385,4.07211029 C4.74891401,4.04722517 4.7824204,4.02234005 4.81704368,3.99858607 C4.87735519,3.95447154 4.93654983,3.91148816 4.99797822,3.87416048 C5.09179614,3.81760339 5.18896469,3.77009544 5.28613324,3.72258749 L5.28613324,3.72258749 L5.39447059,3.66829268 C5.42797699,3.65132556 5.46260027,3.63322729 5.49610666,3.61512902 C5.5608857,3.57893248 5.62566473,3.54499823 5.69267753,3.51558855 C5.799898,3.46921174 5.91158599,3.43188406 6.0221571,3.39455638 L6.0221571,3.39455638 L6.12826069,3.35949099 C6.16623461,3.34704843 6.20197477,3.33347473 6.2388318,3.31876988 C6.30249396,3.29501591 6.36392235,3.27126193 6.42870139,3.25316366 C6.57612953,3.21131142 6.7280252,3.18416402 6.87433647,3.15701661 L6.87433647,3.15701661 L6.94916742,3.14344291 C6.98155694,3.13665606 7.01282958,3.12986921 7.04410222,3.12308236 C7.09659557,3.1106398 7.14908893,3.09819724 7.20269916,3.09141039 C7.72651584,3.01788618 8.27267011,3.01788618 8.79648679,3.09141039 C8.84674639,3.09819724 8.8958891,3.10950866 8.9461487,3.12195122 C8.97742134,3.12873807 9.00757709,3.13552492 9.03884973,3.14231177 L9.03884973,3.14231177 L9.09581061,3.1513609 C9.25217379,3.17963945 9.41188762,3.20904913 9.56713393,3.25203252 C9.62521168,3.2678685 9.6799388,3.2893602 9.73466591,3.31085189 C9.77152295,3.32329445 9.80614623,3.33686815 9.84300327,3.34931071 L9.84300327,3.34931071 L9.94910686,3.38550725 C10.068613,3.42509721 10.1881192,3.46468717 10.3031578,3.51558855 C10.3690537,3.54273595 10.4293652,3.57553906 10.4919105,3.60947331 L10.4919105,3.60947331 L10.589079,3.66150583 L10.6840138,3.70788264 C10.7901174,3.75991516 10.896221,3.81081654 10.9956233,3.87302934 C11.0604024,3.91035702 11.1218308,3.95447154 11.1799085,3.99858607 C11.2134149,4.02120891 11.2458044,4.04496288 11.2793108,4.06758572 L11.2793108,4.06758572 L11.3686612,4.12979852 C11.4602454,4.18974903 11.5507126,4.25083068 11.6367124,4.31983033 C11.6992577,4.37073171 11.7595692,4.42728879 11.8198807,4.48384588 L11.8198807,4.48384588 L11.9896464,4.63994344 C12.0667112,4.70781195 12.1437759,4.77568045 12.2141393,4.85033581 C12.2733339,4.91141746 12.3258273,4.97589254 12.3794375,5.0426299 C12.4051258,5.07430187 12.4296971,5.10710498 12.4576191,5.13877695 L12.4576191,5.13877695 L12.5324501,5.22700601 C12.598346,5.30392365 12.663125,5.37971014 12.7223197,5.46115235 C12.7770468,5.53467656 12.8239557,5.61385649 12.8719816,5.69303641 L12.8719816,5.69303641 L12.9322931,5.7903146 C12.9535138,5.82651113 12.979202,5.86270767 13.0026565,5.89890421 C13.0428642,5.95885472 13.0830719,6.01993637 13.1199289,6.08328031 C13.1925261,6.10364086 13.2617727,6.12513256 13.3265517,6.14662425 C13.2226819,5.48603747 12.8005013,3.926193 11.0860906,2.88214917 C10.8459614,2.73623188 10.5946634,2.6038883 10.3388979,2.48624956 C10.2886383,2.46362672 10.2394956,2.44552846 10.1881192,2.42629905 C10.1512621,2.41385649 10.1166388,2.40141393 10.0808987,2.38670908 L10.0808987,2.38670908 L10.0194703,2.36182397 C9.87204214,2.30187345 9.73243215,2.24531637 9.59058841,2.20233298 C9.52580937,2.18084129 9.45991346,2.16726759 9.39401754,2.15256274 L9.39401754,2.15256274 L9.27897891,2.12654648 L9.20079732,2.10731707 C9.08129117,2.07677625 8.96178502,2.04736656 8.84227887,2.02813715 C8.76633103,2.01569459 8.69150008,2.01003888 8.61555225,2.00438317 L8.61555225,2.00438317 L8.4402021,1.98854719 C8.32404659,1.97723577 8.20454044,1.96479321 8.08838493,1.96366207 L8.08838493,1.96366207 Z'/></svg>";

var _tag = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.856 1h4.082c.196 0 .386.078.524.218l7.32 7.32a.74.74 0 0 1 0 1.05l-5.194 5.195c-.29.29-.76.29-1.05 0l-7.32-7.321A.737.737 0 0 1 1 6.938V2.856C1 1.83 1.83 1 2.856 1zm.99 4.01a1.311 1.311 0 1 0 0-2.623 1.311 1.311 0 0 0 0 2.623z'/></svg>";

var _ticketing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.70164972,0.064195203 L9.82179292,0.11813325 L9.93453664,0.187782934 L11.8946073,1.59876876 L11.9232995,1.80593363 L11.6924303,2.0852591 C11.518456,2.29397717 11.4370985,2.54921133 11.4628619,2.8021917 C11.4883879,3.04944175 11.6109728,3.26193278 11.8089614,3.40387623 C12.1930268,3.68029779 12.7579639,3.61779734 13.1217893,3.2692987 L13.2083348,3.17624637 L13.438807,2.89838463 L13.6611755,2.87178548 L15.6223034,4.28277131 C15.8359631,4.43712746 15.9687778,4.66550859 15.9951068,4.92141444 C16.0168507,5.12889386 15.9656542,5.33659872 15.8509557,5.51729616 L15.7745919,5.62225586 L7.49455603,15.6124124 C7.29066375,15.8586622 6.97996733,16 6.65962053,16 C6.48741403,16 6.32036934,15.9593234 6.17269024,15.8800975 L6.06578389,15.8134833 L4.10465601,14.4015121 L4.07618799,14.1940952 L4.30767128,13.9153037 C4.66270004,13.4872977 4.60613672,12.8955469 4.19031159,12.5954263 C3.80669711,12.3193292 3.24090606,12.3828553 2.87708151,12.7322212 L2.79055531,12.8254865 L2.55902593,13.1023629 L2.3370172,13.1284857 L0.377771915,11.718318 C-0.026007253,11.4265858 -0.113541286,10.8916553 0.151145921,10.4793365 L0.224676485,10.3790229 L8.50531879,0.387153159 C8.67347141,0.186645205 8.91178395,0.0536227139 9.17567913,0.0132102551 C9.35675384,-0.0154328863 9.53716128,0.00292225087 9.70164972,0.064195203 Z M9.31713382,1.0067976 L6.86772111,3.96168136 C7.01643109,3.93528397 7.17624597,3.96833914 7.30347327,4.06536555 L7.51195343,4.22302805 C7.74041793,4.39704181 7.77546504,4.71170139 7.5914212,4.9265221 C7.48363828,5.05065993 7.3257103,5.11391334 7.16680118,5.11113957 C7.05268523,5.10914767 6.9370471,5.07212387 6.84016784,4.99942202 L6.63275418,4.84177814 C6.51127836,4.74871535 6.44418557,4.61616186 6.43581696,4.48028372 L1.07088182,10.9546418 L2.34059319,11.8690237 L2.38322012,11.838224 L2.54031709,11.737591 L2.65440399,11.6753804 L2.8282023,11.5958553 L2.94772822,11.5524022 L3.06034663,11.5166261 C3.13203332,11.4973923 3.18689777,11.4844871 3.24581301,11.4730699 L3.37895097,11.4515308 L3.54128608,11.4369113 L3.60745008,11.4340026 L3.78391535,11.438101 C3.85003444,11.4409452 3.9011331,11.4460313 3.97265847,11.4560241 L4.10598692,11.480429 L4.2498212,11.5171436 L4.33225753,11.5441486 C4.40234025,11.5675459 4.45393175,11.5876008 4.51263265,11.6137234 L4.60243166,11.6573054 L4.74499905,11.7387952 L4.84653967,11.8067882 L4.98677676,11.9183922 C5.03670322,11.9629007 5.07629922,12.0015616 5.11786568,12.0461954 L5.19934298,12.1400934 L5.27290401,12.2371177 L5.33453627,12.3309056 L5.39669109,12.4392769 C5.4053144,12.4555419 5.41338458,12.471483 5.42137379,12.4879621 L5.47119038,12.60288 L5.52898006,12.7711387 L5.56523473,12.92195 L5.57761846,12.992987 C5.58559809,13.0461088 5.59130077,13.099258 5.59482876,13.1542477 L5.59695911,13.3276117 L5.58310412,13.4996394 L5.56337567,13.6249652 C5.56025998,13.6414028 5.55706084,13.6565219 5.55352379,13.671682 L5.5309873,13.7621376 L5.48277584,13.9134685 L5.44199958,14.0162531 L5.41285066,14.0791083 L6.68150482,14.9934902 L11.824,8.787 L11.7659913,8.74255959 C11.5364603,8.56852722 11.5003641,8.25284917 11.685457,8.03904693 C11.8695009,7.82422622 12.2050638,7.79107755 12.4356613,7.96512854 L12.479,7.998 L14.9266996,5.045646 L13.6580454,4.13224945 L13.5594937,4.20186299 L13.4599368,4.26311726 C13.39768,4.29926309 13.3502095,4.32420842 13.2935503,4.35122502 L13.1181048,4.42495142 L12.9410456,4.48307813 C12.8739816,4.50201868 12.8218273,4.51417069 12.7573879,4.5266826 C12.6858065,4.54067104 12.6273406,4.5493284 12.5699908,4.55443433 C12.5079412,4.5612379 12.4507364,4.56521665 12.3918229,4.56628524 L12.2152688,4.56391666 L12.0284579,4.54439305 L11.8982684,4.52090605 L11.7761126,4.49091337 L11.6625086,4.45593062 L11.538179,4.40847927 L11.4177416,4.35283471 L11.3150196,4.2978326 L11.2029201,4.22821642 C11.186615,4.21743737 11.171061,4.20677784 11.155601,4.19579938 C11.1081244,4.16184135 11.0611738,4.12395318 11.0125541,4.08096189 C10.9625592,4.0364374 10.9235771,3.99911053 10.8816894,3.9551996 L10.765735,3.81716613 L10.6951025,3.71709366 C10.6851562,3.70189671 10.6758804,3.68709766 10.6669112,3.672182 C10.6303073,3.6136993 10.6049587,3.56718745 10.579314,3.51309352 L10.5295729,3.40067849 L10.4891784,3.28887394 L10.4563795,3.17920843 L10.4309914,3.05964823 L10.4230241,3.01223863 C10.4146552,2.96153967 10.4097014,2.91245408 10.4054959,2.84691579 L10.4023044,2.67582907 L10.4160957,2.50216359 L10.4355703,2.38183757 L10.4467149,2.32999771 C10.4618863,2.26212633 10.4749369,2.21323967 10.4933883,2.15398568 L10.5581944,1.98193567 L10.585788,1.92019415 L9.31713382,1.0067976 Z M11.112001,6.95927428 L11.4794464,7.23872965 C11.7089775,7.41276203 11.7450911,7.72744022 11.5599982,7.94124247 C11.4521978,8.06638015 11.2942698,8.12963356 11.1353607,8.1268598 C11.0212447,8.12486789 10.9056066,8.08784409 10.8097939,8.01516086 L10.4423484,7.73570549 C10.2127999,7.56267296 10.1777528,7.24801338 10.3628632,7.03321129 C10.546907,6.81839058 10.8824874,6.78424206 11.112001,6.95927428 Z M9.78960996,5.95404228 L10.1570554,6.23349765 C10.3865864,6.40753002 10.4216335,6.7221896 10.2365232,6.9369917 C10.1298068,7.06114815 9.9718788,7.12440156 9.81296968,7.12162779 C9.69778722,7.11961727 9.5832156,7.08261208 9.48633634,7.00991024 L9.11889087,6.73045487 C8.89042637,6.55644111 8.85431276,6.24176291 9.0394231,6.02696082 C9.22453344,5.81215872 9.5590299,5.77899144 9.78960996,5.95404228 Z M8.46615244,4.94879165 L8.8346644,5.22826564 C9.06312891,5.4022794 9.09817601,5.71693898 8.91413218,5.93175969 C8.80634926,6.05589752 8.64842128,6.11915093 8.48951215,6.11637717 C8.3753962,6.11438526 8.25975808,6.07736146 8.16287881,6.00465961 L7.79543335,5.72520424 C7.56696884,5.55119048 7.53085524,5.23651229 7.71596558,5.02171019 C7.90105846,4.80790795 8.23555492,4.77474066 8.46615244,4.94879165 Z'/></svg>";

var _times = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.414 8l4.293-4.293a.999.999 0 1 0-1.414-1.414L8 6.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L6.586 8l-4.293 4.293a.999.999 0 1 0 1.414 1.414L8 9.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L9.414 8z'/></svg>";

var _timesCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.682 10.268a.999.999 0 1 1-1.414 1.414L8 9.414l-2.267 2.268a.999.999 0 1 1-1.414-1.414L6.586 8 4.319 5.732a.999.999 0 1 1 1.414-1.414L8 6.586l2.268-2.268a.999.999 0 1 1 1.414 1.414L9.414 8l2.268 2.268zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z'/></svg>";

var _trash = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 13.27V5h12v8.27c0 .95-.778 1.729-1.729 1.729H3.729A1.734 1.734 0 0 1 2 13.268zM14 2c.55 0 1 .45 1 1v1H1V3c0-.55.45-1 1-1h4V1h4v1h4zM6 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z'/></svg>";

var _unavailable = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8,0 C12.418,0 16,3.582 16,8 C16,12.418 12.418,16 8,16 C3.582,16 0,12.418 0,8 C0,3.582 3.582,0 8,0 Z M12,7.33333333 L4,7.33333333 L4,8.66666667 L12,8.66666667 L12,7.33333333 Z' fill='#9E9E9E'/></svg>";

var _undo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.415 6H6a1 1 0 1 1 0 2H0V2a1 1 0 1 1 2 0v2.39a7 7 0 1 1 1.118 8.626 1 1 0 1 1 1.395-1.433A5 5 0 1 0 3.415 6z'/></svg>";

var _upload = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1zM7 4.827L5.487 6.31a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415l3.954-3.891L11.95 4.89a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 4.822l.003 6.676a1 1 0 1 1-2 0L7 4.828z'/></svg>";

var _user = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 Z M8,1.14285714 C4.21290457,1.14285714 1.14285714,4.21290457 1.14285714,8 C1.14285714,11.7870954 4.21290457,14.8571429 8,14.8571429 C11.7870954,14.8571429 14.8571429,11.7870954 14.8571429,8 C14.8571429,4.21290457 11.7870954,1.14285714 8,1.14285714 Z M7.98584949,2.85714286 C9.34889681,2.85714286 10.4550686,3.96926648 10.4550686,5.34532261 C10.4550686,6.03714702 10.1731131,6.67958828 9.69676508,7.14069284 L9.54936063,7.27100304 L9.60952352,7.30690349 L9.7762134,7.4203516 L9.94138786,7.54644391 L10.1051883,7.68526764 L10.2416263,7.81195445 L10.3714232,7.94232396 L10.651769,8.25794222 L10.8927771,8.57891367 C11.2423945,9.08380698 11.5094592,9.66366866 11.696734,10.3237804 L11.7721176,10.6116142 L11.8248732,10.8469718 L11.8721751,11.0950836 L12,12 L4,12 L4.12132361,11.1348656 L4.19938519,10.7391559 C4.32098422,10.1957878 4.50640614,9.68111979 4.75515981,9.19630862 C5.14427514,8.4352247 5.61044167,7.85635785 6.15617404,7.46199175 L6.34103517,7.33737288 L6.43520613,7.28170213 C5.95230535,6.88859564 5.63224896,6.33000659 5.54176275,5.70873557 L5.52157072,5.5205766 L5.51550658,5.34532261 C5.51550658,3.96950369 6.62256126,2.85714286 7.98584949,2.85714286 Z M7.31110778,7.99745032 C6.65394286,8.22940961 6.10343721,8.77723717 5.64583726,9.67227131 C5.51565668,9.92598882 5.40602461,10.1896281 5.31790656,10.459986 L5.23699562,10.7324649 L5.17782135,10.9719149 L10.8209265,10.9719149 L10.7730876,10.763641 C10.6764681,10.3856601 10.5513461,10.0402539 10.3990022,9.72917415 L10.2796601,9.50232788 L10.1836552,9.34044964 L10.0835551,9.18769891 L9.88229317,8.91713876 L9.64958589,8.65626153 L9.54599401,8.55307868 C8.840639,7.8748068 8.1440517,7.70403557 7.31110778,7.99745032 Z M7.98584949,3.8838946 C7.17505946,3.8838946 6.52070943,4.53940062 6.52070943,5.34532261 C6.52070943,6.15157726 7.17538569,6.80787907 7.98584949,6.80787907 C8.7959876,6.80787907 9.44986578,6.15190961 9.44986578,5.34532261 C9.44986578,4.53906839 8.79631372,3.8838946 7.98584949,3.8838946 Z'/></svg>";

var _warning = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.46502018,1.74923827 L12.1966051,7.75126955 L15.9273151,13.7524883 C16.1337991,14.0856185 15.8756942,14.5 15.4636012,14.5 L0.537261382,14.5 C0.124293481,14.5 -0.133811457,14.0856185 0.0726724933,13.7524883 L3.80425745,7.75126955 L7.5358424,1.74923827 C7.74232635,1.41692058 8.25853623,1.41692058 8.46502018,1.74923827 Z M8.57142857,11.25 L7.42857143,11.25 L7.42857143,12.3333333 L8.57142857,12.3333333 L8.57142857,11.25 Z M8.57142857,4.75 L7.42857143,4.75 L7.42857143,10.1666667 L8.57142857,10.1666667 L8.57142857,4.75 Z' fill='#FFC749'/></svg>";

const MAP = {
    'account': _account,
    'angle-bottom': _angleBottom,
    'angle-down': _angleDown,
    'angle-end': _angleEnd,
    'angle-left': _angleLeft,
    'angle-right': _angleRight,
    'angle-start': _angleStart,
    'angle-top': _angleTop,
    'angle-up': _angleUp,
    'bell': _bell,
    'billing': _billing,
    'calendar': _calendar,
    'chart': _chart,
    'checkmark': _checkmark,
    'checkmark-circle': _checkmarkCircle,
    'clock': _clock,
    'cog': _cog,
    'copy': _copy,
    'critical': _critical,
    'download': _download,
    'envelope': _envelope,
    'exclamation-circle': _exclamationCircle,
    'exclamation-diamond': _exclamationDiamond,
    'exclamation-triangle': _exclamationTriangle,
    'external-link': _externalLink,
    'file': _file,
    'filter': _filter,
    'fish-hook': _fishHook,
    'flag': _flag,
    'globe': _globe,
    'grid': _grid,
    'heartbeat-outline': _heartbeatOutline,
    'heartbeat-fill': _heartbeatFill,
    'help-circle': _helpCircle,
    'information': _information,
    'input-file': _inputFile,
    'kbd-arrow-down': _kbdArrowDown,
    'kbd-arrow-left': _kbdArrowLeft,
    'kbd-arrow-right': _kbdArrowRight,
    'kbd-arrow-up': _kbdArrowUp,
    'kbd-capslock': _kbdCapslock,
    'kbd-command': _kbdCmd,
    'kbd-delete': _kbdDelete,
    'kbd-eject': _kbdEject,
    'kbd-option': _kbdOption,
    'kbd-return': _kbdReturn,
    'kbd-shift': _kbdShift,
    'kbd-space': _kbdSpace,
    'kbd-tab': _kbdTab,
    'key': _key,
    'list': _list,
    'lock': _lock,
    'mime-archive': _mimeArchive,
    'mime-audio': _mimeAudio,
    'mime-code': _mimeCode,
    'mime-data': _mimeData,
    'mime-image': _mimeImage,
    'mime-system': _mimeSystem,
    'mime-text': _mimeText,
    'mime-video': _mimeVideo,
    'minus': _minus,
    'minus-circle': _minusCircle,
    'monitoring': _chart,
    'ok': _ok,
    'paperclip': _paperclip,
    'payment': _payment,
    'pencil': _pencil,
    'pending': _pending,
    'phone': _phone,
    'plus': _plus,
    'plus-or-minus': _plusOrMinus,
    'redo': _redo,
    'search': _search,
    'server': _server,
    'shield-lock': _shieldLock,
    'server-config': _serverConfig,
    'server-incident': _serverIncident,
    'sort': _sort,
    'sort-down': _sortDown,
    'sort-up': _sortUp,
    'support': _support,
    'tag': _tag,
    'ticketing': _ticketing,
    'times': _times,
    'times-circle': _timesCircle,
    'trash': _trash,
    'unavailable': _unavailable,
    'undo': _undo,
    'upload': _upload,
    'user': _user,
    'warning': _warning,
};

// TODO: DEPRECATED icons
MAP['export'] = MAP['upload'];
MAP['input-url'] = MAP['globe'];
MAP['technical-change'] = MAP['server-config'];
MAP['technical-incident'] = MAP['server-incident'];
MAP['input-time'] = MAP['clock'];
MAP['info-circle'] = MAP['information'];

/**
 * @module HelixUI/Utils
 */

const NOOP = () => {};

/**
 * @description
 * Returns argument if it's a function, otherwise returns a noop.
 *
 * @param {function|*} [fn=noop] - possible function
 * @returns {function}
 */
function ensureFn (fn = NOOP) {
    return (typeof fn === 'function') ? fn : NOOP;
}

/**
 * Key/value map of key names and their keycode.
 *
 * - Alt / Option
 * - Backspace
 * - Ctrl / Control
 * - Del / Delete
 * - Down
 * - End
 * - Enter / Return
 * - Esc / Escape
 * - Home
 * - Ins / Insert
 * - Left
 * - PgDown / PageDown
 * - PgUp / PageUp
 * - Right
 * - Shift
 * - Space
 * - Tab
 * - Up
 * @enum {Integer}
 */
const KEYS = {
    Alt: 18,
    Backspace: 8,
    Control: 17,
    Ctrl: 17,
    Del: 46,
    Delete: 46,
    Down: 40,
    End: 35,
    Enter: 13,
    Esc: 27,
    Escape: 27,
    Home: 36,
    Ins: 45,
    Insert: 45,
    Left: 37,
    Option: 18,
    PageDown: 34,
    PageUp: 33,
    PgDown: 34,
    PgUp: 33,
    Return: 13,
    Right: 39,
    Shift: 16,
    Space: 32,
    Tab: 9,
    Up: 38,
};

/**
 * Defers execution of callback function until _next_ event loop.
 *
 * @param {Function} callback
 * @returns {Function}
 */
function defer (cb) {
    return () => setTimeout(cb, 0);
}

/**
 * Generate a unique ID
 *
 * **Pseudo-random Algorithm**
 * This functionality is pseudo-random, and you should not depend on 100%
 * random values. Given a large enough dataset, this method has the
 * potential to generate duplicate values.
 *
 * For the purposes of most applications, the dataset is small enough that
 * the potential for duplicate values is almost 0, meaning that it's good
 * enough for use.
 *
 * @see https://gist.github.com/gordonbrander/2230317
 */
function generateId () {
    return Math
        .random()     // 0.7093288430261266
        .toString(36) // "0.pjag2nwxb2o"
        .substr(2,8); // "pjag2nwx"
}

/**
 * @function
 * @param {class} baseClass - Base class to apply mixin behavior
 * @param {...function} mixins - mixin factory functions
 * @returns {class}
 *
 * @example
 * import { mix } from 'utils';
 *
 * // Define unique superclass with behaviors from one or more mixin classes
 * class _ABElement extends mix(HXElement, MixinA, MixinB) {}
 *
 * // Extend unique superclass and define additional logic
 * class HXNewElement extends _ABElement {
 *   // logic unique to HXNewElement ...
 * }
 */
function mix (baseClass, ...mixins) {
    return mixins.reduce((klass, mixin) => {
        return mixin(klass);
    }, baseClass);
}

/**
 * Communicate scroll events from elements at arbitrary depths in the DOM tree
 * (because 'scroll' events do not bubble).
 *
 * The event is dispatched from the `document` object, instead of bubbling from
 * the original element, to avoid interfering with 'scroll' event listeners
 * attached to ancestor elements.
 *
 * We dispatch a CustomEvent so that we can communicate details about the
 * originating target via the `detail` property on the event.
 *
 * @param {Event} evt - "scroll" event object
 * @returns {Boolean}
 */
function onScroll (evt) {
    let _evtScroll = new CustomEvent('scroll', {
        cancelable: true,
        bubbles: false,
        detail: {
            target: evt.target,
        },
    });

    return document.dispatchEvent(_evtScroll);
}//onScroll()

/**
 * Event listener callback function to prevent page scrolling on `keydown`.
 *
 * @param {Event} evt - Event to act on.
 */
function preventKeyScroll (evt) {
    switch (evt.keyCode) {
        case KEYS.Down:
        case KEYS.Left:
        case KEYS.Right:
        case KEYS.Space:
        case KEYS.Up:
            evt.preventDefault();
            break;
    }
}

/**
 * Warn user of deprecation.
 *
 * @param {String} txtReplacement - "use instead" replacement
 */
function replaceWith (txtReplacement) {
    /* eslint-disable no-console */
    console.warn(`
        DEPRECATED: Use ${txtReplacement} instead.
        Old functionality will be removed in an upcoming major release.
    `);
    /* eslint-enable no-console */
}

/**
 * @description
 * Run callback after WebComponents polyfills have finished loading
 *
 * @example
 * function start () {
 *   // do stuff...
 * }
 *
 * onWebComponentsReady(start);
 *
 * @param {function} [cb=noop] - callback to run
 */
function onWebComponentsReady (cb = NOOP) {
    let _callback = ensureFn(cb);

    if (window.WebComponents) {
        // Polyfill detected
        if (window.WebComponents.ready) {
            // polyfill already finished loading, execute callback immediately
            _callback();
        } else {
            let wcrHandler = function () {
                _callback();
                // remove listener to prevent additional execution of the handler
                window.removeEventListener('WebComponentsReady', wcrHandler);
            };
            // execute callback when polyfill has finished loading
            window.addEventListener('WebComponentsReady', wcrHandler);
        }
    } else {
        // No polyfills detected, execute callback immediately
        _callback();
    }
}

/**
 * @description
 * Asynchronous version of onWebComponentsReady()
 *
 * @example <caption>Then-able</caption>
 * function start () {
 *   // do stuff...
 * }
 *
 * waitForWebComponents().then(start);
 *
 *
 * @example <caption>Async/Await</caption>
 * function start () {
 *   // do stuff...
 * }
 *
 * async function load () {
 *   await waitForWebComponents();
 *   start();
 * }
 *
 * load();
 *
 * @returns {Promise}
 */
function waitForWebComponents () {
    return new Promise((resolve, reject) => {
        try {
            onWebComponentsReady(resolve);
        } catch (err) {
            reject(err);
        }
    });
}

var Utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ensureFn: ensureFn,
    KEYS: KEYS,
    defer: defer,
    generateId: generateId,
    mix: mix,
    onScroll: onScroll,
    preventKeyScroll: preventKeyScroll,
    replaceWith: replaceWith,
    onWebComponentsReady: onWebComponentsReady,
    waitForWebComponents: waitForWebComponents,
    Alignment: index,
    Offset: index$1,
    ICONS: MAP
});

/**
 * Fires in single-panel mode, when the current panel changes.
 *
 * @event Accordion:panelchange
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-accordion>` element.
 *
 * @emits Accordion:panelchange
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onPanelOpen = this._onPanelOpen.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('currentPanel');
        this.panels.forEach(panel => {
            panel.addEventListener('open', this._onPanelOpen);
        });

        if (this._isNavigable) {
            this._openPanel(this.currentPanel);
        }
    }

    $onDisconnect () {
        this.panels.forEach(panel => {
            panel.removeEventListener('open', this._onPanelOpen);
        });
    }

    static get $observedAttributes () {
        return [ 'current-panel' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-panel') {
            if (newVal !== null) {
                this._openPanel(Number(newVal));
                this.$emit('panelchange');
            }
        }
    }

    /**
     * Array of `<hx-accordion-panel>` descendants.
     *
     * @readonly
     * @type {HXAccordionPanelElement[]}
     * @todo
     * Needs tweaked for nested accordions (e.g. multi-level navigation).
     * As it currently is, it returns ALL panels within the accordion,
     * not just the immediate children.
     */
    get panels () {
        if (!this.isConnected) {
            return [];
        }

        return Array.from(this.querySelectorAll('hx-accordion-panel'));
    }

    /**
     * Zero-based index of the currently open panel.
     *
     * - **multi-panel** mode _(default)_
     *   - If unset, the user can open multiple panels at once.
     * - **single-panel** mode
     *   - If set, the user can only open one panel at a time.
     *
     * @type {Number}
     * @todo Needs updated to return Integer or null/undefined.
     * @todo Needs renamed. Too similar to nextPanel() and previousPanel() methods.
     */
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

    /**
     * Select next panel, when in single-panel mode.
     */
    selectNext () {
        if (this._isNavigable) {
            this.currentPanel += 1;
        }
    }

    /**
     * Select previous panel, when in single-panel mode.
     */
    selectPrevious () {
        if (this._isNavigable) {
            this.currentPanel -= 1;
        }
    }

    /** @private */
    get _isNavigable () {
        return this.hasAttribute('current-panel');
    }

    /** @private */
    _onPanelOpen (evt) {
        let idx = this.panels.indexOf(evt.target);
        if (this._isNavigable) {
            this.currentPanel = idx;
        }
    }

    /** @private */
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
}

var shadowMarkup = "<button type='button' id='hxToggle' aria-controls='body' aria-expanded='false'><div class='header'><span class='header__content'><slot name='header'></slot></span><hx-icon class='header__icon' type='angle-down'></hx-icon></div></button><div id='hxBody' aria-expanded='false'><slot></slot></div>";

var shadowStyles = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxToggle { background-color: transparent; border: 1px; cursor: pointer; padding: 0 1rem 0 0; text-align: left; width: 100%; }\n\n#hxToggle[aria-expanded=\"true\"] .header__icon { transform: scaleY(-1); }\n\n#hxToggle[disabled] { cursor: not-allowed; }\n\n.header { align-items: center; display: flex; }\n\n.header__content { flex-shrink: 0; flex-grow: 1; }\n\n.header__icon { flex-shrink: 0; margin-left: 0.5rem; }\n\n#hxBody { display: none; }\n\n#hxBody[aria-expanded=\"true\"] { display: block; }\n\nbutton:focus { outline: none; box-shadow: 0 0 4px 0 #0051b7; box-shadow: 0 0 4px 0 var(--hxAccordianPanel-button-focus-box-shadow, #0051b7); }\n";

/**
 * Fires when the element's contents are concealed.
 *
 * @event AccordionPanel:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event AccordionPanel:open
 * @since 0.4.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-accordion-panel>` element.
 *
 * @emits AccordionPanel:close
 * @emits AccordionPanel:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
class HXAccordionPanelElement extends HXElement {
    static get is () {
        return 'hx-accordion-panel';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this._btnToggle.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this._btnToggle.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch  (attr) {
            case 'disabled':
                this._btnToggle.disabled = hasValue;
                break;
            case 'open':
                this._btnToggle.setAttribute('aria-expanded', hasValue);
                this._elBody.setAttribute('aria-expanded', hasValue);
                this.$emit(hasValue ? 'open' : 'close');
                break;
        }
    }

    /**
     * @default false
     * @type {Boolean}
     * @description
     * Property reflecting the "open" HTML attribute, indicating whether or not
     * the element's contents (excluding the header) should be shown.
     */
    get open () {
        return this.hasAttribute('open');
    }
    set open (newVal) {
        if (newVal) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    /** @private */
    get _btnToggle () {
        return this.shadowRoot.getElementById('hxToggle');
    }

    /** @private */
    get _elBody () {
        return this.shadowRoot.getElementById('hxBody');
    }

    /** @private */
    _onClick (evt) {
        evt.preventDefault();

        if (!this.disabled) {
            this.open = !this.open;
        }
    }
}

var shadowMarkup$1 = "<div id='hxAlert'><span id='hxIconWrapper'><hx-icon id='hxIcon' type='info-circle'></hx-icon></span><span id='hxContent'><span id='hxStatus'></span><slot></slot></span><button id='hxCta' type='button'></button> <button id='hxDismiss' type='button'><hx-icon type='times'></hx-icon></button></div>";

var shadowStyles$1 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxAlert { display: flex; }\n\nbutton { align-self: flex-start; background-color: transparent; border: 0; cursor: pointer; }\n\n#hxIconWrapper { flex-shrink: 0; padding: 1rem; }\n\n#hxContent { flex-grow: 1; margin-right: 1rem; padding: 1rem 0; }\n\n#hxStatus { float: left; font-weight: 500; margin-right: 0.25rem; text-transform: uppercase; }\n\n#hxStatus:after { content: \":\"; }\n\n#hxStatus:empty { display: none; }\n\n#hxCta { flex-shrink: 0; font-weight: 500; padding: 1rem 0; text-transform: uppercase; white-space: nowrap; }\n\n#hxCta:empty { display: none; }\n\n#hxDismiss { flex-shrink: 0; height: 3rem; padding: 1rem; width: 3rem; }\n\n:host([persist]) #hxDismiss { display: none; }\n\n:host([persist]) #hxCta { margin-right: 1rem; }\n";

const ICONS = {
    'error': 'exclamation-circle',
    'info': 'info-circle',
    'success': 'checkmark-circle',
    'warning': 'exclamation-triangle',
};

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Alert:dismiss
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the CTA button is pressed.
 *
 * @event Alert:submit
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-alert>` element.
 *
 * @emits Alert:dismiss
 * @emits Alert:submit
 * @extends HXElement
 * @hideconstructor
 * @since 0.6.0
 */
class HXAlertElement extends HXElement {
    static get is () {
        return 'hx-alert';
    }

    static get template () {
        return `<style>${shadowStyles$1}</style>${shadowMarkup$1}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('cta');
        this.$upgradeProperty('persist');
        this.$upgradeProperty('status');
        this.$upgradeProperty('type');

        this._btnCta.addEventListener('click', this._onSubmit);
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnCta.removeEventListener('click', this._onSubmit);
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    static get $observedAttributes () {
        return [
            'cta',
            'status',
            'type',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch (attr) {
            case 'cta':
                this._btnCta.textContent = (hasValue ? newVal : '');
                break;

            case 'status':
                this._elStatus.textContent = (hasValue ? newVal : '');
                break;

            case 'type':
                if (hasValue) {
                    this._elIcon.type = (ICONS[newVal] || ICONS['info']);
                } else {
                    this._elIcon.type = ICONS['info'];
                }
                break;
        }
    }

    /**
     * Text for the Call To Action button.
     * If blank, the button will not be shown.
     *
     * @default ""
     * @type {String}
     */
    get cta () {
        return this.getAttribute('cta');
    }
    set cta (value) {
        if (value) {
            this.setAttribute('cta', value);
        } else {
            this.removeAttribute('cta');
        }
    }

    /**
     * Property reflecting the `persist` HTML attribute, indicating whether the
     * alert may be dismissed. If true, the dismiss button will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get persist () {
        return this.hasAttribute('persist');
    }
    set persist (value) {
        if (value) {
            this.setAttribute('persist', '');
        } else {
            this.removeAttribute('persist');
        }
    }

    /**
     * Status text to display before the alert message.
     * If blank, it will not be shown.
     *
     * @default ""
     * @type {String}
     */
    get status () {
        return this.getAttribute('status');
    }
    set status (value) {
        if (value) {
            this.setAttribute('status', value);
        } else {
            this.removeAttribute('status');
        }
    }

    /**
     * Indicates the type of alert to display.
     * Valid values are "info", "success", "warning", and "error".
     *
     * @default "info"
     * @type {String}
     */
    get type () {
        return this.getAttribute('type');
    }
    set type (value) {
        if (value) {
            this.setAttribute('type', value);
        } else {
            this.removeAttribute('type');
        }
    }

    /**
     * Dismiss the alert (removes element from the DOM).
     */
    dismiss () {
        if (!this.persist && this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.remove();
        }
    }

    /**
     * Simulate a mouse click on the CTA button.
     */
    submit () {
        this.$emit('submit');
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    _onSubmit (evt) {
        evt.preventDefault();
        this.submit();
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elStatus () {
        return this.shadowRoot.getElementById('hxStatus');
    }

    /** @private */
    get _btnCta () {
        return this.shadowRoot.getElementById('hxCta');
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}

var shadowMarkup$2 = "<div id='hxBeacon'><button id='hxDismiss' type='button'><span id='hxBeaconPulse'></span></button></div>";

var shadowStyles$2 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n:host #hxDismiss { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; }\n\n:host #hxDismiss #hxBeaconPulse { -webkit-animation: hx-pulse 2s infinite linear; animation: hx-pulse 2s infinite linear; border-radius: 3rem; box-shadow: 0 0 1px 1px var(--hxBeacon, #6b6b6b); content: \"\"; height: 1rem; left: 0; margin: 0; padding: 0; position: absolute; top: 0; -webkit-transform-origin: 50% 50%; transform-origin: 50% 50%; width: 1rem; cursor: pointer; }\n\n@keyframes hx-pulse { 0% { transform: scale(1);\n    opacity: 1; }\n  100% { transform: scale(2.5);\n    opacity: 0; } }\n\n@-webkit-keyframes hx-pulse { 0% { transform: scale(1);\n    opacity: 1; }\n  100% { transform: scale(2.5);\n    opacity: 0; } }\n";

/**
 * Defines behavior for the `<hx-beacon>` element.
 *
 * @extends HXElement
 * @emits beacon:dismiss
 * @hideconstructor
 * @since 0.23.0
 */
class HXBeaconElement extends HXElement {
    static get is () {
        return 'hx-beacon';
    }

    static get template () {
        return `<style>${shadowStyles$2}</style>${shadowMarkup$2}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
    }

    $onConnect () {
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    /**
     * Dismiss the beacon (removes element from the DOM)
     */
    dismiss () {
        if (this.$emit('dismiss')) {
            this.remove();
        }
    }

    /** @private */
    _onDismiss () {
        this.dismiss();
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}

/**
 * Defines behavior for the `<hx-busy>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
class HXBusyElement extends HXElement {
    static get is () {
        return 'hx-busy';
    }

    $onConnect () {
        this.$upgradeProperty('paused');
        this.$defaultAttribute('aria-hidden', true);
    }

    /**
     * Pause or resume animation.
     *
     * @default false
     * @type {Boolean}
     */
    get paused () {
        return this.hasAttribute('paused');
    }
    set paused (isPaused) {
        if (isPaused) {
            this.setAttribute('paused', '');
        } else {
            this.removeAttribute('paused');
        }
    }
}

const STATE = {
    changed: 'hx-changed',
    dirty: 'hx-dirty',
    touched: 'hx-touched',
};

/**
 * Abstract class which defines shared behavior among all
 * form control custom elements (e.g., HXSelectControlElement,
 * HXCheckboxControlElement, HXTextControlElement, etc.).
 *
 * ## States
 *
 * ### Dirty
 * Reflected by the `hx-dirty` content attribute when Changed or Touched.
 *
 * ### Changed
 * Applies the `hx-changed` content attribute when controlElement
 * emits a `change` event. This typically occurs after the value
 * has been modified and the user moves away (blurs) the text control.
 *
 * ### Touched
 * Applies the `hx-touched` content attribute when controlElement
 * emits a `blur` event (meaning that the user has "visited" the
 * text control and moved on).
 *
 * @abstract
 * @hideconstructor
 * @since 0.16.0
 */
class HXFormControlElement extends HXElement {
    /** @override */
    constructor () {
        super();

        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlChange = this._onCtrlChange.bind(this);
    }

    /**
     * Adds `change` and `blur` event listeners to apply
     * "changed" and "touched" states to the custom control
     * element, in addition to superclass behavior.
     *
     * - preserves `$onConnect()` hook for subclasses
     *
     * @override
     */
    connectedCallback () {
        super.connectedCallback();

        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.addEventListener('change', this._onCtrlChange);
            ctrl.addEventListener('blur', this._onCtrlBlur);
        }
    }

    /**
     * Removes event listeners added in connectedCallback,
     * in addition to superclass behavior.
     *
     * - preserves `$onDisconnect()` hook for subclasses
     *
     * @override
     */
    disconnectedCallback () {
        super.disconnectedCallback();

        let ctrl = this.controlElement;
        if (ctrl) {
            ctrl.removeEventListener('change', this._onCtrlChange);
            ctrl.removeEventListener('blur', this._onCtrlBlur);
        }
    }

    /**
     * This should be overridden by subclasses.
     *
     * Logic should make a best effort to return an HTML
     * form control element (e.g., `<input>`, `<select>`,
     * `<textarea>`, etc.).
     *
     * @abstract
     * @default undefined
     * @type {?HTMLElement}
     */
    get controlElement () {}

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get isDirty () {
        return this.hasAttribute(STATE.dirty);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasChanged () {
        return this.hasAttribute(STATE.changed);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasTouched () {
        return this.hasAttribute(STATE.touched);
    }

    /** @private */
    _onCtrlBlur () {
        // communicate state via read-only, boolean content attributes
        this._stateTouched();
        this._stateDirty();
    }

    /** @private */
    _onCtrlChange () {
        // communicate state via read-only, boolean content attributes
        this._stateChanged();
        this._stateDirty();
    }

    /** @private */
    _stateChanged () {
        this.$defaultAttribute(STATE.changed, '');
        this.$emit('hxchange', { bubbles: true });
    }

    /** @private */
    _stateDirty () {
        this.$defaultAttribute(STATE.dirty, '');
        this.$emit('hxdirty', { bubbles: true });
    }

    /** @private */
    _stateTouched () {
        this.$defaultAttribute(STATE.touched, '');
        this.$emit('hxtouch', { bubbles: true });
    }
}

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXCheckboxControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-checkbox-control';
    }

    /**
     * Fetch the first `<input type="checkbox">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }
}

var shadowMarkup$3 = "<div id='hxCheckbox'><hx-icon type='checkmark' id='hxTick'></hx-icon><hx-icon type='minus' id='hxMinus'></hx-icon></div>";

var shadowStyles$3 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxCheckbox { align-items: center; display: grid; font-size: 10px; grid-template-areas: \"icon\"; height: 100%; justify-content: center; width: 100%; }\n\n#hxMinus, #hxTick { grid-area: icon; height: 1em; line-height: 1; width: 1em; }\n\n#hxMinus { display: var(--hxMinus-display, none); }\n\n#hxTick { display: var(--hxTick-display, none); }\n";

/**
 * Applies Shadow DOM to the `<hx-checkbox>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 */
class HXCheckboxElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-checkbox';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$3}</style>${shadowMarkup$3}`;
    }
}

/**
 * Defines behavior for the `<hx-checkbox-set>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.18.0
 */
class HXCheckboxSetElement extends HXElement {
    static get is () {
        return 'hx-checkbox-set';
    }

    $onConnect () {
        this.addEventListener('hxchange', this._onHxchange);
        this.addEventListener('hxdirty', this._onHxdirty);
        this.addEventListener('hxtouch', this._onHxtouch);
    }

    $onDisconnect () {
        this.removeEventListener('hxchange', this._onHxchange);
        this.removeEventListener('hxdirty', this._onHxdirty);
        this.removeEventListener('hxtouch', this._onHxtouch);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get isDirty () {
        return this.hasAttribute(STATE.dirty);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasChanged () {
        return this.hasAttribute(STATE.changed);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasTouched () {
        return this.hasAttribute(STATE.touched);
    }

    /** @private */
    _onHxchange (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.changed, '');
    }

    /** @private */
    _onHxdirty (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.dirty, '');
    }

    /** @private */
    _onHxtouch (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.touched, '');
    }
}

/**
 * Defines behavior for the `<hx-disclosure>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXDisclosureElement extends HXElement {
    static get is () {
        return 'hx-disclosure';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onTargetOpen = this._onTargetOpen.bind(this);
        this._onTargetClose = this._onTargetClose.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('expanded');
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex') && !this.disabled) {
            this.setAttribute('tabindex', 0);
        }

        if (this.target) {
            this.expanded = this.target.hasAttribute('open');
        } else {
            this.expanded = false;
        }

        this._addTargetListeners();
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', preventKeyScroll);
        this.addEventListener('keyup', this._onKeyUp);
    }

    $onDisconnect () {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', preventKeyScroll);
        this.removeEventListener('keyup', this._onKeyUp);

        this._removeTargetListeners();
    }

    static get $observedAttributes () {
        return [ 'aria-expanded' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'aria-expanded') {
            if (this.target) {
                let setTo = (newVal === 'true');
                if (this.target.open !== setTo) {
                    this.target.open = setTo;
                }
            }
        }
    }

    /**
     * @default false
     * @type {Boolean}
     */
    get expanded () {
        return this.getAttribute('aria-expanded') === 'true';
    }
    set expanded (newVal) {
        this.setAttribute('aria-expanded', !!newVal);
    }

    /**
     * @readonly
     * @type {HTMLElement}
     */
    get target () {
        if (this.isConnected && !this._target) {
            let targetId = this.getAttribute('aria-controls');
            this._target = this.getRootNode().querySelector(`[id="${targetId}"]`);
        }
        return this._target;
    }

    /**
     * Simulates mouse click
     */
    click () {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }

    /** @private */
    _addTargetListeners () {
        if (this.target) {
            this.target.addEventListener('open', this._onTargetOpen);
            this.target.addEventListener('close', this._onTargetClose);
        }
    }

    /** @private */
    _onKeyUp (event) {
        switch (event.keyCode) {
            case KEYS.Space:
            case KEYS.Enter:
                this.click();
                break;
        }
    }

    /** @private */
    _onTargetOpen () {
        this.expanded = true;
    }

    /** @private */
    _onTargetClose () {
        this.expanded = false;
    }

    /** @private */
    _onClick () {
        this.click();
    }

    /** @private */
    _removeTargetListeners () {
        if (this.target) {
            this.target.removeEventListener('open', this._onTargetOpen);
            this.target.removeEventListener('close', this._onTargetClose);
        }
    }
}

var shadowMarkup$4 = "<div id='hxDiv'><slot></slot></div>";

var shadowStyles$4 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n@supports (--skip-ie: true) { :host { --hxPadding--base: 0; --hxPaddingTop: var(--hxPadding--base); --hxPaddingRight: var(--hxPadding--base); --hxPaddingBottom: var(--hxPadding--base); --hxPaddingLeft: var(--hxPadding--base); --hxPadding:\n      var(--hxPaddingTop)\n      var(--hxPaddingRight)\n      var(--hxPaddingBottom)\n      var(--hxPaddingLeft); }\n  :host #hxDiv { padding: var(--hxPadding, 0); } }\n";

/**
 * Nullable string denoting direction for scrolling.
 *
 * Valid Values:
 *   - 'horizontal'
 *   - 'vertical'
 *   - 'both'
 *
 * @typedef {Enum<string>|Null} ScrollDirection
 */

/**
 * Defines behavior for the `<hx-div>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
class HXDivElement extends HXElement {
    static get is () {
        return 'hx-div';
    }

    static get template () {
        return `<style>${shadowStyles$4}</style>${shadowMarkup$4}`;
    }

    $onConnect () {
        this.addEventListener('scroll', onScroll);
    }

    $onDisconnect () {
        this.removeEventListener('scroll', onScroll);
    }

    static get $observedAttributes () {
        return [ 'scroll' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'scroll') {
            if (newVal !== null) {
                this._resetScroll();
            }
        }
    }

    /** @type {ScrollDirection} */
    get scroll () {
        return this.getAttribute('scroll');
    }

    /** @type {ScrollDirection} */
    set scroll (newVal) {
        if (newVal === null) {
            this.removeAttribute('scroll');
        } else {
            this.setAttribute('scroll', newVal);
        }
    }

    /** @private */
    _resetScroll () {
        // reset scroll by scrolling to top left corner
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
}

var shadowMarkup$5 = "<div id='hxDrawer'><button type='button' title='close drawer' id='hxClose'><hx-icon type='times'></hx-icon></button><slot></slot></div><slot name='fixed'></slot>";

var shadowStyles$5 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxClose { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; color: var(--hxClose-color, #757575); font-size: 1rem; height: 2.75rem; position: absolute; right: 0; text-align: center; top: 0.375rem; width: 2.75rem; }\n\n#hxDrawer { background-color: inherit; bottom: 0; display: flex; flex-direction: column; height: 100%; left: 100%; overflow: hidden; position: fixed; }\n\n@media (min-width: 0em) { :host #hxDrawer { transition-duration: 0.18s; transition-property: transform, box-shadow; transition-timing-function: ease-in, linear; width: 90vw; }\n  :host([open]) #hxDrawer { box-shadow: -4px 0 32px 0 rgba(0, 0, 0, 0.24); transform: translateX(-100%); transition-duration: 0.36s; transition-timing-function: ease-out, linear; } }\n\n@media (min-width: 40em) { :host #hxDrawer { transition-duration: 0.17s; width: 26rem; }\n  :host([open]) #hxDrawer { transition-duration: 0.33s; }\n  :host(.hxSm) #hxDrawer { transition-duration: 0.1s; width: 15rem; }\n  :host(.hxSm[open]) #hxDrawer { transition-duration: 0.2s; }\n  :host(.hxLg) #hxDrawer { transition-duration: 0.2s; width: 31rem; }\n  :host(.hxLg[open]) #hxDrawer { transition-duration: 0.4s; } }\n\n@media (min-width: 64em) { :host #hxDrawer { transition-duration: 0.18s; width: 28rem; }\n  :host([open]) #hxDrawer { transition-duration: 0.36s; }\n  :host(.hxSm) #hxDrawer { transition-duration: 0.11s; width: 17rem; }\n  :host(.hxSm[open]) #hxDrawer { transition-duration: 0.22s; }\n  :host(.hxLg) #hxDrawer { transition-duration: 0.21s; width: 33rem; }\n  :host(.hxLg[open]) #hxDrawer { transition-duration: 0.42s; } }\n\n@media (min-width: 75em) { :host #hxDrawer { transition-duration: 0.19s; width: 30rem; }\n  :host([open]) #hxDrawer { transition-duration: 0.38s; }\n  :host(.hxSm) #hxDrawer { transition-duration: 0.12s; width: 19rem; }\n  :host(.hxSm[open]) #hxDrawer { transition-duration: 0.24s; }\n  :host(.hxLg) #hxDrawer { transition-duration: 0.22s; width: 35rem; }\n  :host(.hxLg[open]) #hxDrawer { transition-duration: 0.45s; } }\n\n@media (min-width: 90em) { :host #hxDrawer { transition-duration: 0.2s; width: 32rem; }\n  :host([open]) #hxDrawer { transition-duration: 0.41s; }\n  :host(.hxSm) #hxDrawer { transition-duration: 0.13s; width: 21rem; }\n  :host(.hxSm[open]) #hxDrawer { transition-duration: 0.27s; }\n  :host(.hxLg) #hxDrawer { transition-duration: 0.24s; width: 37rem; }\n  :host(.hxLg[open]) #hxDrawer { transition-duration: 0.47s; } }\n";

/**
 * Cancelable event that fires when the element's
 * contents are to be concealed.
 *
 * @event Drawer:close
 * @type {CustomEvent}
 */

/**
 * Cancelable event that fires when the element's
 * contents are to be revealed.
 *
 * @event Drawer:open
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-drawer>` element.
 *
 * @emits Drawer:close
 * @emits Drawer:open
 * @extends HXElement
 * @hideconstructor
 */
class HXDrawerElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-drawer';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$5}</style>${shadowMarkup$5}`;
    }

    /** @override */
    $onCreate () {
        this._onCloseClick = this._onCloseClick.bind(this);
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
    }

    /** @override */
    static get $observedAttributes () {
        return [ 'open' ];
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            this.setAttribute('aria-expanded', newVal !== null);
        }
    }

    /** @override */
    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
        this._resize();

        this._btnClose.addEventListener('click', this._onCloseClick);
        document.addEventListener('scroll', this._onDocumentScroll, { passive: true });
    }

    /** @override */
    $onDisconnect () {
        this._btnClose.removeEventListener('click', this._onCloseClick);
        document.removeEventListener('scroll', this._onDocumentScroll);
    }

    /**
     * Property reflecting the `open` HTML attribute, indicating whether or not
     * the element's contents should be shown.
     *
     * @default false
     * @type {Boolean}
     */
    set open (value) {
        if (value) {
            // allow consumer to cancel the event
            if (this.$emit('open')) {
                this._resize();
                this.setAttribute('open', '');
            }
        } else {
            // allow consumer to cancel the event
            if (this.$emit('close')) {
                this.removeAttribute('open');
            }
        }
    }
    get open () {
        return this.hasAttribute('open');
    }

    /** @private */
    get _btnClose () {
        return this.shadowRoot.querySelector('#hxClose');
    }

    /** @private */
    get _elDrawer () {
        return this.shadowRoot.querySelector('#hxDrawer');
    }

    /** @private */
    _onCloseClick (evt) {
        evt.preventDefault();
        this.open = false;
    }

    /** @private */
    _onDocumentScroll () {
        if (this.open) {
            this._resize();
        }
    }

    /**
     * Resize the drawer based on scroll position in order to keep
     * it flush with the bottom of the eyebrow.
     *
     * @private
     */
    _resize () {
        let header = document.querySelector('#head');

        if (header) {
            let { bottom } = header.getBoundingClientRect();

            if (bottom > 0) {
                this._elDrawer.style.setProperty('height', `calc(100% - ${bottom}px)`);
            } else {
                this._elDrawer.style.removeProperty('height');
            }
        }
    }
}

var shadowMarkup$6 = "<div id='hxDropFence'><hx-file-icon type='paperclip'></hx-file-icon><div><slot></slot></div></div>";

var shadowStyles$6 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxDropFence { align-items: center; display: flex; flex-direction: column; height: 100%; justify-content: center; width: 100%; }\n\n#hxDropFence > div { margin-top: 0.5rem; max-width: 30rem; }\n";

/**
 * Defines behavior for the `<hx-drop-fence>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.14.0
 */
class HXDropFenceElement extends HXElement {
    static get is () {
        return 'hx-drop-fence';
    }

    static get template () {
        return `<style>${shadowStyles$6}</style>${shadowMarkup$6}`;
    }
}

class HXDropZoneElement extends HXElement {
    static get is () {
        return 'hx-drop-zone';
    }

    $onCreate () {
        this._isDocDragging = false;
        this._isZoneDragging = false;
        this._onDocDragLeave = this._onDocDragLeave.bind(this);
        this._onDocDragOver = this._onDocDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this._stopDragging = this._stopDragging.bind(this);
    }

    $onConnect () {
        document.addEventListener('dragleave', this._onDocDragLeave);
        document.addEventListener('dragover', this._onDocDragOver);
        document.addEventListener('drop', this._onDrop);
        this.addEventListener('dragleave', this._onDragLeave);
        this.addEventListener('dragover', this._onDragOver);
        this.addEventListener('drop', this._onDrop);
    }

    $onDisconnect () {
        document.removeEventListener('dragleave', this._onDocDragLeave);
        document.removeEventListener('dragover', this._onDocDragOver);
        document.removeEventListener('drop', this._onDrop);
        this.removeEventListener('dragleave', this._onDragLeave);
        this.removeEventListener('dragover', this._onDragOver);
        this.removeEventListener('drop', this._onDrop);
    }

    /**
     * @readonly
     * @type {String}
     */
    get drag () {
        return this.getAttribute('drag');
    }

    /**
     * @private
     * @returns {Boolean}
     */
    _isFileDrag (evt) {
        let _types = evt.dataTransfer.types;
        if (_types) {
            if (_types.indexOf) {
                return (_types.indexOf('Files') !== -1);
            } else {
                return _types.contains('Files');
            }
        } else {
            return false;
        }
    }

    // #2 this gets called when the dragged item leaves the document
    // (leaves to a child element or window altogether)
    /** @private */
    _onDocDragLeave () {
        window.clearTimeout(this._docDragLeaveTimeout);
        // callback must be an arrow function to preserve "this"
        this._docDragLeaveTimeout = window.setTimeout(this._stopDragging, 250);
    }

    // #1 this handler fires continuously as long as the user is dragging on the page
    /** @private */
    _onDocDragOver (evt) {
        if (!this._isDocDragging) {
            this._isDocDragging = true;
            if (this._isFileDrag(evt)) {
                this.setAttribute('drag', 'away');
            }
        }
        window.clearTimeout(this._docDragLeaveTimeout);
    }

    // #4 this gets called when the dragged item leaves the zone
    // (leaves to a child element or zone altogether)
    /** @private */
    _onDragLeave () {
        window.clearTimeout(this._zoneDragLeaveTimeout);
        // callback must be an arrow function to preserve "this"
        this._zoneDragLeaveTimeout = window.setTimeout(() => {
            this._isZoneDragging = false;
            this.setAttribute('drag', 'away');
        }, 0);
    }

    // #3 this handler fires continuously as long as the user is dragging on the zone
    /** @private */
    _onDragOver (evt) {
        evt.preventDefault(); // needed for onDrop to work
        if (!this._isZoneDragging) {
            this._isZoneDragging = true;
            if (this._isFileDrag(evt)) {
                this.setAttribute('drag', 'over');
            }
        }
        window.clearTimeout(this._docDragLeaveTimeout);
        window.clearTimeout(this._zoneDragLeaveTimeout);
    }

    /** @private */
    _onDrop () {
        this._stopDragging();
    }

    /** @private */
    _stopDragging () {
        this.removeAttribute('drag');
        this._isDocDragging = false;
        this._isZoneDragging = false;
    }
}

/**
 *  Defines behavior for the `<hx-email-control>` element.
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.20.0
 */

class HXEmailControl extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-email-control';
    }

    /**
     * Fetch the first `<input>` with 'type="email"' descendant,
     * whether implicit (`<input />`) or explicit
     * (`<input type="email" />`).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input:not([type]), input[type="email"]');
    }
}

var shadowMarkup$7 = "<div id='hxError'><span><hx-icon type='exclamation-circle' id='hxIcon'></hx-icon></span><span><slot></slot></span></div>";

var shadowStyles$7 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxError { display: inline-flex; }\n\n#hxError * + * { margin-left: 0.25rem; }\n";

/**
 * Defines behavior for the `<hx-error>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.4.0
 */
class HXErrorElement extends HXElement {
    static get is () {
        return 'hx-error';
    }

    static get template () {
        return `<style>${shadowStyles$7}</style>${shadowMarkup$7}`;
    }
}

/**
 * Defines behavior for the `<hx-file-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 */
class HXFileControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-file-control';
    }

    /**
     * Fetch the first `<input type="file">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="file"]');
    }
}

var shadowMarkup$8 = "<div id='hxFileIcon'><hx-icon type='file' id='hxBase'></hx-icon><div id='hxOverlay'><hx-icon id='hxIcon'></hx-icon><div id='hxExt'></div></div></div>";

var shadowStyles$8 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxFileIcon { position: relative; }\n\n#hxFileIcon #hxBase { font-size: 2.5rem; height: 1em; }\n\n#hxFileIcon #hxOverlay { align-items: center; display: flex; flex-direction: column; height: 100%; justify-content: center; line-height: 1; position: absolute; text-align: center; top: 0; width: 100%; }\n\n#hxFileIcon #hxIcon { font-size: 1rem; height: 1em; }\n\n#hxFileIcon #hxExt { display: none; font-size: 0.5rem; line-height: 1.5; margin-top: 1px; text-transform: uppercase; }\n\n:host([extension]) #hxFileIcon #hxOverlay { height: auto; top: 0.5rem; }\n\n:host([extension]) #hxFileIcon #hxExt { display: block; }\n";

/**
 * Defines behavior for the `<hx-file-icon>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
class HXFileIconElement extends HXElement {
    static get is () {
        return 'hx-file-icon';
    }

    static get template () {
        return `<style>${shadowStyles$8}</style>${shadowMarkup$8}`;
    }

    $onConnect () {
        this.$upgradeProperty('type');
    }

    static get $observedAttributes () {
        return [ 'extension', 'type' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'extension':
                this._elExt.innerText = newVal;
                break;
            case 'type':
                this._elIcon.type = newVal;
                break;
        }
    }

    get extension () {
        return this.getAttribute('extension');
    }

    set extension (newVal) {
        if (newVal === null) {
            this.removeAttribute('extension');
        } else {
            this.setAttribute('extension', newVal);
        }
    }

    get type () {
        return this.getAttribute('type');
    }

    set type (newVal) {
        return this.setAttribute('type', newVal);
    }

    /** @private */
    get _elExt () {
        return this.shadowRoot.getElementById('hxExt');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }
}

var shadowMarkup$9 = "<div id='hxFileInput'><hx-icon id='hxIcon'></hx-icon><span id='hxLabel'><slot></slot></span></div>";

var shadowStyles$9 = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxIcon { display: none; }\n\n#hxLabel { margin-left: 0.25rem; }\n\n:host([icon]) #hxIcon { display: inline-block; }\n\n:host([title]) #hxLabel { display: none; }\n";

/**
 * Defines behavior for the `<hx-file-input>` element.
 *
 * @extends HXElement
 * @hideconstructor
 */
class HXFileInputElement extends HXElement {
    static get is () {
        return 'hx-file-input';
    }

    static get template () {
        return `<style>${shadowStyles$9}</style>${shadowMarkup$9}`;
    }

    $onConnect () {
        this.$upgradeProperty('icon');
    }

    static get $observedAttributes () {
        return [ 'icon' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'icon') {
            this._elIcon.type = newVal;
        }
    }

    /**
     * Icon to appear within the file selector.
     * @type {String}
     */
    get icon () {
        return this.getAttribute('icon');
    }
    set icon (newVal) {
        this.setAttribute('icon', newVal);
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }
}

var shadowMarkup$a = "<div id='hxFileTile'><a id='hxLink'><div id='hxIconWrapper'><hx-file-icon id='hxIcon'></hx-file-icon><hx-icon type='download'></hx-icon></div><div id='hxContentWrapper'><div id='hxName'></div><div id='hxState--downloadable'><div id='hxDetails'></div></div><div id='hxState--loading'><hx-progress id='hxProgress'></hx-progress></div><div id='hxState--invalid'><button id='hxRetry' type='button'><span>Retry</span><hx-icon type='redo'></hx-icon></button></div></div></a><button id='hxDismiss' type='button'><hx-icon type='times'></hx-icon></button></div>";

var shadowStyles$a = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\na[href] { background-color: transparent; color: #0051b7; text-decoration: none; }\n\na[href]:hover, a[href]:active { color: #367ed4; cursor: pointer; text-decoration: none; }\n\nhx-progress { background-color: #d8d8d8; background-color: var(--hxLoader-hxProgress-bgcolor, #d8d8d8); border-radius: 1em; color: #367ed4; color: var(--hxLoader-hxProgress-color, #367ed4); display: block; height: 0.5rem; overflow: hidden; }\n\n:host button { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; }\n\n:host #hxFileTile { display: flex; font-size: 0.875rem; height: 100%; width: 100%; }\n\n:host #hxRetry { display: inline-flex; justify-content: center; padding: 0.125rem 0.5rem; background-color: transparent; border: none; color: #367ed4; padding: 0; }\n\n:host #hxRetry > * + * { margin-left: 0.5rem; }\n\n:host #hxRetry:focus { outline: none; }\n\n:host #hxRetry[disabled] { cursor: not-allowed; }\n\n:host #hxRetry[disabled]:focus { box-shadow: none; }\n\n:host #hxRetry.hxDeprecated { padding-left: 0; padding-right: 0; }\n\n:host #hxRetry:hover { background-color: transparent; border-color: transparent; color: #0051b7; }\n\n:host #hxRetry:active { background-color: transparent; border-color: transparent; color: #003482; }\n\n:host #hxRetry:focus { background-color: transparent; border-color: transparent; color: #0051b7; outline: none; }\n\n:host #hxRetry[disabled] { background-color: transparent; border-color: transparent; color: #bdbdbd; }\n\n:host #hxRetry hx-icon { margin-left: 0.25rem !important; }\n\n:host #hxDismiss { color: var(--hxDismiss-color, inherit); flex-shrink: 0; font-size: 1rem; line-height: 0; padding: 0.5rem 0.75rem; }\n\n:host #hxDismiss:hover { color: var(--hxDismiss-color--hover, #367ed4); }\n\n:host #hxDismiss:focus { box-shadow: var(--hxDismiss-boxShadow--focus, 0 0 4px rgba(0, 81, 183, 0.5)); outline: 0; }\n\n:host #hxIconWrapper { align-items: center; color: var(--hxIcon-color, inherit); display: flex; flex: 0 0 48px; height: 100%; justify-content: center; line-height: 0; padding: 0.5rem 0 0.5rem 0.5rem; }\n\n:host #hxIconWrapper > hx-icon { display: none; font-size: 2rem; }\n\n:host #hxContentWrapper { display: flex; flex-direction: column; flex-grow: 1; justify-content: center; overflow: hidden; padding: 0.5rem 0 0.5rem 0.5rem; }\n\n:host #hxName { color: var(--hxName-color, #003482); display: flex; font-weight: 500; }\n\n:host #hxName > span { white-space: pre; }\n\n:host #hxName > span:first-child { overflow: hidden; text-overflow: ellipsis; }\n\n:host #hxName > span:last-child { flex-shrink: 0; }\n\n:host #hxDetails { font-weight: 300; overflow: hidden; text-overflow: ellipsis; white-space: pre; }\n\n:host #hxLink { display: flex; flex-grow: 1; overflow: hidden; }\n\n:host #hxLink[href] { color: var(--hxLink-color, inherit); }\n\n:host #hxLink[href]:hover { color: var(--hxLink-color--hover, #367ed4); }\n\n:host #hxLink[href]:hover #hxIconWrapper > hx-file-icon { display: none; }\n\n:host #hxLink[href]:hover #hxIconWrapper > hx-icon { display: inline-block; }\n\n:host #hxLink[href]:hover #hxName { color: inherit; }\n\n:host #hxLink[href]:focus { box-shadow: var(--hxLink-boxShadow--focus, 0 0 4px rgba(0, 81, 183, 0.5)); outline: 0; }\n\n:host #hxState--loading hx-progress { display: inline-block; width: 100%; }\n\n:host #hxState--loading, :host #hxState--invalid { display: none; }\n\n:host([invalid]) #hxIconWrapper { color: var(--hxIcon-color, #6b6b6b); }\n\n:host([invalid]) #hxName { color: var(--hxName-color, #6b6b6b); }\n\n:host([invalid]) #hxState--downloadable { display: none; }\n\n:host([invalid]) #hxState--invalid { display: block; }\n\n:host([progress]) #hxDismiss { color: var(--hxDismiss-color, #424242); }\n\n:host([progress]) #hxIconWrapper { color: var(--hxIcon-color, #6b6b6b); }\n\n:host([progress]) #hxName { color: var(--hxName-color, #6b6b6b); }\n\n:host([progress]) #hxState--downloadable { display: none; }\n\n:host([progress]) #hxState--loading { display: block; }\n\n:host([readonly]) #hxDismiss { display: none; }\n\n:host([readonly]) #hxContentWrapper { padding: 0.5rem; }\n";

// number of characters to avoid truncation at start/end of file name
const PRE_TRUNC = 14;

/**
 * Fires when user dismisses element, when loading or invalid
 *
 * @event FileTile:cancel
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Fires when user dismisses element, when downloadable
 *
 * @event FileTile:delete
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Fires when user clicks retry button, when invalid
 *
 * @event FileTile:retry
 * @since 0.12.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-file-tile>` element.
 *
 * @emits FileTile:cancel
 * @emits FileTile:delete
 * @emits FileTile:retry
 * @extends HXElement
 * @hideconstructor
 * @since 0.12.0
 */
class HXFileTileElement extends HXElement {
    static get is () {
        return 'hx-file-tile';
    }

    static get template () {
        return `<style>${shadowStyles$a}</style>${shadowMarkup$a}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
        this._onRetry = this._onRetry.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('details');
        this.$upgradeProperty('href');
        this.$upgradeProperty('icon');
        this.$upgradeProperty('name');
        this.$upgradeProperty('progress');
        this.$upgradeProperty('readonly');

        this._btnDismiss.addEventListener('click', this._onDismiss);
        this._btnRetry.addEventListener('click', this._onRetry);
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
        this._btnRetry.removeEventListener('click', this._onRetry);
    }

    static get $observedAttributes () {
        return [
            'details',
            'href',
            'icon',
            'name',
            'progress',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'details':
                this._elDetails.innerText = newVal;
                break;

            case 'href':
                this._attrHrefUpdate(oldVal, newVal);
                break;

            case 'icon':
                this._elIcon.type = newVal;
                break;

            case 'name':
                this._attrNameUpdate(oldVal, newVal);
                break;

            case 'progress':
                this._elProgress.value = newVal;
                break;
        }
    }

    /**
     * https://regex101.com/r/K8XCbn/2
     * @readonly
     * @type {String}
     */
    get extension () {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(this.name)[1] || '';
    }

    /**
     * If present, the dismiss will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get readonly () {
        return this.hasAttribute('readonly');
    }
    set readonly (value) {
        if (value) {
            this.setAttribute('readonly', '');
        } else {
            this.removeAttribute('readonly');
        }
    }

    /**
     * URL to download the file.
     *
     * @type {String}
     */
    get href () {
        return this.getAttribute('href');
    }
    set href (newVal) {
        if (newVal === null) {
            this.removeAttribute('href');
        } else {
            this.setAttribute('href', newVal);
        }
    }

    /**
     * Icon to appear within the empty file icon.
     * @type {String}
     */
    get icon () {
        return this.getAttribute('icon');
    }
    set icon (newVal) {
        this.setAttribute('icon', newVal);
    }

    /**
     * @default false
     * @readonly
     * @type {Boolean}
     */
    get loading () {
        return this.hasAttribute('progress');
    }

    /**
     * File name to display
     * @type {String}
     */
    get name () {
        return this.getAttribute('name') || '';
    }
    set name (newVal) {
        if (newVal === null) {
            this.removeAttribute('name');
        } else {
            this.setAttribute('name', newVal);
        }
    }

    /**
     * load progress of the file
     *
     * @type {Integer|Null}
     */
    get progress () {
        if (!this.loading) {
            return null;
        }

        let _strVal = this.getAttribute('progress');
        let _intVal = parseInt(_strVal) || 0;
        return _intVal;
    }
    set progress (newVal) {
        if (newVal === null) {
            this.removeAttribute('progress');
        } else {
            this.setAttribute('progress', newVal);
        }
    }

    /**
     * @default false
     * @readonly
     * @type {Boolean}
     */
    get truncated () {
        // to preserve start and end, name must exceed
        // twice the preserved character length
        if (this.name) {
            return this.name.length > (2 * PRE_TRUNC);
        } else {
            return false;
        }
    }

    /**
     * @default true
     * @type {Boolean}
     */
    get invalid () {
        return this.hasAttribute('invalid');
    }
    set invalid (newVal) {
        if (newVal) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    /**
     * Simulates clicking "X" (i.e., the dismiss button)
     */
    dismiss () {
        if (this.loading || this.invalid) {
            if (this.$emit('cancel')) {
                this.remove();
            }
        } else {
            if (this.$emit('delete')) {
                // only if event was not canceled by consumer
                this.remove();
            }
        }
    }

    /**
     * Simulates clicking the retry button
     */
    retry () {
        this.$emit('retry');
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }

    /** @private */
    get _btnRetry () {
        return this.shadowRoot.getElementById('hxRetry');
    }

    /** @private */
    get _elDetails () {
        return this.shadowRoot.getElementById('hxDetails');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elLink () {
        return this.shadowRoot.getElementById('hxLink');
    }

    /** @private */
    get _elName () {
        return this.shadowRoot.getElementById('hxName');
    }

    /** @private */
    get _elProgress () {
        return this.shadowRoot.getElementById('hxProgress');
    }

    /** @private */
    _attrHrefUpdate (oldVal, newVal) {
        if (newVal !== null) {
            this._elLink.href = newVal;
        } else {
            this._elLink.removeAttribute('href');
        }
    }

    /** @private */
    _attrNameUpdate (oldVal, newVal) {
        this._elIcon.extension = (this.extension !== '' ? this.extension : null);

        if (this.truncated) {
            this._renderName();
            this._elLink.setAttribute('title', this.name);
        } else {
            this._elName.innerText = this.name;
            this._elLink.removeAttribute('title');
        }

        if (newVal === null) {
            this._elLink.removeAttribute('download');
        } else {
            let _name = newVal.trim();
            if (_name === '') {
                this._elLink.removeAttribute('download');
            } else {
                this._elLink.download = _name;
            }
        }
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    _onRetry (evt) {
        evt.preventDefault();
        this.retry();
    }

    /** @private */
    _renderName () {
        let _name = this.name;
        this._elName.innerHTML = `
            <span>${_name.slice(0, -PRE_TRUNC)}</span>
            <span>${_name.slice(-PRE_TRUNC)}</span>
        `;
    }
}

var shadowMarkup$b = "<span id='hxIcon' aria-hidden='true'><svg xmlns='http://www.w3.org/2000/svg' focusable='false' viewBox='0 0 16 16'><path id='hxPath'></path></svg></span>";

var shadowStyles$b = ":host { background-color: transparent; color: currentColor; display: inline-block; flex-shrink: 0; height: 1em; width: 1em; }\n\n:host #hxIcon { box-sizing: border-box; display: block; flex-shrink: 0; height: 100%; line-height: 1; width: 100%; }\n\n:host #hxIcon svg { fill: currentColor; height: auto; stroke: none; vertical-align: bottom; }\n";

const DIV = document.createElement('div');

/**
 * Defines behavior for the `<hx-icon>` element.
 *
 * @extends HXElement
 * @since 0.1.0
 */
class HXIconElement extends HXElement {
    static get is () {
        return 'hx-icon';
    }

    static get template () {
        return `<style>${shadowStyles$b}</style>${shadowMarkup$b}`;
    }

    $onConnect () {
        this.$upgradeProperty('type');
    }

    static get $observedAttributes () {
        return [ 'type' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'type') {
            this._attrTypeChange(oldVal, newVal);
        }
    }

    /** @type {string} */
    get type () {
        return this.getAttribute('type');
    }

    /** @type {string} */
    set type (newVal) {
        this.setAttribute('type', newVal);
    }

    /**
     * This function is dependent on all SVG markup containing
     * a SINGLE `<path>` element.
     *
     * This is expected SVG markup.
     * ```html
     * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
     *   <path d="..." />
     * </svg>
     * ```
     *
     * The following markup is not supported, because there are two `<path>`
     * elements in the SVG document.
     * ```html
     * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
     *   <path d="..." />
     *   <path d="..." />
     * </svg>
     * ```
     *
     * The following markup isn't supported, but it may still work.
     * However, the file contains unnecessary markup, which will directly
     * affect the file size of generated JavaScript assets.
     * ```html
     * <svg
     *   xmlns="http://www.w3.org/2000/svg"
     *   xmlns:xlink="http://www.w3.org/1999/xlink"
     *   viewBox="0 0 16 16"
     * >
     *   <defs>
     *     <path id="icon-a" d="..."/>
     *   </defs>
     *   <g fill="none" fill-rule="evenodd">
     *     <use fill="#000" xlink:href="#account-a"/>
     *   </g>
     * </svg>
     * ```
     */
    _attrTypeChange (oldVal, newVal) {
        let d = '';
        if (newVal in MAP) {
            DIV.innerHTML = MAP[newVal];
            let path = DIV.querySelector('path');
            d = (path ? path.getAttribute('d') : '');
        }
        this._svgPath.setAttribute('d', d);
    }

    /** @private */
    get _svgPath () {
        return this.shadowRoot.getElementById('hxPath');
    }
}

/**
 * Fires when a positionable element is concealed.
 *
 * @event Revealable:close
 * @since 0.15.0
 * @type {CustomEvent}
 */

/**
 * Fires when a positionable element is revealed.
 *
 * @event Revealable:open
 * @since 0.15.0
 * @type {CustomEvent}
 */

/**
 * @description
 * Defines behavior for opening and closing an element.
 * @interface
 */
const Revealable = (superclass) => {
    /** @lends Revealable */
    class _Revealable extends superclass {
        /** @override */
        $onConnect () {
            super.$onConnect();

            this.$upgradeProperty('open');
            this.setAttribute('aria-hidden', !this.open);
        }

        /** @override */
        static get $observedAttributes () {
            let attrs = super.$observedAttributes;
            return attrs.concat([ 'open' ]);
        }
        /** @override */
        $onAttributeChange (attr, oldVal, newVal) {
            super.$onAttributeChange(attr, oldVal, newVal);

            if (attr === 'open') {
                let isOpen = (newVal !== null);
                this.setAttribute('aria-hidden', !isOpen);
                // TODO: Emit events only when setting the 'open' property.
                // - emit 'open' when open=true
                // - emit 'close' when open=false
                // - allow user to cancel the event, if desired
                // - ensure that Positionable is updated accordingly
                this.$emit(isOpen ? 'open' : 'close');
            }
        }

        /**
         * Determines if the element is revealed.
         *
         * @default false
         * @type {Boolean}
         */
        get open () {
            return this.hasAttribute('open');
        }
        set open (value) {
            if (value) {
                this.setAttribute('open', '');
            } else {
                this.removeAttribute('open');
            }
        }
    }

    return _Revealable;
};

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
const Positionable = (superclass) => {
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

class _ProtoClass extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-menu>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @since 0.2.0
 */
class HXMenuElement extends _ProtoClass {
    static get is () {
        return 'hx-menu';
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-start';
    }

    /** @override */
    $onConnect () {
        super.$onConnect();
        this.$defaultAttribute('role', 'menu');
        this.setAttribute('aria-expanded', this.open);
    }
}

/**
 * Defines behavior for the `<hx-menuitem>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXMenuitemElement extends HXElement {
    static get is () {
        return 'hx-menuitem';
    }

    $onConnect () {
        this.$defaultAttribute('role', 'menuitem');
    }
}

var shadowMarkup$c = "<div id='hxBackdrop'><div id='hxModal'><button type='button' id='hxClose'><hx-icon type='times'></hx-icon></button><div id='hxContent'><slot></slot></div></div></div>";

var shadowStyles$c = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxBackdrop { align-items: center; background-color: var(--hxBackdrop-backgroundColor, rgba(0, 0, 0, 0.6)); display: flex; flex-direction: column; height: 100%; justify-content: center; padding: 1.25rem; width: 100%; }\n\n#hxModal { background-color: var(--hxBackgroundColor, #ffffff); box-shadow: var(--hxBoxShadow, 0 7px 9px 0 rgba(0, 0, 0, 0.3)); display: flex; min-height: 3.5rem; min-width: 25rem; position: relative; }\n\n@supports (--modern: true) { #hxModal { min-height: 12.5rem; } }\n\n#hxContent { display: flex; flex-direction: column; overflow: hidden; width: 100%; }\n\n#hxClose { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; color: var(--hxClose-color, #757575); height: 1rem; position: absolute; right: 1.25rem; top: 1.25rem; }\n\n:host(.hxSm) #hxModal { max-width: 30rem; width: 40%; }\n\n:host #hxModal { max-width: 50rem; width: 60%; }\n\n:host(.hxLg) #hxModal { max-width: 70rem; width: 80%; }\n";

/**
 * Fires when the element is concealed.
 *
 * @event Modal:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element is revealed.
 *
 * @event Modal:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-modal>` element.
 *
 * @emits Modal:close
 * @emits Modal:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.1
 */
class HXModalElement extends HXElement {
    static get is () {
        return 'hx-modal';
    }

    static get template () {
        return `<style>${shadowStyles$c}</style>${shadowMarkup$c}`;
    }

    $onCreate () {
        this._onBtnClose = this._onBtnClose.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-hidden', !this.open);
        this._btnClose.addEventListener('click', this._onBtnClose);
    }

    $onDisconnect () {
        this._btnClose.removeEventListener('click', this._onBtnClose);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            this._changeAttrOpen(oldVal, newVal);
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    /** @private */
    get _btnClose () {
        return this.shadowRoot.getElementById('hxClose');
    }

    /** @private */
    _onBtnClose (evt) {
        evt.preventDefault();

        this.open = false;
    }

    /** @private */
    _onKeyUp (event) {
        if (event.keyCode === KEYS.Escape) {
            this.open = false;
        }
    }

    /** @private */
    _changeAttrOpen (oldVal, newVal) {
        if (newVal !== null) {
            this.$emit('open');
            this.setAttribute('aria-hidden', false);
            document.addEventListener('keyup', this._onKeyUp);
        } else {
            this.$emit('close');
            this.setAttribute('aria-hidden', true);
            document.removeEventListener('keyup', this._onKeyUp);
        }
    }
}

/**
 * Defines behavior for the `<hx-password-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.20.0
 */
class HXPasswordElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-password-control';
    }

    /**
     * Fetch the first `<input>` descendant,
     * whether implicit (`<input />`) or explicit
     * (`<input type="password" />`).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input:not([type]), input[type="password"]');
    }
}

var shadowMarkup$d = "<div id='hxPill'><span><slot></slot></span><button id='hxDismiss' type='button'><span><hx-icon type='times'></hx-icon></span></button></div>";

var shadowStyles$d = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n:host #hxPill { display: flex; height: 100%; padding: 0 1rem; white-space: nowrap; width: 100%; }\n\n:host #hxDismiss { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; align-items: center; color: var(--hxDismiss-color, #9e9e9e); display: inline-flex; justify-content: center; margin: 0 -0.5rem 0 0; width: 1.5em; }\n\n:host #hxDismiss > span { font-size: 0.75em; }\n\n:host #hxDismiss:hover { color: var(--hxDismiss-color--hover, #000000); }\n\n:host([persist]) #hxDismiss { display: none; }\n";

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Pills:dismiss
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-pill>` element.
 *
 * @extends HXElement
 * @emits Pills:dismiss
 * @hideconstructor
 * @since 0.8.0
 */
class HXPillElement extends HXElement {
    static get is () {
        return 'hx-pill';
    }

    static get template () {
        return `<style>${shadowStyles$d}</style>${shadowMarkup$d}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
    }

    $onConnect () {
        this._btnDismiss.addEventListener('click', this._onDismiss);
        this.$upgradeProperty('persist');
    }

    $onDisconnect () {
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    /**
     * Property reflecting the `persist` HTML attribute, indicating whether the
     * pill may be dismissed. If true, the dismiss button will not be shown.
     *
     * @default false
     * @type {Boolean}
     */
    get persist () {
        return this.hasAttribute('persist');
    }
    set persist (value) {
        if (value) {
            this.setAttribute('persist', '');
        } else {
            this.removeAttribute('persist');
        }
    }

    /**
     * Dismiss the pill (removes element from the DOM)
     */
    dismiss () {
        if (!this.persist && this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.remove();
        }
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }
}

var shadowMarkup$e = "<div id='hxPopover' class='has-arrow'><slot></slot></div>";

var shadowStyles$e = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n.has-arrow { margin: 0; position: relative; }\n\n.has-arrow::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0); z-index: -1; }\n\n.has-arrow::before, .has-arrow::after { content: \"\"; display: block; height: 13px; position: absolute; width: 13px; }\n\n.has-arrow[position^=\"top\"] { margin-bottom: 8px; }\n\n.has-arrow[position^=\"top\"]::before, .has-arrow[position^=\"top\"]::after { bottom: -8px; }\n\n.has-arrow[position^=\"top\"]::after { background-image: linear-gradient(to bottom left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"top\"]::before, .has-arrow[position=\"top-center\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top\"]::before, .has-arrow[position=\"top\"]::after, .has-arrow[position=\"top-center\"]::before, .has-arrow[position=\"top-center\"]::after { transform-origin: bottom left; transform: rotate(-45deg); left: 50%; }\n\n.has-arrow[position=\"top-right\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top-right\"]::before, .has-arrow[position=\"top-right\"]::after { transform-origin: bottom left; transform: rotate(-45deg); left: 1.25rem; }\n\n.has-arrow[position=\"top-left\"]::after { background-image: linear-gradient(to bottom right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"top-left\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top-left\"]::before, .has-arrow[position=\"top-left\"]::after { transform-origin: bottom right; transform: rotate(45deg); right: 1.25rem; }\n\n.has-arrow[position^=\"right\"] { margin-left: 8px; }\n\n.has-arrow[position^=\"right\"]::before, .has-arrow[position^=\"right\"]::after { left: -8px; }\n\n.has-arrow[position^=\"right\"]::after { background-image: linear-gradient(to top left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"right\"]::before, .has-arrow[position=\"right-middle\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right\"]::before, .has-arrow[position=\"right\"]::after, .has-arrow[position=\"right-middle\"]::before, .has-arrow[position=\"right-middle\"]::after { transform-origin: top left; transform: rotate(-45deg); top: 50%; }\n\n.has-arrow[position=\"right-bottom\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right-bottom\"]::before, .has-arrow[position=\"right-bottom\"]::after { transform-origin: top left; transform: rotate(-45deg); top: 1.25rem; }\n\n.has-arrow[position=\"right-top\"]::after { background-image: linear-gradient(to bottom left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"right-top\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right-top\"]::before, .has-arrow[position=\"right-top\"]::after { transform-origin: bottom left; transform: rotate(45deg); bottom: 1.25rem; }\n\n.has-arrow[position^=\"bottom\"] { margin-top: 8px; }\n\n.has-arrow[position^=\"bottom\"]::before, .has-arrow[position^=\"bottom\"]::after { top: -8px; }\n\n.has-arrow[position^=\"bottom\"]::after { background-image: linear-gradient(to top left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"bottom\"]::before, .has-arrow[position=\"bottom\"]::after, .has-arrow[position=\"bottom-center\"]::before, .has-arrow[position=\"bottom-center\"]::after { transform-origin: top left; transform: rotate(45deg); left: 50%; }\n\n.has-arrow[position=\"bottom-right\"]::before, .has-arrow[position=\"bottom-right\"]::after { transform-origin: top left; transform: rotate(45deg); left: 1.25rem; }\n\n.has-arrow[position=\"bottom-left\"]::after { background-image: linear-gradient(to top right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"bottom-left\"]::before, .has-arrow[position=\"bottom-left\"]::after { transform-origin: top right; transform: rotate(-45deg); right: 1.25rem; }\n\n.has-arrow[position^=\"left\"] { margin-right: 8px; }\n\n.has-arrow[position^=\"left\"]::before, .has-arrow[position^=\"left\"]::after { right: -8px; }\n\n.has-arrow[position^=\"left\"]::after { background-image: linear-gradient(to top right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"left\"]::before, .has-arrow[position=\"left-middle\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left\"]::before, .has-arrow[position=\"left\"]::after, .has-arrow[position=\"left-middle\"]::before, .has-arrow[position=\"left-middle\"]::after { transform-origin: top right; transform: rotate(45deg); top: 50%; }\n\n.has-arrow[position=\"left-bottom\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left-bottom\"]::before, .has-arrow[position=\"left-bottom\"]::after { transform-origin: top right; transform: rotate(45deg); top: 1.25rem; }\n\n.has-arrow[position=\"left-top\"]::after { background-image: linear-gradient(to bottom right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"left-top\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left-top\"]::before, .has-arrow[position=\"left-top\"]::after { transform-origin: bottom right; transform: rotate(-45deg); bottom: 1.25rem; }\n\n#hxPopover { background-color: var(--hxBackgroundColor, #ffffff); border-color: var(--hxBorderColor, #e0e0e0); border-style: solid; border-width: 1px; box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16); }\n";

class _ProtoClass$1 extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-popover>` element.
 *
 * @hideconstructor
 * @extends HXElement
 * @extends Positionable
 * @since 0.2.0
 */
class HXPopoverElement extends _ProtoClass$1 {
    static get is () {
        return 'hx-popover';
    }

    static get template () {
        return `<style>${shadowStyles$e}</style>${shadowMarkup$e}`;
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-right';
        this.POSITION_OFFSET = 20;
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxPopover');
    }

    /**
     * This position attribute is for the popover arrow located on the Shadow DOM element root.
     * 
     * @override
     * @param {NormalizedPositionString}
     */
    setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }
}

var shadowMarkup$f = "<div id='hxProgress'><div id='hxFill'></div></div>";

var shadowStyles$f = "#hxProgress { height: 100%; }\n\n#hxProgress #hxFill { background-color: currentColor; box-sizing: border-box; height: 100%; width: 0%; }\n";

const MIN = 0;
const MAX = 100;

/**
 * @private
 * @param {*} val - Value to coerce into an Integer
 * @returns {Integer} Integer value between hard-coded MIN and MAX
 */
function _parseValue (val) {
    // coerce into an Integer
    let safeVal = Math.round(Number(val) || MIN);
    // guard upper bound
    safeVal = safeVal > MAX ? MAX : safeVal;
    // guard lower bound
    safeVal = safeVal < MIN ? MIN : safeVal;

    return safeVal;
}

/**
 * Defines behavior for the `<hx-progress>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.7.0
 */
class HXProgressElement extends HXElement {
    static get is () {
        return 'hx-progress';
    }

    static get template () {
        return `<style>${shadowStyles$f}</style>${shadowMarkup$f}`;
    }

    $onConnect () {
        this.$upgradeProperty('value');
        this.$defaultAttribute('role', 'progressbar');
        this.$defaultAttribute('aria-valuemin', MIN);
        this.$defaultAttribute('aria-valuemax', MAX);
        this.value = this.value;
    }

    static get $observedAttributes () {
        return [ 'value' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'value') {
            let safeVal = _parseValue(newVal);
            this._elFill.style.width = `${safeVal}%`;
            this.setAttribute('aria-valuenow', safeVal);
        }
    }

    /**
     * Completion percentage
     * @type {Integer}
     */
    get value () {
        return _parseValue(this.getAttribute('value'));
    }
    set value (newVal) {
        let safeVal = _parseValue(newVal);
        this.setAttribute('value', safeVal);
    }

    /**
     * @private
     * @type {HTMLElement}
     */
    get _elFill () {
        return this.shadowRoot.getElementById('hxFill');
    }
}

/**
 * Defines behavior for the `<hx-radio-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXRadioControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-radio-control';
    }

    /**
     * Fetch the first `<input type="radio">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="radio"]');
    }
}

var shadowMarkup$g = "<!--\n  TODO: update with SVG to render the radio button\n  See: https://codepen.io/CITguy/pen/KEoBNZ for a prototype.\n--><slot></slot>";

var shadowStyles$g = "";

/**
 * Applies Shadow DOM to the `<hx-radio>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 */
class HXRadioElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-radio';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$g}</style>${shadowMarkup$g}`;
    }
}

/**
  * Defines behavior for the `<hx-radio-set>` element.
  *
  * @extends HXElement
  * @hideconstructor
  * @since 0.16.0
  */
class HXRadioSetElement extends HXElement {
    static get is () {
        return 'hx-radio-set';
    }

    $onConnect () {
        this.addEventListener('hxchange', this._onHxchange);
        this.addEventListener('hxdirty', this._onHxdirty);
        this.addEventListener('hxtouch', this._onHxtouch);
    }

    $onDisconnect () {
        this.removeEventListener('hxchange', this._onHxchange);
        this.removeEventListener('hxdirty', this._onHxdirty);
        this.removeEventListener('hxtouch', this._onHxtouch);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get isDirty () {
        return this.hasAttribute(STATE.dirty);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasChanged () {
        return this.hasAttribute(STATE.changed);
    }

    /**
     * @readonly
     * @type {Boolean} [false]
     */
    get wasTouched () {
        return this.hasAttribute(STATE.touched);
    }

    /** @private */
    _onHxchange (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.changed, '');
    }

    // TODO: revisit logic in phase 3
    /** @private */
    _onHxdirty (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.dirty, '');
    }

    /** @private */
    _onHxtouch (evt) {
        evt.stopPropagation();
        this.$defaultAttribute(STATE.touched, '');
    }
}

/**
 * Fires when the element's contents are concealed.
 *
 * @event Reveal:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Reveal:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-reveal>` element.
 *
 * @emits Reveal:close
 * @emits Reveal:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXRevealElement extends HXElement {
    static get is () {
        return 'hx-reveal';
    }

    $onConnect () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            let isOpen = (newVal !== null);
            this.setAttribute('aria-expanded', isOpen);
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    /**
     * Property reflecting the `open` HTML attribute, indicating whether or not
     * the element's contents should be shown.
     *
     * @default false
     * @type {Boolean}
     */
    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
    get open () {
        return this.hasAttribute('open');
    }
}

class _ProtoClass$2 extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-search-assistance>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @see HXSearchElement
 * @since 0.6.0
 */
class HXSearchAssistanceElement extends _ProtoClass$2 {
    static get is () {
        return 'hx-search-assistance';
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-start';
    }
}

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXSearchControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-search-control';
    }

    $onCreate () {
        this._onControlInput = this._onControlInput.bind(this);
        this._onResetClick = this._onResetClick.bind(this);
    }

    $onConnect () {
        this._showHideReset(this.controlElement);

        this._btnReset.addEventListener('click', this._onResetClick);
        this.controlElement.addEventListener('input', this._onControlInput);
        this.controlElement.addEventListener('change', this._onControlInput);
    }

    $onDisconnect () {
        this._btnReset.removeEventListener('click', this._onResetClick);
        this.controlElement.removeEventListener('input', this._onControlInput);
        this.controlElement.removeEventListener('change', this._onControlInput);
    }

    /**
     * Fetch the first `<input type="search">` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="search"]');
    }

    /** @private */
    get _btnReset () {
        return this.querySelector('button.hxClear');
    }

    /**
     * Show or hide reset based off of the input value.
     * @private
     */
    _onControlInput (evt) {
        this._showHideReset(evt.target);
    }

    /**
     * Clear value and focus input when user presses "X" via the UI.
     * @private
     */
    _onResetClick (evt) {
        evt.preventDefault();
        this.controlElement.value = '';
        this.controlElement.focus();
        this._btnReset.hidden = true;
    }

    /**
     * Determines whether to show/hide reset ONLY when the input is "enabled".
     * Light DOM CSS handles hiding the reset button when "disabled".
     * @private
     */
    _showHideReset (elInput) {
        let hasValue = (elInput.value !== '');
        this._btnReset.hidden = !hasValue;
    }
}

var shadowMarkup$h = "<div id='hxSearch'><hx-icon id='hxIcon' type='search'></hx-icon></div>";

var shadowStyles$h = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\ninput::-ms-clear { display: none; }\n\n:host #hxSearch { -ms-grid-column-align: start; -ms-grid-columns: 2rem 1fr; -ms-grid-rows: 1fr; align-items: center; display: -ms-grid; display: grid; grid-template-columns: 2rem 1fr; height: 100%; }\n\n:host #hxIcon { color: #757575; line-height: 1; margin: auto 0.5em; }\n";

/**
 * Defines behavior for the `<hx-search>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @see HXSearchAssistanceElement
 * @since 0.4.0
 */
class HXSearchElement extends HXElement {
    static get is () {
        return 'hx-search';
    }

    static get template () {
        return `<style>${shadowStyles$h}</style>${shadowMarkup$h}`;
    }
}

/**
 * Defines behavior for the `<hx-select-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXSelectControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-select-control';
    }

    /**
     * Fetch the first `<select>` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLSelectElement}
     */
    get controlElement () {
        return this.querySelector('select');
    }
}

var shadowMarkup$i = "<div id='hxSelect'><div id='hxTrigger'><hx-icon type='angle-down'></hx-icon></div></div>";

var shadowStyles$i = "#hxSelect { display: none; }\n\n@supports (display: grid) { #hxSelect { box-sizing: border-box; display: grid; grid-template-areas: \". trigger\"; grid-template-columns: auto 2.5rem; height: 100%; width: 100%; }\n  #hxTrigger { align-items: center; background-color: var(--hxTrigger-backgroundColor, #ffffff); box-sizing: border-box; color: inherit; display: flex; grid-area: trigger; height: 100%; justify-content: center; opacity: 1; } }\n";

/**
 * Applies Shadow DOM to the `<hx-select>` facade element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXSelectElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-select';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$i}</style>${shadowMarkup$i}`;
    }
}

/**
 * Defines behavior for the `<hx-switch-control>` element, which is the
 * controller for the `<hx-switch>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.24.0
 */
class HXSwitchControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-switch-control';
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.controlElement.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this.controlElement.removeEventListener('click', this._onClick);
    }

    /**
     * Fetch the first `<input type="checkbox">`
     * descendant (there should only be one(1)).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }

    /**
     * Get Switch Component state.
     *
     * @default false
     * @type {Boolean}
     */
    get toggled () {
        return this.switchElement.toggled;
    }

    /**
     * Fetch the first `<hx-switch>` deccendant (there should only be one(1)).
     *
     * @private
     */
    get switchElement () {
        return this.querySelector('hx-switch');
    }

    /** Determines the toggle state.
     *
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _onClick (evt) {
        let isChecked = this.controlElement.checked;

        if (isChecked) {
            this.switchElement.toggled = true;
        } else {
            this.switchElement.toggled = false;
        }
    }
}

var shadowMarkup$j = "<!-- TBD -->";

var shadowStyles$j = "";

/**
 * Defines behavior for the `<hx-switch>` element.
 * NOTE: `<hx-switch>` can have various default options, or it can be overriden.
 *
 *@extends HXElement
 * @hideconstructor
 * @since 0.24.0
 */
class HXSwitchElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-switch';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$j}</style>${shadowMarkup$j}`;
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
            }

            if (this.hasAttribute('onlabel') && on !== undefined) {
                this.setAttribute('onlabel', on);
            }
        }
    }
}

/**
 * Fires when non-current tab is clicked.
 *
 * @event Tab:hxtabclick
 * @since 0.16.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tab>` element.
 *
 * @emits Tab:hxtabclick
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXTabElement extends HXElement {
    static get is () {
        return 'hx-tab';
    }

    $onConnect () {
        this.$defaultAttribute('id', `tab-${generateId()}`);
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
        this.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'current' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current') {
            this.setAttribute('aria-selected', newVal !== null);
        }
    }

    /**
     * True if tab is selected.
     *
     * @type {Boolean}
     */
    get current () {
        return this.hasAttribute('current');
    }
    set current (newVal) {
        if (newVal) {
            this.setAttribute('current', true);
        } else {
            this.removeAttribute('current');
        }
    }

    /** @private */
    _onClick () {
        if (!this.current) {
            this.$emit('hxtabclick', { bubbles: true });
        }
    }
}

/**
 * Defines behavior for the `<hx-tabcontent>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXTabcontentElement extends HXElement {
    static get is () {
        return 'hx-tabcontent';
    }

    $onConnect () {
        this.$defaultAttribute('role', 'presentation');
        this.addEventListener('scroll', onScroll);
    }

    $onDisconnect () {
        this.removeEventListener('scroll', onScroll);
    }
}

/**
 * Defines behavior for the `<hx-tablist>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXTablistElement extends HXElement {
    static get is () {
        return 'hx-tablist';
    }

    $onConnect () {
        this.$defaultAttribute('role', 'tablist');
    }
}

/**
 * Fires when the element's contents are concealed.
 *
 * @event Tabpanel:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Tabpanel:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tabpanel>` element.
 *
 * @emits Tabpanel:close
 * @emits Tabpanel:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXTabpanelElement extends HXElement {
    static get is () {
        return 'hx-tabpanel';
    }

    $onConnect () {
        this.$defaultAttribute('id', `tabpanel-${generateId()}`);
        this.$defaultAttribute('role', 'tabpanel');
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
        this.addEventListener('scroll', onScroll);
    }

    $onDisconnect () {
        this.removeEventListener('scroll', onScroll);
    }

    static get $observedAttributes () {
        return [ 'open' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'open') {
            let isOpen = (newVal !== null);
            this.setAttribute('aria-expanded', isOpen);
            this.setAttribute('tabindex', (isOpen ? 0 : -1));
            this.$emit(isOpen ? 'open' : 'close');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
}

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
 * @listens Tab:hxtabclick
 * @since 0.2.0
 */
class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('id', `tabset-${generateId()}`);
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this._tablist.addEventListener('keyup', this._onKeyUp);
        this._tablist.addEventListener('keydown', preventKeyScroll);
        this.addEventListener('hxtabclick', this._onHxtabclick);
        this.update();
    }

    $onDisconnect () {
        this._tablist.removeEventListener('keyup', this._onKeyUp);
        this._tablist.removeEventListener('keydown', preventKeyScroll);
        this.removeEventListener('hxtabclick', this._onHxtabclick);
    }

    static get $observedAttributes () {
        return [ 'current-tab' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current-tab') {
            if (!isNaN(newVal)) {
                this._activateTab(Number(newVal));
                this.$emit('tabchange');
            }
        }
    }

    /* ---------- PUBLIC MEMBERS ---------- */

    /**
     * Zero-based index of the currently active tab.
     * @type {Number}
     */
    get currentTab () {
        return Number(this.getAttribute('current-tab') || 0);
    }
    set currentTab (idx) {
        // NOTE: Keep an eye on this logic for React compatibility
        if (!this.isConnected) {
            return;
        }

        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects a numeric index. Got ${typeof idx} instead.`);
        }
        if (this.tabs.length !== 0) {
            if (idx < 0 || idx >= this.tabs.length) {
                throw new RangeError('currentTab index is out of bounds');
            }
        }

        this._setupIds(); // account for dynamic tabs
        this.setAttribute('current-tab', idx);
    }

    /* ---------- PUBLIC METHODS ---------- */

    /**
     * All `<hx-tabpanel>` elements associated with the tabset.
     * @readonly
     * @type {HXTabpanelElement[]}
     */
    get tabpanels () {
        let _selector = `#${this.id} > hx-tabcontent > hx-tabpanel`;
        return Array.from(this.querySelectorAll(_selector));
    }

    /**
     * All `<hx-tab>` elements associated with the tabset.
     * @readonly
     * @type {HXTabElement[]}
     */
    get tabs () {
        this.$defaultAttribute('id', `tabset-${generateId()}`);  // accommodate Angular lifecycle

        let _selector = `#${this.id} > hx-tablist > hx-tab`;
        return Array.from(this.querySelectorAll(_selector));
    }

    /**
     * Select next tab in tabset.
     */
    selectNext () {
        if (!this.isConnected) {
            return;
        }

        // if current tab is the last tab
        if (this.currentTab === (this.tabs.length - 1)) {
            // select first
            this.currentTab = 0;
        } else {
            // select next
            this.currentTab += 1;
        }
        this.tabs[this.currentTab].focus();
    }

    /**
     * Select previous tab in tabset.
     */
    selectPrevious () {
        if (!this.isConnected) {
            return;
        }

        // if current tab is the first tab
        if (this.currentTab === 0) {
            // select last
            this.currentTab = (this.tabs.length - 1);
        } else {
            // select previous
            this.currentTab -= 1;
        }
        this.tabs[this.currentTab].focus();
    }

    /**
     * Synchronize DOM state with element configuration.
     * Useful for when the number of <hx-tab> and <hx-tabpanel>
     * elements changes after tabset connects to the DOM.
     */
    update () {
        this._setupIds();
        this._activateTab(this.currentTab);
    }

    /* ---------- PRIVATE PROPERTIES ---------- */

    /** @private */
    get _tablist () {
        return this.querySelector('hx-tablist');
    }

    /* ---------- PRIVATE METHODS ---------- */

    /** @private
     *
     * activates tab/panel pair with matching index
     * deactivates all other tab/panel pairs
    */
    _activateTab (idx) {
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

    /** @private */
    _onHxtabclick (evt) {
        evt.stopPropagation();
        let newIdx = this.tabs.indexOf(evt.target);

        if (newIdx === this.currentTab) {
            // update visual state if user clicks newly added tab
            // whose index matches the current tabset configuration
            this.update();
        } else {
            // otherwise, update logical state, which in turn
            // updates visual state
            this.currentTab = newIdx;
        }
    }

    /**
     * Handle navigating the tabs via arrow keys
     * @private
     * @todo migrate keyup listener logic to HXTablistElement
     */
    _onKeyUp (evt) {
        if (evt.keyCode === KEYS.Right) {
            this.selectNext();
        }

        if (evt.keyCode === KEYS.Left) {
            this.selectPrevious();
        }
    }

    /** @private */
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
            if (tabpanel !== undefined) {
                if (tabpanel.hasAttribute('id')) {
                    tabpanelId = tabpanel.getAttribute('id');
                } else {
                    tabpanel.setAttribute('id', tabpanelId);
                }

                // sync tabpanel to tab
                tabpanel.setAttribute('aria-labelledby', tabId);
                tab.setAttribute('aria-controls', tabpanelId);
            }
        });
    }
}

/**
 * Defines behavior for the `<hx-text-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXTextControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-text-control';
    }

    /**
     * Fetch the first text `<input>` descendant,
     * whether implicit (`<input />`) or explicit
     * (`<input type="text" />`).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input:not([type]), input[type="text"]');
    }
}

/**
 * Defines behavior for the `<hx-textarea-control>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 0.16.0
 */
class HXTextareaControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-textarea-control';
    }

    /**
     * Fetch the first text `<textarea>` descendant
     *
     * @override
     * @readonly
     * @type {?HTMLTextAreaElement}
     */
    get controlElement () {
        return this.querySelector('textarea');
    }
}

var shadowMarkup$k = "<div id='hxToast'><div id='hxIconWrapper'><hx-icon id='hxIcon' type='info-circle'></hx-icon></div><div id='hxContent'><div><slot></slot></div><button id='hxCta' type='button'></button></div><button id='hxDismiss' type='button'><hx-icon type='times'></hx-icon></button></div>";

var shadowStyles$k = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\nbutton { background-color: transparent; border: 0; color: inherit; cursor: pointer; display: inline-block; font: inherit; font-size: 0.875rem; font-weight: 700; line-height: 1; margin: 0; padding: 0; }\n\n#hxToast { padding: 0.75rem; display: flex; }\n\n#hxIconWrapper { align-items: center; color: var(--hxIcon-color, inherit); display: flex; margin: 0 0.75rem 0 0.5rem; }\n\n#hxIconWrapper hx-icon { font-size: 2rem; }\n\n#hxContent { flex-grow: 1; margin-right: 1.5rem; text-align: right; word-wrap: break-word; }\n\n#hxContent div { font-size: 0.875rem; text-align: left; }\n\n#hxCta { display: inline-flex; justify-content: center; font-size: 0.875rem; padding: 0.5rem 1rem; background-color: transparent; border: none; color: #367ed4; padding: 0; text-transform: uppercase; }\n\n#hxCta > * + * { margin-left: 0.5rem; }\n\n#hxCta:focus { outline: none; }\n\n#hxCta[disabled] { cursor: not-allowed; }\n\n#hxCta[disabled]:focus { box-shadow: none; }\n\n#hxCta.hxDeprecated { padding-left: 0; padding-right: 0; }\n\n#hxCta:hover { background-color: transparent; border-color: transparent; color: #0051b7; }\n\n#hxCta:active { background-color: transparent; border-color: transparent; color: #003482; }\n\n#hxCta:focus { background-color: transparent; border-color: transparent; color: #0051b7; outline: none; }\n\n#hxCta[disabled] { background-color: transparent; border-color: transparent; color: #bdbdbd; }\n\n#hxCta:empty { display: none; }\n\n#hxDismiss { color: var(--hxDismiss-color, #757575); flex-shrink: 0; font-size: 0.75rem; height: 2.25rem; padding: 0.75rem; position: absolute; right: 0; top: 0; width: 2.25rem; }\n\n:host([type=\"info\"]) #hxIconWrapper { color: var(--hxIcon-color, #95098a); }\n\n:host([type=\"error\"]) #hxIconWrapper { color: var(--hxIcon-color, #d6251f); }\n\n:host([type=\"success\"]) #hxIconWrapper { color: var(--hxIcon-color, #008b38); }\n";

const ICONS$1 = {
    'error': 'exclamation-circle',
    'info': 'info-circle',
    'success': 'checkmark',
};

/**
 * Fires when the dismiss button ("X") is pressed.
 *
 * @event Toast:dismiss
 * @since 0.7.0
 * @type {CustomEvent}
 */

/**
 * Fires when the CTA button is pressed.
 *
 * @event Toast:submit
 * @since 0.7.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-toast>` element.
 *
 * @emits Toast:dismiss
 * @emits Toast:submit
 * @extends HXElement
 * @hideconstructor
 * @since 0.7.0
 */
class HXToastElement extends HXElement {
    static get is () {
        return 'hx-toast';
    }

    static get template () {
        return `<style>${shadowStyles$k}</style>${shadowMarkup$k}`;
    }

    $onCreate () {
        this._onDismiss = this._onDismiss.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('cta');
        this.$upgradeProperty('type');

        this._btnCta.addEventListener('click', this._onSubmit);
        this._btnDismiss.addEventListener('click', this._onDismiss);
    }

    $onDisconnect () {
        this._btnCta.removeEventListener('click', this._onSubmit);
        this._btnDismiss.removeEventListener('click', this._onDismiss);
    }

    static get $observedAttributes () {
        return [ 'cta', 'type' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        let hasValue = (newVal !== null);
        switch (attr) {
            case 'cta':
                this._btnCta.textContent = (hasValue ? newVal : '');
                break;

            case 'type':
                if (hasValue) {
                    this._elIcon.type = (ICONS$1[newVal] || ICONS$1['info']);
                } else {
                    this._elIcon.type = ICONS$1['info'];
                }
                break;
        }
    }

    // GETTERS
    get cta () {
        return this.getAttribute('cta');
    }

    get type () {
        return this.getAttribute('type');
    }

    // SETTERS
    set cta (value) {
        if (value) {
            this.setAttribute('cta', value);
        } else {
            this.removeAttribute('cta');
        }
    }

    set type (value) {
        if (value) {
            this.setAttribute('type', value);
        } else {
            this.removeAttribute('type');
        }
    }

    /**
     * Dismiss the toast (removes element from the DOM).
     */
    dismiss () {
        if (this.$emit('dismiss')) {
            // only if event was not canceled by consumer
            this.remove();
        }
    }

    /**
     * Simulate a mouse click on the CTA button.
     */
    submit () {
        this.$emit('submit');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _btnCta () {
        return this.shadowRoot.getElementById('hxCta');
    }

    /** @private */
    get _btnDismiss () {
        return this.shadowRoot.getElementById('hxDismiss');
    }

    /** @private */
    _onDismiss (evt) {
        evt.preventDefault();
        this.dismiss();
    }

    /** @private */
    _onSubmit (evt) {
        evt.preventDefault();
        this.submit();
    }
}

/**
 * Defines behavior for the `<hx-toggle-control>` element, which is the
 * controller for the `<hx-toggle>` element.
 *
 * @extends HXFormControlElement
 * @hideconstructor
 * @since 1.0.0
 */
class HXToggleControlElement extends HXFormControlElement {
    /** @override */
    static get is () {
        return 'hx-toggle-control';
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.controlElement.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this.controlElement.removeEventListener('click', this._onClick);
    }

    /**
     * Fetch the first `<input type="checkbox">`
     * descendant (there should only be one(1)).
     *
     * @override
     * @readonly
     * @type {?HTMLInputElement}
     */
    get controlElement () {
        return this.querySelector('input[type="checkbox"]');
    }

    /**
     * Fetch the first `<hx-toggle>` deccendant (there should only be one(1)).
     */
    get toggleElement () {
        return this.querySelector('hx-toggle');
    }

    /**
     * Get the Toggle Component state.
     *
     * @default false
     * @type {Boolean}
     */
    get toggled () {
        return this.toggleElement.toggled;
    }

    /** Determines the toggle state.
     *
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _onClick (evt) {
        let isChecked = this.controlElement.checked;

        if (isChecked) {
            this.toggleElement.toggled = true;
        } else {
            this.toggleElement.toggled = false;
        }
    }
}

var shadowMarkup$l = "<div id='hxToggle'><div id='hxToggleGrid'><hx-icon type='grid'></hx-icon></div><div id='hxToggleList'><hx-icon type='list'></hx-icon></div></div>";

var shadowStyles$l = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n#hxToggleList { margin-left: 2.5rem; margin-top: 0.38rem; color: #003482; }\n\n#hxToggleList:hover { color: #367ed4; }\n\n#hxToggleGrid { position: absolute; margin-left: 0.5rem; color: #ffffff; }\n\n#hxToggleGrid:hover { color: #367ed4; }\n\n:host([toggled]) #hxToggleList { color: #ffffff; }\n\n:host([toggled]) #hxToggleList:hover { color: #367ed4; }\n\n:host([toggled]) #hxToggleGrid { color: #003482; }\n\n:host([toggled]) #hxToggleGrid:hover { color: #367ed4; }\n";

/**
 * Defines behavior for the `<hx-toggle>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 1.0.0
 */
class HXToggleElement extends HXElement {
    /** @override */
    static get is () {
        return 'hx-toggle';
    }

    /** @override */
    static get template () {
        return `<style>${shadowStyles$l}</style>${shadowMarkup$l}`;
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

var shadowMarkup$m = "<div id='hxTooltip' class='has-arrow'><slot></slot></div>";

var shadowStyles$m = "*, *::before, *::after { box-sizing: border-box; color: inherit; font: inherit; letter-spacing: inherit; }\n\n.has-arrow { margin: 0; position: relative; }\n\n.has-arrow::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0); z-index: -1; }\n\n.has-arrow::before, .has-arrow::after { content: \"\"; display: block; height: 13px; position: absolute; width: 13px; }\n\n.has-arrow[position^=\"top\"] { margin-bottom: 8px; }\n\n.has-arrow[position^=\"top\"]::before, .has-arrow[position^=\"top\"]::after { bottom: -8px; }\n\n.has-arrow[position^=\"top\"]::after { background-image: linear-gradient(to bottom left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"top\"]::before, .has-arrow[position=\"top-center\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top\"]::before, .has-arrow[position=\"top\"]::after, .has-arrow[position=\"top-center\"]::before, .has-arrow[position=\"top-center\"]::after { transform-origin: bottom left; transform: rotate(-45deg); left: 50%; }\n\n.has-arrow[position=\"top-right\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top-right\"]::before, .has-arrow[position=\"top-right\"]::after { transform-origin: bottom left; transform: rotate(-45deg); left: 1.25rem; }\n\n.has-arrow[position=\"top-left\"]::after { background-image: linear-gradient(to bottom right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"top-left\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"top-left\"]::before, .has-arrow[position=\"top-left\"]::after { transform-origin: bottom right; transform: rotate(45deg); right: 1.25rem; }\n\n.has-arrow[position^=\"right\"] { margin-left: 8px; }\n\n.has-arrow[position^=\"right\"]::before, .has-arrow[position^=\"right\"]::after { left: -8px; }\n\n.has-arrow[position^=\"right\"]::after { background-image: linear-gradient(to top left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"right\"]::before, .has-arrow[position=\"right-middle\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right\"]::before, .has-arrow[position=\"right\"]::after, .has-arrow[position=\"right-middle\"]::before, .has-arrow[position=\"right-middle\"]::after { transform-origin: top left; transform: rotate(-45deg); top: 50%; }\n\n.has-arrow[position=\"right-bottom\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right-bottom\"]::before, .has-arrow[position=\"right-bottom\"]::after { transform-origin: top left; transform: rotate(-45deg); top: 1.25rem; }\n\n.has-arrow[position=\"right-top\"]::after { background-image: linear-gradient(to bottom left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"right-top\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"right-top\"]::before, .has-arrow[position=\"right-top\"]::after { transform-origin: bottom left; transform: rotate(45deg); bottom: 1.25rem; }\n\n.has-arrow[position^=\"bottom\"] { margin-top: 8px; }\n\n.has-arrow[position^=\"bottom\"]::before, .has-arrow[position^=\"bottom\"]::after { top: -8px; }\n\n.has-arrow[position^=\"bottom\"]::after { background-image: linear-gradient(to top left, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"bottom\"]::before, .has-arrow[position=\"bottom\"]::after, .has-arrow[position=\"bottom-center\"]::before, .has-arrow[position=\"bottom-center\"]::after { transform-origin: top left; transform: rotate(45deg); left: 50%; }\n\n.has-arrow[position=\"bottom-right\"]::before, .has-arrow[position=\"bottom-right\"]::after { transform-origin: top left; transform: rotate(45deg); left: 1.25rem; }\n\n.has-arrow[position=\"bottom-left\"]::after { background-image: linear-gradient(to top right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"bottom-left\"]::before, .has-arrow[position=\"bottom-left\"]::after { transform-origin: top right; transform: rotate(-45deg); right: 1.25rem; }\n\n.has-arrow[position^=\"left\"] { margin-right: 8px; }\n\n.has-arrow[position^=\"left\"]::before, .has-arrow[position^=\"left\"]::after { right: -8px; }\n\n.has-arrow[position^=\"left\"]::after { background-image: linear-gradient(to top right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"left\"]::before, .has-arrow[position=\"left-middle\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left\"]::before, .has-arrow[position=\"left\"]::after, .has-arrow[position=\"left-middle\"]::before, .has-arrow[position=\"left-middle\"]::after { transform-origin: top right; transform: rotate(45deg); top: 50%; }\n\n.has-arrow[position=\"left-bottom\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), 3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left-bottom\"]::before, .has-arrow[position=\"left-bottom\"]::after { transform-origin: top right; transform: rotate(45deg); top: 1.25rem; }\n\n.has-arrow[position=\"left-top\"]::after { background-image: linear-gradient(to bottom right, transparent 50%, var(--hxBackgroundColor, #ffffff) 50%); }\n\n.has-arrow[position=\"left-top\"]::before { box-shadow: 0 0 0 1px var(--hxBorderColor, #e0e0e0), -3px 3px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.has-arrow[position=\"left-top\"]::before, .has-arrow[position=\"left-top\"]::after { transform-origin: bottom right; transform: rotate(-45deg); bottom: 1.25rem; }\n\n#hxTooltip { background-color: var(--hxBackgroundColor, #ffffff); border-color: var(--hxBorderColor, #e0e0e0); border-radius: 2px; border-style: solid; border-width: 1px; box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16); padding: 0.75rem; }\n";

const TOOLTIP_DELAY = 500;

class _ProtoClass$3 extends mix(HXElement, Positionable) {}

/**
 * Defines behavior for the `<hx-tooltip>` element.
 *
 * @extends HXElement
 * @extends Positionable
 * @hideconstructor
 * @since 0.2.0
 */
class HXTooltipElement extends _ProtoClass$3 {
    static get is () {
        return 'hx-tooltip';
    }

    static get template () {
        return `<style>${shadowStyles$m}</style>${shadowMarkup$m}`;
    }

    /** @override */
    $onCreate () {
        super.$onCreate();

        // overrides Positionable default
        this.DEFAULT_POSITION = 'top-center';
        this.POSITION_OFFSET = 20;

        this.$onConnect = defer(this.$onConnect);
        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlFocus = this._onCtrlFocus.bind(this);
        this._onCtrlMouseEnter = this._onCtrlMouseEnter.bind(this);
        this._onCtrlMouseLeave = this._onCtrlMouseLeave.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._isHovering = false;
    }

    /** @override */
    $onConnect () {
        super.$onConnect();

        this.$upgradeProperty('htmlFor');

        // TODO: What if 'id' is blank?
        this.$defaultAttribute('id', `tip-${generateId()}`);
        this.$defaultAttribute('role', 'tooltip');

        this._connectToControl();
    }

    /** @override */
    $onDisconnect () {
        super.$onDisconnect();

        this._detachListeners();
    }

    /** @override */
    static get $observedAttributes () {
        return super.$observedAttributes.concat([ 'for' ]);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        if (attr === 'for') {
            this._connectToControl();
        }
    }

    /**
     * External element that controls tooltip visibility.
     *
     * Returns the first element with an "id" matching the tooltip's "htmlFor" value.
     *
     * @readonly
     * @returns {HTMLElement|undefined}
     */
    get controlElement () {
        if (this.isConnected) {
            return this.getRootNode().querySelector(`[id="${this.htmlFor}"]`);
        }
    }

    /**
     * ID of alternate control element
     *
     * @type {string}
     */
    get htmlFor () {
        return this.getAttribute('for');
    }
    set htmlFor (value) {
        this.setAttribute('for', value);
    }

    /**
     * @override
     * @param {NormalizedPositionString}
     */
    setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxTooltip');
    }

    /**
     * True, if controlElement is the active element.
     * @private
     * @type {boolean}
     */
    get _isCtrlFocused () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return false;
        }

        return (this.getRootNode().activeElement === ctrl);
    }

    /** @private */
    _attachListeners () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.addEventListener('blur', this._onCtrlBlur);
        ctrl.addEventListener('focus', this._onCtrlFocus);
        ctrl.addEventListener('mouseenter', this._onCtrlMouseEnter);
        ctrl.addEventListener('mouseleave', this._onCtrlMouseLeave);
    }

    /** @private */
    _connectToControl () {
        if (this.controlElement) {
            // detach listeners from old control element
            this._detachListeners();

            // re-memoize control element
            delete this._controlElement;
            this._controlElement = this.controlElement;

            this._makeControlAccessible();

            // attach listeners to new control element
            this._attachListeners();
        }
    }

    /**
     * Remove all possible event listeners from the control element.
     *
     * @private
     */
    _detachListeners () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.removeEventListener('blur', this._onCtrlBlur);
        ctrl.removeEventListener('focus', this._onCtrlFocus);
        ctrl.removeEventListener('keyup', this._onKeyUp);
        ctrl.removeEventListener('mouseenter', this._onCtrlMouseEnter);
        ctrl.removeEventListener('mouseleave', this._onCtrlMouseLeave);
    }

    /**
     * Hide tooltip after delay
     *
     * @private
     */
    _hide () {
        // cancel SHOW
        clearTimeout(this._showTimeout);

        if (this.open && !this._isCtrlFocused) {
            // clear old timeout (if it exists)
            clearTimeout(this._hideTimeout);

            // schedule HIDE
            this._hideTimeout = setTimeout(() => {
                this.open = false;
            }, TOOLTIP_DELAY);
        }
    }

    /** @private */
    _makeControlAccessible () {
        let ctrl = this._controlElement;

        if (!ctrl) {
            return;
        }

        ctrl.setAttribute('aria-describedby', this.id);

        // FIXME: broken in MS browsers (https://goo.gl/dgyTrz)
        if (ctrl.tabIndex < 0) {
            ctrl.tabIndex = 0;
        }
    }

    /**
     * Handle 'blur' event on control element.
     *
     * @a11y keyboard interaction
     * @private
     */
    _onCtrlBlur () {
        this.controlElement.removeEventListener('keyup', this._onKeyUp);

        if (!this._isHovering) {
            this._hide();
        }
    }

    /**
     * Handle 'focus' on control element
     *
     * @a11y keyboard interaction
     * @a11y mouse interaction (click)
     * @private
     */
    _onCtrlFocus () {
        this.controlElement.addEventListener('keyup', this._onKeyUp);

        this._show();
    }

    /**
     * Handle 'mouseenter' on control element
     *
     * @a11y mouse interaction
     * @private
     */
    _onCtrlMouseEnter () {
        this._isHovering = true;

        this._show();
    }

    /**
     * Handle 'mouseleave' on control element
     *
     * @a11y mouse interaction
     * @private
     */
    _onCtrlMouseLeave () {
        this._isHovering = false;

        if (!this._isCtrlFocused) {
            this._hide();
        }
    }

    /**
     * Handle pressing 'Esc' key when focused.
     *
     * @a11y keyboard interaction
     * @private
     */
    _onKeyUp (event) {
        if (this.open && event.keyCode === KEYS.Escape) {
            // Prevents calling ESC handlers further up in the DOM.
            // (e.g. Modal esc-to-close)
            event.stopPropagation();

            if (!this._isHovering) {
                this.open = false;
            }
        }
    }

    /**
     * Show Tooltip after delay
     *
     * @private
     */
    _show () {
        // cancel HIDE
        clearTimeout(this._hideTimeout);

        if (!this.open) {
            // clear old timeout (if it exists)
            clearTimeout(this._showTimeout);

            // schedule SHOW
            this._showTimeout = setTimeout(() => {
                this.open = true;
            }, TOOLTIP_DELAY);
        }
    }
}



var Elements = /*#__PURE__*/Object.freeze({
    __proto__: null,
    HXAccordionElement: HXAccordionElement,
    HXAccordionPanelElement: HXAccordionPanelElement,
    HXAlertElement: HXAlertElement,
    HXBeaconElement: HXBeaconElement,
    HXBusyElement: HXBusyElement,
    HXCheckboxControlElement: HXCheckboxControlElement,
    HXCheckboxElement: HXCheckboxElement,
    HXCheckboxSetElement: HXCheckboxSetElement,
    HXDisclosureElement: HXDisclosureElement,
    HXDivElement: HXDivElement,
    HXDrawerElement: HXDrawerElement,
    HXDropFenceElement: HXDropFenceElement,
    HXDropZoneElement: HXDropZoneElement,
    HXEmailControl: HXEmailControl,
    HXErrorElement: HXErrorElement,
    HXFileControlElement: HXFileControlElement,
    HXFileIconElement: HXFileIconElement,
    HXFileInputElement: HXFileInputElement,
    HXFileTileElement: HXFileTileElement,
    HXIconElement: HXIconElement,
    HXMenuElement: HXMenuElement,
    HXMenuitemElement: HXMenuitemElement,
    HXModalElement: HXModalElement,
    HXPasswordElement: HXPasswordElement,
    HXPillElement: HXPillElement,
    HXPopoverElement: HXPopoverElement,
    HXProgressElement: HXProgressElement,
    HXRadioControlElement: HXRadioControlElement,
    HXRadioElement: HXRadioElement,
    HXRadioSetElement: HXRadioSetElement,
    HXRevealElement: HXRevealElement,
    HXSearchAssistanceElement: HXSearchAssistanceElement,
    HXSearchControlElement: HXSearchControlElement,
    HXSearchElement: HXSearchElement,
    HXSelectControlElement: HXSelectControlElement,
    HXSelectElement: HXSelectElement,
    HXSwitchControlElement: HXSwitchControlElement,
    HXSwitchElement: HXSwitchElement,
    HXTabElement: HXTabElement,
    HXTabcontentElement: HXTabcontentElement,
    HXTablistElement: HXTablistElement,
    HXTabpanelElement: HXTabpanelElement,
    HXTabsetElement: HXTabsetElement,
    HXTextControlElement: HXTextControlElement,
    HXTextareaControlElement: HXTextareaControlElement,
    HXToastElement: HXToastElement,
    HXToggleControlElement: HXToggleControlElement,
    HXToggleElement: HXToggleElement,
    HXTooltipElement: HXTooltipElement
});

var version = "2.4.0-rc.0";

/** @module HelixUI */

const { waitForWebComponents: waitForWebComponents$1 } = Utils;

/**
 * @external CustomEvent
 * @description Constructor polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [CustomEvent()](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
 */

/**
 * @external Element
 * @description
 * - MDN: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
 */

/**
 * @external Event
 * @description Constructor polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [Event()](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
 */

/**
 * @external HTMLElement
 * @extends external:Element
 * @description
 * Every custom element must directly or indirectly extend this base class.
 *
 * - MDN: [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
 */

/**
 * @external HTMLTemplateElement
 * @extends external:HTMLElement
 * @description Polyfilled by [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).
 *
 * - MDN: [HTMLTemplateElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement)
 */

/*
 * Register element definitions with the Custom Element registry.
 */
function _defineElements () {
    for (let element in Elements) {
        Elements[element].$define();
    }
}

/**
 * @description
 * Initialize HelixUI when polyfills are ready.
 *
 * @example <caption>No Arugments (backward-compatible behavior)</caption>
 * function start () {
 *   // continue...
 * }
 * HelixUI.initialize();
 * start();
 *
 *
 * @example <caption>Then-able</caption>
 * function start () {
 *   // continue...
 * }
 * HelixUI.initialize().then(start);
 *
 *
 * @example <caption>Async/Await</caption>
 * function start () {
 *   // continue...
 * }
 *
 * async function load () {
 *   await HelixUI.initialize();
 *   start();
 * }
 *
 * load();
 *
 * @returns {Promise}
 */
function initialize () {
    return waitForWebComponents$1()
        .then(_defineElements);
}

var HelixUI = /*#__PURE__*/Object.freeze({
    __proto__: null,
    initialize: initialize,
    Elements: Elements,
    Utils: Utils,
    VERSION: version
});

export default HelixUI;
