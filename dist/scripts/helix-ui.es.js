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
            if (window.ShadyCSS) {
                ShadyCSS.styleElement(this);
            }
            this.shadowRoot.appendChild(_template.content.cloneNode(true));
        }
    }//_$setupShadowDOM()
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

    // COLLIDE TOP
    // 'top-*' -> 'bottom-*' (CHANGE)
    // '{H}-top' -> '{H}-bottom' (CHANGE)
    // 'bottom-*' -> 'bottom-*' (no change)
    // '{H}-bottom' -> '{H}-bottom' (no change)
    // '{H}-start|middle|end' -> '{H}-start|middle|end' (no change)
    if (collides.top && yAlign === 'top') {
        position = invertPositionVertically(position);
    }

    // COLLIDE BOTTOM
    // 'bottom-*' -> 'top-*' (CHANGE)
    // '{H}-bottom' -> '{H}-top' (CHANGE)
    // 'top-*' -> 'top-*' (no change)
    // '{H}-top' -> '{H}-top' (no change)
    // '{H}-start|middle|end' -> '{H}-start|middle|end' (no change)
    if (collides.bottom && yAlign === 'bottom') {
        position = invertPositionVertically(position);
    }

    // COLLIDE LEFT
    // 'left-*' -> 'right-*' (CHANGE)
    // '{V}-left' -> '{V}-right' (CHANGE)
    // 'right-*' -> 'right-*' (no change)
    // '{V}-right' -> '{V}-right' (no change)
    // '{V}-start|center|end' -> '{V}-start|center|end' (no change)
    if (collides.left && xAlign === 'left') {
        position = invertPositionHorizontally(position);
    }

    // COLLIDE RIGHT
    // 'right-*' -> 'left-*' (CHANGE)
    // '{V}-right' -> '{V}-left' (CHANGE)
    // 'left-*' -> 'left-*' (no change)
    // '{V}-left' -> '{V}-left' (no change)
    // '{V}-start|center|end' -> '{V}-start|center|end' (no change)
    if (collides.right && xAlign === 'right') {
        position = invertPositionHorizontally(position);
    }

    // TODO: What if both sides of an axis collide?
    // e.g., both left/right or top/bottom collide

    return position;
}

var Alignment = {
    getAlignment,
    getCrossAxis,
    getHorizontalAlignment,
    getMainAxis,
    getVerticalAlignment,
    invertPositionHorizontally,
    invertPositionVertically,
    normalizePosition,
    optimizePositionForCollisions,
};

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

var Offset = {
    getBottom,
    getBottomEnd,
    getBottomLeft,
    getBottomRight,
    getBottomStart,
    getCenter,
    getLeft,
    getLeftBottom,
    getLeftEnd,
    getLeftStart,
    getLeftTop,
    getRight,
    getRightBottom,
    getRightEnd,
    getRightStart,
    getTop,
    getTopEnd,
    getTopLeft,
    getTopRight,
    getTopStart,
    offsetFunctionMap,
};

/**
 * @module HelixUI/Utils
 */

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

// Not everything needs to be part of the default export
var index = {
    Alignment,
    KEYS,
    Offset,
    defer,
    generateId,
    mix,
    onScroll,
    preventKeyScroll,
    replaceWith,
};

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
    _openPanel (index$$1) {
        if (this._isNavigable) {
            this.panels.forEach((panel, idx) => {
                if (Number(index$$1) === idx) {
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

var shadowStyles = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxToggle {\n  background-color: transparent;\n  border: 0;\n  cursor: pointer;\n  padding: 0;\n  text-align: left;\n  width: 100%;\n}\n#hxToggle[aria-expanded=\"true\"] .header__icon {\n  transform: scaleY(-1);\n}\n#hxToggle[disabled] {\n  cursor: not-allowed;\n}\n.header {\n  align-items: center;\n  display: flex;\n}\n.header__content {\n  flex-shrink: 0;\n  flex-grow: 1;\n}\n.header__icon {\n  flex-shrink: 0;\n  margin-left: 0.5rem;\n}\n#hxBody {\n  display: none;\n}\n#hxBody[aria-expanded=\"true\"] {\n  display: block;\n}\n";

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

var shadowStyles$1 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxAlert {\n  display: flex;\n}\nbutton {\n  align-self: flex-start;\n  background-color: transparent;\n  border: 0;\n  cursor: pointer;\n}\n#hxIconWrapper {\n  flex-shrink: 0;\n  padding: 1rem;\n}\n#hxContent {\n  flex-grow: 1;\n  margin-right: 1rem;\n  padding: 1rem 0;\n}\n#hxStatus {\n  float: left;\n  font-weight: 500;\n  margin-right: 0.25rem;\n  text-transform: uppercase;\n}\n#hxStatus:after {\n  content: \":\";\n}\n#hxStatus:empty {\n  display: none;\n}\n#hxCta {\n  flex-shrink: 0;\n  font-weight: 500;\n  padding: 1rem 0;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n#hxCta:empty {\n  display: none;\n}\n#hxDismiss {\n  flex-shrink: 0;\n  height: 3rem;\n  padding: 1rem;\n  width: 3rem;\n}\n:host([persist]) #hxDismiss {\n  display: none;\n}\n:host([persist]) #hxCta {\n  margin-right: 1rem;\n}\n";

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

    static get template () {
        return '';
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

var shadowMarkup$2 = "<label id='hxCheckbox'><input type='checkbox' id='hxNativeControl'><div id='hxCustomControl'><hx-icon type='checkmark' id='hxTick'></hx-icon><hx-icon type='minus' id='hxMinus'></hx-icon></div></label>";

var shadowStyles$2 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxCheckbox {\n  display: flex;\n  height: 100%;\n  position: relative;\n  width: 100%;\n}\n#hxCustomControl {\n  align-content: center;\n  align-items: center;\n  background-color: #ffffff;\n  border: 1px solid currentColor;\n  border-radius: 2px;\n  color: #bdbdbd;\n  display: flex;\n  font-size: 0.625rem;\n  /* ~10px */\n  height: 100%;\n  justify-content: center;\n  left: 0;\n  position: absolute;\n  top: 0;\n  vertical-align: middle;\n  width: 100%;\n  z-index: 10;\n  /* icons */\n}\n#hxCustomControl:hover {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n#hxCustomControl #hxMinus,\n#hxCustomControl #hxTick {\n  display: none;\n  height: 1em;\n  line-height: 1;\n  width: 1em;\n}\n#hxNativeControl:checked:not(:indeterminate) ~ #hxCustomControl #hxTick {\n  display: block;\n}\n#hxNativeControl:indeterminate ~ #hxCustomControl #hxMinus {\n  display: block;\n}\n#hxNativeControl {\n  /* opacity 0 because Firefox and OS focus styles */\n  opacity: 0;\n  z-index: 0;\n  /* default checked and indeterminate (checked or unchecked) */\n  /* disabled unchecked */\n}\n#hxNativeControl:focus {\n  border: none;\n  outline: none;\n}\n#hxNativeControl:focus ~ #hxCustomControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n#hxNativeControl:checked ~ #hxCustomControl,\n#hxNativeControl:indeterminate ~ #hxCustomControl {\n  color: #0c7c84;\n}\n#hxNativeControl:checked ~ #hxCustomControl:hover,\n#hxNativeControl:indeterminate ~ #hxCustomControl:hover {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n#hxNativeControl:disabled ~ #hxCustomControl {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n  cursor: not-allowed;\n}\n#hxNativeControl:disabled ~ #hxCustomControl:hover {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n}\n/* invalid */\n:host([invalid]) {\n  /* below styles needed to override above, custom control styles */\n  /* invalid and checked or indeterminate */\n  /* invalid and disabled */\n}\n:host([invalid]) #hxCustomControl {\n  border-width: 2px;\n  color: #d32f2f;\n}\n:host([invalid]) #hxCustomControl:hover {\n  background-color: #ffcdd2;\n}\n:host([invalid]) #hxNativeControl:focus ~ #hxCustomControl {\n  border-color: #d32f2f;\n  box-shadow: 0 0 4px rgba(211, 47, 47, 0.5);\n}\n:host([invalid]) #hxNativeControl:checked ~ #hxCustomControl,\n:host([invalid]) #hxNativeControl:indeterminate ~ #hxCustomControl {\n  color: #d32f2f;\n}\n:host([invalid]) #hxNativeControl:checked ~ #hxCustomControl:hover,\n:host([invalid]) #hxNativeControl:indeterminate ~ #hxCustomControl:hover {\n  background-color: #ffcdd2;\n}\n:host([invalid]) #hxNativeControl:disabled ~ #hxCustomControl {\n  border-width: 1px;\n  color: #bdbdbd;\n}\n:host([invalid]) #hxNativeControl:disabled ~ #hxCustomControl:hover {\n  background-color: #eeeeee;\n}\n";

/**
 * Fires when the element's `checked` state changes
 *
 * @event Checkbox:change
 * @since 0.1.8
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-checkbox>` element.
 *
 * @emits Checkbox:change
 * @extends HXElement
 * @hideconstructor
 * @since 0.1.8
 */
class HXCheckboxElement extends HXElement {
    static get is () {
        return 'hx-checkbox';
    }

    static get template () {
        return `<style>${shadowStyles$2}</style>${shadowMarkup$2}`;
    }

    $onCreate () {
        this._onChange = this._onChange.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('checked');
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('indeterminate');
        this._chkInput.addEventListener('change', this._onChange);
    }

    $onDisconnect () {
        this._chkInput.removeEventListener('change', this._onChange);
    }

    static get $observedAttributes () {
        return [
            'checked',
            'disabled',
            'indeterminate',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);
        switch (attr) {
            case 'indeterminate':
                this._chkInput.indeterminate = hasValue;
                break;
            case 'checked':
                if (this._chkInput.checked !== hasValue) {
                    this._chkInput.checked = hasValue;
                }
                break;
            case 'disabled':
                this._chkInput.disabled = hasValue;
                break;
        }
    }

    /**
     * @default false
     * @type {Boolean}
     */
    get checked () {
        return this.hasAttribute('checked');
    }
    set checked (value) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    /**
     * Indicates if the state of the element cannot be determined.
     *
     * @default false
     * @type {Boolean}
     */
    get indeterminate () {
        return this.hasAttribute('indeterminate');
    }
    set indeterminate (value) {
        if (value) {
            this.setAttribute('indeterminate', '');
        } else {
            this.removeAttribute('indeterminate');
        }
    }

    /**
     * Pass-through function to native input.
     */
    click () {
        this._chkInput.click();
    }

    /** @private */
    _onChange (evt) {
        // Update internal state
        this.checked = evt.target.checked;

        // Prevent 'change' listeners from firing twice in polyfilled browsers.
        evt.stopImmediatePropagation();

        // Emit a new 'change' event from the custom element
        this.$emit('change');
    }

    /** @private */
    get _chkInput () {
        return this.shadowRoot.getElementById('hxNativeControl');
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
            default:
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

var shadowMarkup$3 = "<div id='hxDiv'><slot></slot></div>";

var shadowStyles$3 = "@supports (--skip-ie: true) {\n  :host {\n    --padding-base: 0;\n    --padding-top: var(--padding-base);\n    --padding-right: var(--padding-base);\n    --padding-bottom: var(--padding-base);\n    --padding-left: var(--padding-base);\n    --padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);\n  }\n  :host #hxDiv {\n    padding: var(--padding);\n  }\n}\n";

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
        return `<style>${shadowStyles$3}</style>${shadowMarkup$3}`;
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

var shadowMarkup$4 = "<div id='hxDropFence'><hx-file-icon type='paperclip'></hx-file-icon><div><slot></slot></div></div>";

var shadowStyles$4 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxDropFence {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  justify-content: center;\n  width: 100%;\n}\n#hxDropFence > div {\n  margin-top: 0.5rem;\n  max-width: 30rem;\n}\n";

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
        return `<style>${shadowStyles$4}</style>${shadowMarkup$4}`;
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

var shadowMarkup$5 = "<div id='hxError'><span><hx-icon type='exclamation-circle' id='hxIcon'></hx-icon></span><span><slot></slot></span></div>";

var shadowStyles$5 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxError {\n  display: inline-flex;\n}\n#hxError * + * {\n  margin-left: 0.25rem;\n}\n";

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
        return `<style>${shadowStyles$5}</style>${shadowMarkup$5}`;
    }
}

var shadowMarkup$6 = "<div id='hxFileIcon'><hx-icon type='file' id='hxBase'></hx-icon><div id='hxOverlay'><hx-icon id='hxIcon'></hx-icon><div id='hxExt'></div></div></div>";

var shadowStyles$6 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxFileIcon {\n  position: relative;\n}\n#hxFileIcon #hxBase {\n  font-size: 2.5rem;\n  height: 1em;\n}\n#hxFileIcon #hxOverlay {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  justify-content: center;\n  line-height: 1;\n  position: absolute;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n#hxFileIcon #hxIcon {\n  font-size: 1rem;\n  height: 1em;\n}\n#hxFileIcon #hxExt {\n  display: none;\n  font-size: 0.5rem;\n  line-height: 1.5;\n  margin-top: 1px;\n  text-transform: uppercase;\n}\n:host([extension]) #hxFileIcon #hxOverlay {\n  height: auto;\n  top: 0.5rem;\n}\n:host([extension]) #hxFileIcon #hxExt {\n  display: block;\n}\n";

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
        return `<style>${shadowStyles$6}</style>${shadowMarkup$6}`;
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

var shadowMarkup$7 = "<div id='hxFile'><div id='hxContent'><slot></slot></div><button id='hxButton' type='button'><hx-icon id='hxIcon'></hx-icon><span id='hxLabel'></span></button></div>";

var shadowStyles$7 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n:host #hxContent {\n  /*\n      Needed to prevent focusing of native file inputs.\n      Especially true for Microsoft browsers, because\n      Edge and IE have double tab stops.\n    */\n  display: none;\n}\n:host #hxButton {\n  background-color: transparent;\n  border: 0;\n  color: inherit;\n  cursor: pointer;\n  display: inline-block;\n  font: inherit;\n  font-weight: 500;\n  line-height: 1;\n  margin: 0;\n  padding: 0;\n  border-radius: 2px;\n  display: inline-flex;\n  justify-content: center;\n  border: 1px solid #0c7c84;\n  color: #0c7c84;\n  font-size: 0.875rem;\n  padding: 8px 12px;\n  width: 100%;\n}\n:host #hxButton > * + * {\n  margin-left: 0.5rem;\n}\n:host #hxButton:focus {\n  outline: none;\n}\n:host #hxButton[disabled] {\n  cursor: not-allowed;\n}\n:host #hxButton[disabled]:focus {\n  box-shadow: none;\n}\n:host #hxButton:hover {\n  background-color: #16b9d4;\n  border-color: transparent;\n  color: #ffffff;\n}\n:host #hxButton:active {\n  background-color: #0e94a6;\n  border-color: transparent;\n  color: #ffffff;\n}\n:host #hxButton:focus {\n  box-shadow: 0 0 4px 0 rgba(14, 148, 166, 0.5);\n}\n:host #hxButton[disabled] {\n  background-color: transparent;\n  border-color: #d8d8d8;\n  color: #d8d8d8;\n}\n:host #hxButton #hxLabel {\n  margin: 0;\n}\n:host #hxIcon {\n  display: none;\n}\n:host #hxLabel:empty {\n  display: none;\n}\n:host([icon]) #hxIcon {\n  display: inline-block;\n}\n:host([icon]) #hxButton #hxLabel {\n  margin-left: 0.5rem;\n}\n:host(.hxPrimary) #hxButton {\n  background-color: #0c7c84;\n  color: #ffffff;\n}\n:host(.hxPrimary) #hxButton:hover {\n  background-color: #16b9d4;\n  border-color: transparent;\n  color: #ffffff;\n}\n:host(.hxPrimary) #hxButton:active {\n  background-color: #0e94a6;\n  border-color: transparent;\n  color: #ffffff;\n}\n:host(.hxPrimary) #hxButton:focus {\n  box-shadow: 0 0 4px 0 rgba(14, 148, 166, 0.5);\n  outline: none;\n}\n:host(.hxPrimary) #hxButton[disabled] {\n  background-color: #d8d8d8;\n  border-color: transparent;\n  color: #757575;\n}\n:host(.hxTertiary) #hxButton {\n  background-color: transparent;\n  border: none;\n  color: #0c7c84;\n  padding-left: 0;\n  padding-right: 0;\n}\n:host(.hxTertiary) #hxButton:hover {\n  background-color: transparent;\n  border-color: transparent;\n  color: #16b9d4;\n}\n:host(.hxTertiary) #hxButton:active {\n  background-color: transparent;\n  border-color: transparent;\n  color: #0e94a6;\n}\n:host(.hxTertiary) #hxButton:focus {\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host(.hxTertiary) #hxButton[disabled] {\n  background-color: transparent;\n  border-color: transparent;\n  color: #d8d8d8;\n}\n";

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
        return `<style>${shadowStyles$7}</style>${shadowMarkup$7}`;
    }

    $onCreate () {
        this._onClick = this._onClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('icon');
        this.$upgradeProperty('label');
        this._elButton.addEventListener('click', this._onClick);
    }

    $onDisconnect () {
        this._elButton.removeEventListener('click', this._onClick);
    }

    static get $observedAttributes () {
        return [ 'icon', 'label' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'icon':
                this._elIcon.type = newVal;
                break;
            case 'label':
                this._elLabel.innerText = newVal;
                break;
        }
    }

    /**
     * @readonly
     * @type {HTMLInputElement}
     */
    get fileInput () {
        return this.querySelector('input[type="file"]');
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

    /**
     * Label to display within the file selector.
     * @type {String}
     */
    get label () {
        return this.getAttribute('label');
    }
    set label (newVal) {
        this.setAttribute('label', newVal);
    }

    /**
     * Simulate a mouse click on the element.
     */
    click () {
        if (this.fileInput) {
            this.fileInput.click();
        }
    }

    /** @private */
    get _elButton () {
        return this.shadowRoot.getElementById('hxButton');
    }

    /** @private */
    get _elIcon () {
        return this.shadowRoot.getElementById('hxIcon');
    }

    /** @private */
    get _elLabel () {
        return this.shadowRoot.getElementById('hxLabel');
    }

    /** @private */
    _onClick (evt) {
        evt.preventDefault();
        this.click();
    }
}

var shadowMarkup$8 = "<div id='hxFileTile'><a id='hxLink'><div id='hxIconWrapper'><hx-file-icon id='hxIcon'></hx-file-icon><hx-icon type='download'></hx-icon></div><div id='hxContentWrapper'><div id='hxName'></div><div id='hxState--downloadable'><div id='hxDetails'></div></div><div id='hxState--loading'><hx-progress id='hxProgress'></hx-progress></div><div id='hxState--invalid'><button id='hxRetry' type='button'>Retry<hx-icon type='redo'></hx-icon></button></div></div></a><button id='hxDismiss' type='button'><hx-icon type='times'></hx-icon></button></div>";

var shadowStyles$8 = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\na[href] {\n  background-color: transparent;\n  color: #0d74d1;\n  text-decoration: none;\n}\na[href]:hover,\na[href]:active {\n  color: #3391ff;\n  cursor: pointer;\n  text-decoration: none;\n}\nhx-progress {\n  display: block;\n  height: 0.5rem;\n}\nhx-progress {\n  background-color: #d8d8d8;\n  border-radius: 1em;\n  color: #16b9d4;\n  overflow: hidden;\n}\n:host button {\n  background-color: transparent;\n  border: 0;\n  color: inherit;\n  cursor: pointer;\n  display: inline-block;\n  font: inherit;\n  font-weight: 500;\n  line-height: 1;\n  margin: 0;\n  padding: 0;\n}\n:host #hxFileTile {\n  background-color: #f5f5f5;\n  border-radius: 2px;\n  border: 2px solid transparent;\n  color: #424242;\n  display: flex;\n  font-size: 0.875rem;\n  height: 100%;\n  width: 100%;\n}\n:host #hxRetry {\n  border-radius: 2px;\n  display: inline-flex;\n  justify-content: center;\n  padding: 0.125rem 0.5rem;\n  background-color: transparent;\n  border: none;\n  color: #0c7c84;\n  padding-left: 0;\n  padding-right: 0;\n}\n:host #hxRetry > * + * {\n  margin-left: 0.5rem;\n}\n:host #hxRetry:focus {\n  outline: none;\n}\n:host #hxRetry[disabled] {\n  cursor: not-allowed;\n}\n:host #hxRetry[disabled]:focus {\n  box-shadow: none;\n}\n:host #hxRetry:hover {\n  background-color: transparent;\n  border-color: transparent;\n  color: #16b9d4;\n}\n:host #hxRetry:active {\n  background-color: transparent;\n  border-color: transparent;\n  color: #0e94a6;\n}\n:host #hxRetry:focus {\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host #hxRetry[disabled] {\n  background-color: transparent;\n  border-color: transparent;\n  color: #d8d8d8;\n}\n:host #hxRetry hx-icon {\n  margin-left: 0.25rem !important;\n}\n:host #hxDismiss {\n  flex-shrink: 0;\n  font-size: 1rem;\n  line-height: 0;\n  padding: 0.5rem 0.75rem;\n}\n:host #hxDismiss:hover {\n  color: #16b9d4;\n}\n:host #hxDismiss:focus {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n  outline: 0;\n}\n:host #hxIconWrapper {\n  align-items: center;\n  display: flex;\n  flex: 0 0 48px;\n  height: 100%;\n  justify-content: center;\n  line-height: 0;\n  padding: 0.5rem 0 0.5rem 0.5rem;\n}\n:host #hxIconWrapper > hx-icon {\n  display: none;\n  font-size: 2rem;\n}\n:host #hxContentWrapper {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n  overflow: hidden;\n  padding: 0.5rem 0 0.5rem 0.5rem;\n}\n:host #hxName {\n  color: #0c7c84;\n  display: flex;\n  font-weight: 500;\n}\n:host #hxName > span {\n  white-space: pre;\n}\n:host #hxName > span:first-child {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n:host #hxName > span:last-child {\n  flex-shrink: 0;\n}\n:host #hxDetails {\n  font-weight: 300;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: pre;\n}\n:host #hxLink {\n  color: #424242;\n  display: flex;\n  flex-grow: 1;\n  overflow: hidden;\n}\n:host #hxLink[href]:hover {\n  color: #16b9d4;\n}\n:host #hxLink[href]:hover #hxIconWrapper > hx-file-icon {\n  display: none;\n}\n:host #hxLink[href]:hover #hxIconWrapper > hx-icon {\n  display: inline-block;\n}\n:host #hxLink[href]:hover #hxName {\n  color: inherit;\n}\n:host #hxLink:focus {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n  outline: 0;\n}\n:host #hxState--loading hx-progress {\n  display: inline-block;\n  width: 100%;\n}\n:host #hxState--loading,\n:host #hxState--invalid {\n  display: none;\n}\n:host([invalid]) #hxFileTile {\n  border-color: #d32f2f;\n}\n:host([invalid]) #hxIconWrapper,\n:host([invalid]) #hxName {\n  color: #6b6b6b;\n}\n:host([invalid]) #hxState--downloadable {\n  display: none;\n}\n:host([invalid]) #hxState--invalid {\n  display: block;\n}\n:host([progress]) #hxLink {\n  color: #9e9e9e;\n}\n:host([progress]) #hxIconWrapper,\n:host([progress]) #hxName {\n  color: #6b6b6b;\n}\n:host([progress]) #hxState--downloadable {\n  display: none;\n}\n:host([progress]) #hxState--loading {\n  display: block;\n}\n:host([readonly]) #hxDismiss {\n  display: none;\n}\n:host([readonly]) #hxContentWrapper {\n  padding: 0.5rem;\n}\n";

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
        return `<style>${shadowStyles$8}</style>${shadowMarkup$8}`;
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

var shadowMarkup$9 = "<span id='hxIcon' aria-hidden='true'><svg xmlns='http://www.w3.org/2000/svg' focusable='false' viewBox='0 0 16 16'><path id='hxPath'></path></svg></span>";

var shadowStyles$9 = ":host {\n  background-color: transparent;\n  color: currentColor;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  width: 1em;\n}\n:host #hxIcon {\n  box-sizing: border-box;\n  display: block;\n  flex-shrink: 0;\n  height: 100%;\n  line-height: 1;\n  width: 100%;\n}\n:host #hxIcon svg {\n  fill: currentColor;\n  height: auto;\n  stroke: none;\n  vertical-align: bottom;\n}\n";

var _account = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.2 2c.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8h-2.4a1.2 1.2 0 1 0-2.4 0H5.6a1.2 1.2 0 0 0-2.4 0H.8c-.44 0-.8-.36-.8-.8V2.8c0-.44.36-.8.8-.8h14.4zM9 10.562v-.437a.44.44 0 0 0-.242-.392c-.075-.037-1.859-.92-3.258-.92s-3.183.883-3.258.92a.44.44 0 0 0-.242.392v.437c0 .242.196.438.438.438h6.125A.438.438 0 0 0 9 10.562zm-5.287-4.74v.875c0 .965.785 1.75 1.75 1.75s1.75-.785 1.75-1.75v-.875c0-.965-.785-1.75-1.75-1.75s-1.75.785-1.75 1.75zM10 11h4v-1h-4v1zm0-3h4V7h-4v1zm0-3h4V4h-4v1z'/></svg>";

var _angleBottom = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 3.002c0-.284.123-.566.359-.763a1.006 1.006 0 0 1 1.409.126L7.997 7.4l4.235-5.043c.354-.42.984-.478 1.409-.126a.988.988 0 0 1 .127 1.398L7.997 10.5 2.232 3.638A.986.986 0 0 1 2 3.002zM14 13a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h10a1 1 0 0 1 1 1z'/></svg>";

var _angleDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.004 12.25L2.233 5.378a.988.988 0 0 1 .126-1.398 1.007 1.007 0 0 1 1.409.127l4.236 5.042 4.229-5.034c.352-.42.98-.478 1.408-.127.424.35.48.977.127 1.398L8.004 12.25z'/></svg>";

var _angleEnd = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.002 14a.991.991 0 0 1-.763-.359 1.006 1.006 0 0 1 .126-1.409L7.4 8.003 2.357 3.768a1.005 1.005 0 0 1-.126-1.409.988.988 0 0 1 1.398-.127L10.5 8.003l-6.862 5.765a.986.986 0 0 1-.636.232zM13 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z'/></svg>";

var _angleLeft = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.248 14a.986.986 0 0 1-.636-.232L3.75 8.003l6.871-5.77a.988.988 0 0 1 1.398.126 1.005 1.005 0 0 1-.126 1.41L6.85 8.002l5.035 4.23c.42.353.477.983.126 1.408a.991.991 0 0 1-.763.36z'/></svg>";

var _angleRight = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.388 2.232a.988.988 0 0 0-1.398.127 1.004 1.004 0 0 0 .126 1.409l5.033 4.229-5.042 4.235a1.005 1.005 0 0 0-.126 1.409.985.985 0 0 0 1.398.127l6.871-5.771-6.862-5.765z'/></svg>";

var _angleStart = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.998 14a.986.986 0 0 1-.636-.232L5.5 8.003l6.871-5.77a.988.988 0 0 1 1.398.126 1.005 1.005 0 0 1-.126 1.41L8.6 8.002l5.035 4.23c.42.353.477.983.126 1.408a.991.991 0 0 1-.763.36zM3 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z'/></svg>";

var _angleTop = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 12.998c0-.225.076-.45.232-.636L7.997 5.5l5.771 6.871a.988.988 0 0 1-.127 1.398 1.005 1.005 0 0 1-1.409-.126L7.997 8.6l-4.229 5.035c-.354.42-.984.477-1.409.126A.991.991 0 0 1 2 12.998zM14 3a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h10a1 1 0 0 1 1 1z'/></svg>";

var _angleUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13.001 12.25c-.287 0-.571-.122-.769-.356L7.996 6.85l-4.228 5.034a1.005 1.005 0 0 1-1.409.127.99.99 0 0 1-.127-1.4L7.996 3.75l5.772 6.87a.99.99 0 0 1-.127 1.4c-.188.155-.414.23-.64.23'/></svg>";

var _bell = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 13.752c-2.651 0-4.8-.373-4.8-.832 0-.46 2.149-.832 4.8-.832s4.8.372 4.8.832c0 .46-2.149.832-4.8.832m6.371-1.69c-1.196-1.06-2.186-2.333-2.186-6.422 0-1.597-1.243-3.329-3.31-3.724C8.875 1.408 8.483 1 8 1s-.875.41-.875.915v.001c-2.067.395-3.31 2.127-3.31 3.724 0 4.09-.99 5.361-2.186 6.422-.4.262-.629.552-.629.858C1 14.068 4.134 15 8 15s7-.932 7-2.08c0-.306-.229-.596-.629-.858'/></svg>";

var _billing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.969 0L14 3.031V15c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h7.969zM9 6h3V5H9v1zm0 3h3V8H9v1zm-5 3h8v-1H4v1zm1.448-8.978c-.804.101-1.45.723-1.45 1.456 0 .809.782 1.52 1.673 1.52h.754c.352 0 .582.203.584.517a.46.46 0 0 1-.127.338.514.514 0 0 1-.457.148L4 7.002v.996l1.448-.001V9h1.104V7.99a1.53 1.53 0 0 0 1.03-.43c.275-.273.425-.647.423-1.052-.008-.859-.687-1.506-1.58-1.506h-.754c-.329 0-.677-.27-.677-.524 0-.243.335-.48.677-.48H8v-.996H6.552V2H5.448v1.022z'/></svg>";

var _calendar = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6 3h4V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1zM3 7v2h2V7H3zm4 0v2h2V7H7zm4 0v2h2V7h-2zm-4 4v2h2v-2H7zm-4 0v2h2v-2H3zm1-9v3h1V2H4zm7 0v3h1V2h-1z'/></svg>";

var _checkmark = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.038 14.997c-.438 0-.858-.192-1.145-.53L1.355 9.111a1.5 1.5 0 0 1 2.289-1.939l3.171 3.742 5.392-9.175a1.5 1.5 0 0 1 2.586 1.52L8.331 14.257a1.5 1.5 0 0 1-1.293.74'/></svg>";

var _checkmarkCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.16 5.9l-4.164 5.418a1 1 0 0 1-.74.39c-.018.002-.035.002-.053.002-.273 0-.535-.113-.725-.312L3.91 8.694a1 1 0 0 1 1.45-1.378l1.763 1.856 3.451-4.492A1 1 0 0 1 12.16 5.9M8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7'/></svg>";

var _clock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm1-7.478V3a1 1 0 1 0-2 0v4.792a.998.998 0 0 0 .278.83l2.558 2.613a.989.989 0 0 0 1.407.008l.007-.008a1 1 0 0 0 .008-1.406L9 7.522z'/></svg>";

var _cog = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.006 10.16A2.19 2.19 0 0 1 5.82 7.973a2.19 2.19 0 0 1 2.187-2.188 2.19 2.19 0 0 1 2.188 2.188 2.19 2.19 0 0 1-2.188 2.187m6.778-3.458l-1.292-.209a5.673 5.673 0 0 0-.73-1.635l.807-.972a.246.246 0 0 0-.014-.323L12.22 2.23a.253.253 0 0 0-.326-.019l-1.058.834a5.634 5.634 0 0 0-1.615-.626l-.085-1.2A.238.238 0 0 0 8.904 1H7.019a.243.243 0 0 0-.237.218l-.102 1.23a5.63 5.63 0 0 0-1.539.618L4.03 2.209a.256.256 0 0 0-.327.021L2.369 3.563a.253.253 0 0 0-.019.326l.845 1.059a5.65 5.65 0 0 0-.688 1.597l-1.29.1A.241.241 0 0 0 1 6.88v1.886c0 .12.098.23.217.245l1.228.148a5.62 5.62 0 0 0 .647 1.669l-.741.93a.25.25 0 0 0 .018.325l1.333 1.333a.263.263 0 0 0 .33.024l.915-.677c.547.35 1.157.609 1.81.756l.094 1.263a.24.24 0 0 0 .235.218h1.761c.12 0 .232-.097.247-.217l.16-1.264a5.634 5.634 0 0 0 1.776-.735l.862.654a.26.26 0 0 0 .329-.022l1.334-1.333a.263.263 0 0 0 .023-.331l-.671-.903c.33-.563.568-1.187.69-1.852l1.185-.094A.24.24 0 0 0 15 8.668V6.955a.267.267 0 0 0-.216-.253'/></svg>";

var _copy = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9 6c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h7zm5-5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h1V3H8v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1h7z'/></svg>";

var _download = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1zm-7 .674l.003-6.671a1 1 0 1 1 2 0L9 8.679l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 8.674z'/></svg>";

var _envelope = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.995 2C15.55 2 16 2.458 16 3.019v1.055L8.017 8.861 0 4.062V3.019C0 2.458.453 2 1.005 2h13.99zm-6.978 8.885c.189 0 .379-.05.545-.15L16 6.276V12.982c0 .56-.45 1.019-1 1.019H1c-.549 0-1-.458-1-1.02V6.263l7.473 4.474c.165.099.355.149.544.149z'/></svg>";

var _exclamationCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.85 0 7 3.15 7 7s-3.15 7-7 7-7-3.15-7-7 3.15-7 7-7zm.5 11.5c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _exclamationDiamond = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.692 7.253c.41.412.41 1.082 0 1.492l-6.946 6.948c-.41.41-1.082.41-1.492 0L.308 8.745a1.057 1.057 0 0 1 0-1.493L7.254.308c.41-.41 1.082-.41 1.492 0l6.946 6.946zM8.5 12.5c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _exclamationTriangle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.832 13.3c.438.88-.016 1.697-.944 1.698C11.925 15.001 9.962 15 8 15c-1.973 0-3.944.002-5.914 0-.608 0-1.054-.39-1.084-.985a1.395 1.395 0 0 1 .145-.663C3.123 9.44 5.104 5.533 7.088 1.627c.2-.393.5-.634.925-.627.433.007.72.272.923.674 1.68 3.317 3.364 6.632 5.046 9.947.284.56.57 1.117.851 1.68zm-6.332.2c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zm.065-3c.268 0 .52-.249.507-.5l.175-5c.032-.299-.203-.5-.472-.5h-1.55a.48.48 0 0 0-.475.5l.148 5c.008.275.235.5.504.5h1.163z'/></svg>";

var _externalLink = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11 9a1 1 0 1 1 2 0v4.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 13.5v-9A1.5 1.5 0 0 1 2.5 3H7a1 1 0 1 1 0 2H3v8h8V9zm2-4.586L7.707 9.707a1 1 0 1 1-1.414-1.414L11.586 3H10a1 1 0 1 1 0-2h5v5a1 1 0 1 1-2 0V4.414z'/></svg>";

var _file = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 0h8.5L14 2.5V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zm10 3h-1.5c-.323 0-.5-.183-.5-.5V1H3v14h10V3z'/></svg>";

var _filter = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.811 2.084L9.909 6.986v7.378a.644.644 0 0 1-.387.587.743.743 0 0 1-.25.049.592.592 0 0 1-.447-.189L6.28 12.266a.63.63 0 0 1-.189-.447V6.986L1.19 2.084a.626.626 0 0 1-.14-.696c.1-.229.329-.388.587-.388h12.727c.258 0 .487.16.586.389a.626.626 0 0 1-.139.695'/></svg>";

var _flag = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 2.5c1.566.783 3.13.95 5.315.303.472-.14.685.1.685.471v7.419c0 .2-.027.322-.281.441-1.899.887-3.813.82-5.719-.134-1.333-.667-2.667-.722-4-.5V14a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1c.496 0 .908.526.987 1C5.32 1.774 6.662 1.831 8 2.5z'/></svg>";

var _globe = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.54 13.34a7.007 7.007 0 0 1-2.594 1.39c.434-.64.793-1.495 1.057-2.497a6.535 6.535 0 0 1 1.537 1.108zm-6.602-1.438A6.525 6.525 0 0 1 8 11.57c.72 0 1.414.117 2.062.332C9.59 13.778 8.801 15.003 8 15.003c-.8 0-1.59-1.225-2.062-3.1zM3.46 13.341c.453-.44.97-.814 1.537-1.108.264 1.002.623 1.856 1.057 2.498a7.007 7.007 0 0 1-2.594-1.39zm9.797-.703a7.536 7.536 0 0 0-2.028-1.413c.155-.843.25-1.762.274-2.725H15a6.962 6.962 0 0 1-1.743 4.138zm-7.53-1.79A16.764 16.764 0 0 1 5.501 8.5h4.998a16.764 16.764 0 0 1-.226 2.349A7.532 7.532 0 0 0 8 10.5c-.792 0-1.556.122-2.273.349zm-2.984 1.79A6.962 6.962 0 0 1 1 8.5h3.497c.025.963.119 1.882.274 2.725a7.536 7.536 0 0 0-2.028 1.413zM13.257 3.36A6.962 6.962 0 0 1 15 7.498h-3.497a17.615 17.615 0 0 0-.274-2.725 7.536 7.536 0 0 0 2.028-1.413zm-7.53 1.79c.717.226 1.48.349 2.273.349.792 0 1.556-.123 2.273-.349.123.725.203 1.516.226 2.349H5.501c.023-.833.103-1.624.226-2.349zM2.743 3.36a7.536 7.536 0 0 0 2.028 1.413c-.155.843-.25 1.762-.274 2.725H1A6.962 6.962 0 0 1 2.743 3.36zm9.797-.698c-.453.44-.97.814-1.537 1.108-.264-1.001-.623-1.856-1.057-2.497a7.007 7.007 0 0 1 2.594 1.39zm-6.602 1.44C6.41 2.225 7.199 1 8 1c.8 0 1.59 1.226 2.062 3.101A6.525 6.525 0 0 1 8 4.433c-.72 0-1.414-.116-2.062-.332zM3.46 2.661a7.007 7.007 0 0 1 2.594-1.39c-.434.642-.793 1.497-1.057 2.498A6.535 6.535 0 0 1 3.46 2.662z'/></svg>";

var _helpCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.789 6.858c-.14.278-.366.562-.677.853l-.733.657c-.209.192-.354.39-.435.591a2.55 2.55 0 0 0-.134.541H6.985c0-.367.07-.838.21-1.183.142-.347.368-.647.684-.9.314-.254.554-.486.717-.697.165-.211.247-.444.247-.697 0-.618-.278-.927-.831-.927-.254 0-.46.09-.618.27-.14.159-.217.377-.24.748H5c.034-.893.293-1.498.792-1.93.527-.456 1.267-.684 2.22-.684.95 0 1.684.21 2.206.632.52.422.782 1.02.782 1.8 0 .339-.07.648-.211.926m-2.075 5.861A.98.98 0 0 1 8 13a.98.98 0 0 1-.714-.28A.965.965 0 0 1 7 12c0-.291.095-.532.286-.72A.98.98 0 0 1 8 11a.968.968 0 0 1 1 1 .969.969 0 0 1-.286.72M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7'/></svg>";

var _infoCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.859 0 7 3.141 7 7 0 3.861-3.141 7-7 7s-7-3.139-7-7c0-3.859 3.141-7 7-7zm-.25 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm1.785 6.019h-.542c.004-1.328.003-4.146-.003-4.633-.003-.251-.115-.374-.32-.37-.189.006-.376.003-.565.002H7.302 6.5a.5.5 0 1 0 0 1h.497a889.327 889.327 0 0 0 0 4H6.5a.5.5 0 1 0 0 1h3.035a.5.5 0 0 0 0-1z'/></svg>";

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

var _monitoring = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15 12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v9h13zM11.267 2H15v3.78l-1.174-1.19-4.05 4.049a1 1 0 0 1-1.413 0l-1.42-1.42-2.68 2.679a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l3.387-3.386a.996.996 0 0 1 1.414 0l1.42 1.42 3.35-3.351L11.267 2z'/></svg>";

var _paperclip = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.977 13.037A3.244 3.244 0 0 1 1 10.71c0-.878.347-1.705.977-2.326l5.12-5.05A4.61 4.61 0 0 1 10.356 2c1.231 0 2.39.473 3.26 1.333C14.52 4.223 15 5.366 15 6.581c0 1.215-.48 2.358-1.351 3.218L9.816 13.58a.754.754 0 0 1-1.03 0 .714.714 0 0 1 0-1.016l3.833-3.782c.597-.588.925-1.37.925-2.202a3.07 3.07 0 0 0-.925-2.2 3.18 3.18 0 0 0-2.262-.944c-.843 0-1.635.324-2.23.912L3.006 9.4c-.356.35-.55.815-.55 1.31 0 .496.194.961.55 1.312.709.7 1.947.7 2.656 0l5.054-4.986a.562.562 0 0 0 0-.807.577.577 0 0 0-.4-.162.56.56 0 0 0-.399.167l-4.817 4.892a.736.736 0 0 1-1.03.014.704.704 0 0 1-.22-.505.707.707 0 0 1 .205-.51l4.819-4.892a2.02 2.02 0 0 1 1.416-.603c.545.01 1.048.192 1.435.563.396.39.615.904.615 1.445 0 .535-.212 1.036-.595 1.414l-5.053 4.985A3.347 3.347 0 0 1 4.335 14c-.854 0-1.708-.32-2.358-.963z'/></svg>";

var _payment = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5 15A5 5 0 1 1 5 5a5 5 0 0 1 0 10zm.496-3.433c-.101.093-.24.139-.418.139-.242 0-.43-.068-.561-.203-.132-.136-.2-.333-.2-.593H3c0 .472.152.851.456 1.14.304.287.741.459 1.309.51v.69h.622v-.686c.488-.04.873-.185 1.157-.43.282-.247.423-.564.423-.954 0-.23-.043-.427-.132-.59a1.393 1.393 0 0 0-.367-.43 2.631 2.631 0 0 0-.559-.33c-.215-.098-.443-.19-.687-.281-.242-.09-.418-.184-.528-.285a.508.508 0 0 1-.165-.4c0-.166.048-.297.145-.392.095-.094.228-.141.4-.141.193 0 .342.064.446.191.105.127.157.31.157.547H7c0-.433-.138-.79-.41-1.071-.273-.281-.647-.453-1.124-.513V6.75h-.624v.72c-.495.041-.892.186-1.188.435a1.192 1.192 0 0 0-.447.952c0 .23.043.426.126.588.083.161.203.304.359.427.157.122.344.23.561.324.215.094.452.186.707.277.256.091.435.189.536.29.103.103.153.244.153.424 0 .161-.05.289-.153.38zm6.772-3.939a.5.5 0 0 1-.286-.089L10.5 6.524v-2.99c0-.294.232-.534.518-.534.285 0 .517.24.517.535v2.413l1.02.698a.546.546 0 0 1 .144.742.512.512 0 0 1-.43.24zM7.308 4.46a5.954 5.954 0 0 0-.956-.307A5.002 5.002 0 0 1 16 6a5 5 0 0 1-5.083 5A6.04 6.04 0 0 0 11 10a4 4 0 1 0-3.693-5.54z'/></svg>";

var _pencil = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.423 10.716L9.567 3.56l2.802 2.807-7.145 7.158-2.801-2.808zm-1.415 3.895l.708-3.186 2.8 2.807-3.122.759a.32.32 0 0 1-.386-.38zm13.85-11.355a.489.489 0 0 1-.004.693l-.776.765.007.007-.953.924-2.802-2.807.34-.33c.004-.003.005-.01.01-.015l1.373-1.351a.498.498 0 0 1 .7.003l2.104 2.11z'/></svg>";

var _phone = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.177 10.059h-3.294a.823.823 0 0 0-.824.824v.823c-3.294 0-5.713-2.522-5.765-5.764h.823a.824.824 0 0 0 .825-.824V1.824A.824.824 0 0 0 5.117 1H1.823A.824.824 0 0 0 1 1.824v4.118A9.058 9.058 0 0 0 10.059 15h4.118a.822.822 0 0 0 .823-.823v-3.294a.823.823 0 0 0-.823-.824'/></svg>";

var _plus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 7H9V2a1 1 0 1 0-2 0v5H2a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0V9h5a1 1 0 1 0 0-2'/></svg>";

var _plusOrMinus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4 15a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H4zM7 5V2a1 1 0 1 1 2 0v3h3a1 1 0 0 1 0 2H9v3a1 1 0 0 1-2 0V7H4a1 1 0 1 1 0-2h3z'/></svg>";

var _redo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.585 6a5 5 0 1 0-1.098 5.583 1 1 0 0 1 1.395 1.434A7 7 0 1 1 14 4.39V2a1 1 0 0 1 2 0v6h-6a1 1 0 1 1 0-2h2.585z'/></svg>";

var _search = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6.494 10a3.502 3.502 0 0 1-3.496-3.5c0-1.93 1.568-3.5 3.496-3.5A3.502 3.502 0 0 1 9.99 6.5c0 1.93-1.568 3.5-3.496 3.5m8.213 3.292l-3.683-3.683a5.475 5.475 0 0 0 .963-3.109c0-3.038-2.459-5.5-5.493-5.5A5.497 5.497 0 0 0 1 6.5C1 9.538 3.46 12 6.494 12a5.456 5.456 0 0 0 3.118-.975l3.683 3.683a.998.998 0 0 0 1.412-.001 1 1 0 0 0 0-1.415'/></svg>";

var _server = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.5 11h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm0-5h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm0-5h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zM11 13.032c.022.534.493.98 1.02.968.533-.012.983-.474.98-1.007a1.016 1.016 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 13.032zm0-5c.022.534.493.98 1.02.968.533-.012.983-.474.98-1.007a1.016 1.016 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 8.032zm0-5c.022.534.492.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 14h6v-2H3v2zm0-5h6V7H3v2zm0-5h6V2H3v2z'/></svg>";

var _serverConfig = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.646 9c-.269.3-.497.636-.678 1H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545h13c.276 0 .5.246.5.546v2.1A4.483 4.483 0 0 0 12 7.5a4.483 4.483 0 0 0-3 1.146V7H3v2h5.646zm-.678 5c.18.364.41.7.678 1H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545h6.112a4.515 4.515 0 0 0-.112 1H3v2h4.968zM1.5 1h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm12.854 10.354l.553.09a.114.114 0 0 1 .093.108v.734a.103.103 0 0 1-.093.101l-.508.04a2.427 2.427 0 0 1-.296.794l.288.387a.113.113 0 0 1-.01.142l-.572.571a.112.112 0 0 1-.141.01l-.37-.28c-.23.145-.486.253-.76.314l-.07.542a.11.11 0 0 1-.105.093h-.755a.103.103 0 0 1-.1-.093l-.04-.542a2.427 2.427 0 0 1-.776-.324l-.393.29a.113.113 0 0 1-.141-.01l-.572-.571a.108.108 0 0 1-.007-.14l.318-.398a2.408 2.408 0 0 1-.278-.716l-.526-.063A.11.11 0 0 1 9 12.328v-.808c0-.051.042-.097.093-.1l.553-.044c.063-.245.163-.475.295-.684l-.362-.454a.109.109 0 0 1 .007-.14l.572-.57a.11.11 0 0 1 .14-.01l.477.367c.203-.118.424-.208.66-.265l.043-.527A.104.104 0 0 1 11.58 9h.807c.052 0 .097.042.1.094l.037.514c.247.054.48.146.692.268l.453-.357a.109.109 0 0 1 .14.008l.572.571a.106.106 0 0 1 .006.139l-.346.416c.14.213.245.45.313.701zm-3.289.634a.939.939 0 0 0 1.875 0 .939.939 0 0 0-.937-.937.939.939 0 0 0-.938.937zm-.064-8.956c.02.534.491.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 4h6V2H3v2z'/></svg>";

var _serverIncident = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.5 14l-.415.829a1.5 1.5 0 0 0-.073.171H1.5c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545H9l-.5 1H3v2h4.5zm7-4L13.34 7.683a1.5 1.5 0 0 0-2.683 0L9.499 10h-8c-.274 0-.5-.245-.5-.545v-2.91c0-.3.226-.545.5-.545h13c.277 0 .5.246.5.546v2.909c0 .3-.223.545-.5.545zm-13-9h13c.276 0 .5.246.5.546v2.909c0 .3-.224.545-.5.545h-13c-.275 0-.5-.245-.5-.545v-2.91c0-.3.225-.545.5-.545zm13.428 13.272c.187.377-.007.727-.404.727-.842.002-1.683 0-2.524 0-.845 0-1.69.002-2.535 0-.26 0-.452-.166-.464-.421a.598.598 0 0 1 .062-.285c.846-1.676 1.696-3.35 2.545-5.024.086-.169.215-.272.397-.269.186.003.308.117.396.289.72 1.422 1.441 2.842 2.162 4.263.122.24.245.479.365.72zm-2.714.085a.215.215 0 0 0 .215-.214v-.429a.215.215 0 0 0-.215-.214h-.428a.215.215 0 0 0-.215.214v.429c0 .118.096.214.215.214h.428zm.028-1.285c.115 0 .223-.107.217-.215l.075-2.143c.014-.128-.086-.214-.202-.214h-.664a.206.206 0 0 0-.204.214l.064 2.143a.22.22 0 0 0 .216.215h.498zm-1.241-10.04c.02.534.491.979 1.02.967A1.02 1.02 0 0 0 13 2.993a1.015 1.015 0 0 0-1.046-.992A1.02 1.02 0 0 0 11 3.032zM3 9h6V7H3v2zm0-5h6V2H3v2z'/></svg>";

var _sort = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 12.174v-8.35L5.487 5.306a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415L8.003 0l3.948 3.887a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 3.82v8.36l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 12.174z'/></svg>";

var _sortDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 12.174V1a1 1 0 1 1 2 0v11.179l1.513-1.483a1.027 1.027 0 0 1 1.438 0 .988.988 0 0 1 0 1.415l-3.948 3.887-3.954-3.89a.988.988 0 0 1 0-1.416 1.027 1.027 0 0 1 1.438 0L7 12.174z'/></svg>";

var _sortUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 3.824L5.487 5.306a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415L8.003 0l3.948 3.887a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 3.82v11.179a1 1 0 1 1-2 0V3.824z'/></svg>";

var _support = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.334 8.048c.189 3.135-.773 4.94-2.448 6.172-.606.446-1.593 1.033-2.633.663-.26-.093-1.155-.52-1.74-1.045-.652-.588-.985-1.276-.985-1.276.179.073.68.25 1.158.362.482.114.996.17 1.071.179.177.356.613.609 1.124.609.667 0 1.208-.43 1.208-.96s-.54-.96-1.208-.96c-.493 0-.915.235-1.104.57a4.37 4.37 0 0 1-1.847-.426c-.656-.32-1.08-.802-1.095-.853A7.437 7.437 0 0 1 3.6 9.8c-.056-.677-.019-1.32-.019-1.32s.608.075 1.554-.986c.854-.956.831-2.565.831-2.565.389.848 3.809 2.695 6.035 2.426.238-.03.293.664.333.692zm2.243.024c.258.242.423.596.423.99v1.577c0 .724-.554 1.317-1.232 1.317h-.544-.031v-.003a.336.336 0 0 1-.292-.342c0-.044.008-.087.023-.126l.001-.01c.209-.75.33-1.622.33-2.634 0-.26-.008-.491-.024-.74v-.005-.006c0-.19.143-.344.32-.345h.216c.037 0 .072.002.108.006-.148-1.594-.627-2.95-1.408-3.964-1.04-1.353-2.594-2.068-4.493-2.068-1.802 0-3.313.713-4.37 2.064C2.79 4.82 2.29 6.178 2.134 7.75c.033-.003.065-.005.098-.005h.069c.176 0 .319.15.322.338l.001.003v.004c-.018.245-.027.495-.027.75a8.117 8.117 0 0 0 .449 2.702l.005.015a.094.094 0 0 1 0 .051l.001.003a.335.335 0 0 1-.306.343l-.002.002h-.512C1.554 11.956 1 11.363 1 10.64V9.062c0-.398.168-.755.43-.997.122-1.879.687-3.507 1.654-4.742C4.274 1.803 5.965 1 7.974 1c2.108 0 3.843.806 5.016 2.332.93 1.209 1.473 2.837 1.587 4.74zM9.75 9.91c.434 0 .785-.375.785-.838 0-.463-.351-.838-.785-.838-.433 0-.784.375-.784.838 0 .463.351.838.784.838zm-3.584 0c.433 0 .784-.375.784-.838 0-.463-.351-.838-.784-.838-.433 0-.784.375-.784.838 0 .463.35.838.784.838z'/></svg>";

var _tag = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.856 1h4.082c.196 0 .386.078.524.218l7.32 7.32a.74.74 0 0 1 0 1.05l-5.194 5.195c-.29.29-.76.29-1.05 0l-7.32-7.321A.737.737 0 0 1 1 6.938V2.856C1 1.83 1.83 1 2.856 1zm.99 4.01a1.311 1.311 0 1 0 0-2.623 1.311 1.311 0 0 0 0 2.623z'/></svg>";

var _ticketing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13 2.997c.55 0 1 .45 1 1V15c0 .55-.45 1-1 1H5.997c-.55 0-1-.45-1-1V3.997c0-.55.45-1 1-1H13zm-1.997-1.028h-7V13H3c-.55 0-1-.444-1-.984V.985C2 .443 2.45 0 3 0h7.003c.55 0 1 .443 1 .985v.984zM6.988 11.997h5.022v-.985H6.988v.985zm-.001 1.97h3.049v-.986h-3.05v.985zm.164-6.121l2.076 2.032 2.697-4.088a.488.488 0 0 0-.147-.68.506.506 0 0 0-.691.144L9.059 8.326 7.856 7.148a.504.504 0 0 0-.707.002.487.487 0 0 0 .002.696z'/></svg>";

var _times = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.414 8l4.293-4.293a.999.999 0 1 0-1.414-1.414L8 6.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L6.586 8l-4.293 4.293a.999.999 0 1 0 1.414 1.414L8 9.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L9.414 8z'/></svg>";

var _timesCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.682 10.268a.999.999 0 1 1-1.414 1.414L8 9.414l-2.267 2.268a.999.999 0 1 1-1.414-1.414L6.586 8 4.319 5.732a.999.999 0 1 1 1.414-1.414L8 6.586l2.268-2.268a.999.999 0 1 1 1.414 1.414L9.414 8l2.268 2.268zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z'/></svg>";

var _trash = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 13.27V5h12v8.27c0 .95-.778 1.729-1.729 1.729H3.729A1.734 1.734 0 0 1 2 13.268zM14 2c.55 0 1 .45 1 1v1H1V3c0-.55.45-1 1-1h4V1h4v1h4zM6 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z'/></svg>";

var _undo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.415 6H6a1 1 0 1 1 0 2H0V2a1 1 0 1 1 2 0v2.39a7 7 0 1 1 1.118 8.626 1 1 0 1 1 1.395-1.433A5 5 0 1 0 3.415 6z'/></svg>";

var _upload = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1zM7 4.827L5.487 6.31a1.027 1.027 0 0 1-1.438 0 .988.988 0 0 1 0-1.415l3.954-3.891L11.95 4.89a.988.988 0 0 1 0 1.415 1.027 1.027 0 0 1-1.438 0L9 4.822l.003 6.676a1 1 0 1 1-2 0L7 4.828z'/></svg>";

var _user = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.517 12.467c-.15-.075-3.717-1.842-6.517-1.842-2.798 0-6.366 1.767-6.516 1.842A.876.876 0 0 0 1 13.25v.875c0 .483.392.875.875.875h12.25a.875.875 0 0 0 .875-.875v-.875a.875.875 0 0 0-.483-.783M4.5 6.25V4.5C4.5 2.57 6.07 1 8 1s3.5 1.57 3.5 3.5v1.75c0 1.93-1.57 3.5-3.5 3.5a3.505 3.505 0 0 1-3.5-3.5'/></svg>";

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
    'checkmark': _checkmark,
    'checkmark-circle': _checkmarkCircle,
    'clock': _clock,
    'cog': _cog,
    'copy': _copy,
    'download': _download,
    'envelope': _envelope,
    'exclamation-circle': _exclamationCircle,
    'exclamation-diamond': _exclamationDiamond,
    'exclamation-triangle': _exclamationTriangle,
    'external-link': _externalLink,
    'file': _file,
    'filter': _filter,
    'flag': _flag,
    'globe': _globe,
    'help-circle': _helpCircle,
    'info-circle': _infoCircle,
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
    'monitoring': _monitoring,
    'paperclip': _paperclip,
    'payment': _payment,
    'pencil': _pencil,
    'phone': _phone,
    'plus': _plus,
    'plus-or-minus': _plusOrMinus,
    'redo': _redo,
    'search': _search,
    'server': _server,
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
    'undo': _undo,
    'upload': _upload,
    'user': _user,
};

// DEPRECATED: remove in v1.0.0
MAP['export'] = MAP['upload'];
MAP['input-url'] = MAP['globe'];
MAP['technical-change'] = MAP['server-config'];
MAP['technical-incident'] = MAP['server-incident'];
MAP['input-time'] = MAP['clock'];

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
        return `<style>${shadowStyles$9}</style>${shadowMarkup$9}`;
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

                this.$emit('reposition');
            }
        }

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

var shadowMarkup$a = "<div id='hxBackdrop'><div id='hxModal'><button type='button' id='hxClose'><hx-icon type='times'></hx-icon></button><div id='hxContent'><slot></slot></div></div></div>";

var shadowStyles$a = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n:host {\n  display: none;\n  z-index: 1200;\n}\n:host([open]) {\n  display: block;\n}\n#hxBackdrop {\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.6);\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  justify-content: center;\n  padding: 1.25rem;\n  width: 100%;\n}\n#hxModal {\n  background-color: #ffffff;\n  box-shadow: 0px 7px 9px 0 rgba(0, 0, 0, 0.3);\n  display: flex;\n  min-height: 3.5rem;\n  min-width: 25rem;\n  position: relative;\n}\n@supports (--modern: true) {\n  #hxModal {\n    min-height: 12.5rem;\n  }\n}\n#hxContent {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n}\n#hxClose {\n  background-color: transparent;\n  border: 0;\n  color: inherit;\n  cursor: pointer;\n  display: inline-block;\n  font: inherit;\n  font-weight: 500;\n  line-height: 1;\n  margin: 0;\n  padding: 0;\n  color: #757575;\n  height: 1rem;\n  position: absolute;\n  right: 1.25rem;\n  top: 1.25rem;\n}\n:host(.hxSm) #hxModal {\n  max-width: 30rem;\n  width: 40%;\n}\n:host #hxModal {\n  max-width: 50rem;\n  width: 60%;\n}\n:host(.hxLg) #hxModal {\n  max-width: 70rem;\n  width: 80%;\n}\n";

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
        return `<style>${shadowStyles$a}</style>${shadowMarkup$a}`;
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

var shadowMarkup$b = "<div id='hxPill'><span><slot></slot></span><button id='hxDismiss' type='button'><span><hx-icon type='times'></hx-icon></span></button></div>";

var shadowStyles$b = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n:host #hxPill {\n  background-color: #d8d8d8;\n  border-radius: 1em;\n  color: #424242;\n  display: flex;\n  height: 100%;\n  padding: 0 1rem;\n  white-space: nowrap;\n  width: 100%;\n}\n:host #hxDismiss {\n  background-color: transparent;\n  border: 0;\n  color: inherit;\n  cursor: pointer;\n  display: inline-block;\n  font: inherit;\n  font-weight: 500;\n  line-height: 1;\n  margin: 0;\n  padding: 0;\n  align-items: center;\n  color: #9e9e9e;\n  display: inline-flex;\n  height: 1.5em;\n  justify-content: center;\n  margin: 0 -0.5rem 0 0;\n  width: 1.5em;\n}\n:host #hxDismiss > span {\n  font-size: 0.75em;\n}\n:host #hxDismiss:hover {\n  color: #000000;\n}\n:host([persist]) #hxDismiss {\n  display: none;\n}\n";

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
        return `<style>${shadowStyles$b}</style>${shadowMarkup$b}`;
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

var shadowMarkup$c = "<div id='hxPopover' class='has-arrow'><slot></slot></div>";

var shadowStyles$c = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n/* MIXINS */\n.has-arrow {\n  margin: 0;\n  position: relative;\n  /*======================================== *\\\n   * TOP POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * RIGHT POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * BOTTOM POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * LEFT POSITIONS\n  \\*======================================== */\n}\n.has-arrow::before {\n  box-shadow: 0 0 0 1px #e0e0e0;\n  z-index: -1;\n}\n.has-arrow::before,\n.has-arrow::after {\n  content: '';\n  display: block;\n  height: 13px;\n  position: absolute;\n  width: 13px;\n}\n.has-arrow[position^=\"top\"] {\n  margin-bottom: 8px;\n}\n.has-arrow[position^=\"top\"]::before,\n.has-arrow[position^=\"top\"]::after {\n  bottom: -8px;\n}\n.has-arrow[position^=\"top\"]::after {\n  background-image: linear-gradient(to bottom left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before,\n.has-arrow[position=\"top\"]::after,\n.has-arrow[position=\"top-center\"]::after {\n  left: 50%;\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before,\n.has-arrow[position=\"top\"]::after,\n.has-arrow[position=\"top-center\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"top-right\"]::before,\n.has-arrow[position=\"top-right\"]::after {\n  left: 1.25rem;\n}\n.has-arrow[position=\"top-right\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top-right\"]::before,\n.has-arrow[position=\"top-right\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"top-left\"]::before,\n.has-arrow[position=\"top-left\"]::after {\n  right: 1.25rem;\n}\n.has-arrow[position=\"top-left\"]::after {\n  background-image: linear-gradient(to bottom right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"top-left\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top-left\"]::before,\n.has-arrow[position=\"top-left\"]::after {\n  transform-origin: bottom right;\n  transform: rotate(45deg);\n}\n.has-arrow[position^=\"right\"] {\n  margin-left: 8px;\n}\n.has-arrow[position^=\"right\"]::before,\n.has-arrow[position^=\"right\"]::after {\n  left: -8px;\n}\n.has-arrow[position^=\"right\"]::after {\n  background-image: linear-gradient(to top left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before,\n.has-arrow[position=\"right\"]::after,\n.has-arrow[position=\"right-middle\"]::after {\n  top: 50%;\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before,\n.has-arrow[position=\"right\"]::after,\n.has-arrow[position=\"right-middle\"]::after {\n  transform-origin: top left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"right-bottom\"]::before,\n.has-arrow[position=\"right-bottom\"]::after {\n  top: 1.25rem;\n}\n.has-arrow[position=\"right-bottom\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right-bottom\"]::before,\n.has-arrow[position=\"right-bottom\"]::after {\n  transform-origin: top left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"right-top\"]::before,\n.has-arrow[position=\"right-top\"]::after {\n  bottom: 1.25rem;\n}\n.has-arrow[position=\"right-top\"]::after {\n  background-image: linear-gradient(to bottom left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"right-top\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right-top\"]::before,\n.has-arrow[position=\"right-top\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(45deg);\n}\n.has-arrow[position^=\"bottom\"] {\n  margin-top: 8px;\n}\n.has-arrow[position^=\"bottom\"]::before,\n.has-arrow[position^=\"bottom\"]::after {\n  top: -8px;\n}\n.has-arrow[position^=\"bottom\"]::after {\n  background-image: linear-gradient(to top left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"bottom\"]::before,\n.has-arrow[position=\"bottom-center\"]::before,\n.has-arrow[position=\"bottom\"]::after,\n.has-arrow[position=\"bottom-center\"]::after {\n  left: 50%;\n}\n.has-arrow[position=\"bottom\"]::before,\n.has-arrow[position=\"bottom-center\"]::before,\n.has-arrow[position=\"bottom\"]::after,\n.has-arrow[position=\"bottom-center\"]::after {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"bottom-right\"]::before,\n.has-arrow[position=\"bottom-right\"]::after {\n  left: 1.25rem;\n}\n.has-arrow[position=\"bottom-right\"]::before,\n.has-arrow[position=\"bottom-right\"]::after {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"bottom-left\"]::before,\n.has-arrow[position=\"bottom-left\"]::after {\n  right: 1.25rem;\n}\n.has-arrow[position=\"bottom-left\"]::after {\n  background-image: linear-gradient(to top right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"bottom-left\"]::before,\n.has-arrow[position=\"bottom-left\"]::after {\n  transform-origin: top right;\n  transform: rotate(-45deg);\n}\n.has-arrow[position^=\"left\"] {\n  margin-right: 8px;\n}\n.has-arrow[position^=\"left\"]::before,\n.has-arrow[position^=\"left\"]::after {\n  right: -8px;\n}\n.has-arrow[position^=\"left\"]::after {\n  background-image: linear-gradient(to top right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before,\n.has-arrow[position=\"left\"]::after,\n.has-arrow[position=\"left-middle\"]::after {\n  top: 50%;\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before,\n.has-arrow[position=\"left\"]::after,\n.has-arrow[position=\"left-middle\"]::after {\n  transform-origin: top right;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"left-bottom\"]::before,\n.has-arrow[position=\"left-bottom\"]::after {\n  top: 1.25rem;\n}\n.has-arrow[position=\"left-bottom\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left-bottom\"]::before,\n.has-arrow[position=\"left-bottom\"]::after {\n  transform-origin: top right;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"left-top\"]::before,\n.has-arrow[position=\"left-top\"]::after {\n  bottom: 1.25rem;\n}\n.has-arrow[position=\"left-top\"]::after {\n  background-image: linear-gradient(to bottom right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"left-top\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left-top\"]::before,\n.has-arrow[position=\"left-top\"]::after {\n  transform-origin: bottom right;\n  transform: rotate(-45deg);\n}\n#hxPopover {\n  background-color: #ffffff;\n  border: solid 1px #e0e0e0;\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n";

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
        return `<style>${shadowStyles$c}</style>${shadowMarkup$c}`;
    }

    /** @override */
    $onCreate () {
        super.$onCreate();
        this.DEFAULT_POSITION = 'bottom-right';
        this.POSITION_OFFSET = 20;
    }

    /** @override */
    $onConnect () {
        super.$onConnect();
        this.addEventListener('reposition', this._onReposition);
    }

    $onDisconnect () {
        super.$onDisconnect();
        this.removeEventListener('reposition', this._onReposition);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        if (attr === 'position') {
            this._setShadowPosition(newVal);
        }
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxPopover');
    }

    /**
     * Update visual display of arrow in Shadow DOM based on optimal position.
     * @private
     */
    _onReposition () {
        this._setShadowPosition(this.optimumPosition);
    }

    /**
     * @private
     * @param {NormalizedPositionString}
     */
    _setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
    }
}

var shadowMarkup$d = "<div id='hxProgress'><div id='hxFill'></div></div>";

var shadowStyles$d = "#hxProgress {\n  height: 100%;\n}\n#hxProgress #hxFill {\n  background-color: currentColor;\n  box-sizing: border-box;\n  height: 100%;\n  width: 0%;\n}\n";

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
        return `<style>${shadowStyles$d}</style>${shadowMarkup$d}`;
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

var shadowMarkup$e = "<label id='hxSearch'><input type='text' role='search' id='hxNativeControl' autocomplete='off'> <button type='button' id='hxClear' hidden aria-label='Clear search'><hx-icon type='times'></hx-icon></button><div id='hxIcon'><hx-icon type='search'></hx-icon></div><div id='hxCustomControl'></div></label>";

var shadowStyles$e = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput::-ms-clear {\n  display: none;\n}\n:host {\n  display: block;\n  font-size: 1rem;\n  height: 2rem;\n  min-width: 8rem;\n}\n:host #hxSearch {\n  display: flex;\n  height: 100%;\n  position: relative;\n}\n:host #hxIcon {\n  color: #757575;\n  flex-shrink: 0;\n  line-height: 1;\n  order: 1;\n  padding: 0.5rem;\n  z-index: 1;\n}\n:host #hxNativeControl {\n  background-color: transparent;\n  border: none;\n  color: #424242;\n  cursor: inherit;\n  flex-grow: 1;\n  font-weight: 400;\n  min-width: 0;\n  order: 2;\n  width: 0;\n  z-index: 1;\n}\n:host #hxNativeControl::-moz-placeholder {\n  color: #6b6b6b;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #hxNativeControl::-ms-input-placeholder {\n  color: #6b6b6b;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #hxNativeControl::-webkit-input-placeholder {\n  color: #6b6b6b;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #hxNativeControl::placeholder {\n  color: #6b6b6b;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #hxNativeControl::-moz-focus-inner {\n  outline: none;\n  border: none;\n}\n:host #hxNativeControl:focus {\n  outline: none;\n}\n:host #hxNativeControl:focus ~ #hxClear {\n  color: #0e94a6;\n}\n:host #hxNativeControl:focus ~ #hxCustomControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host #hxCustomControl {\n  background-color: #ffffff;\n  border-radius: 2px;\n  border: 1px solid #bdbdbd;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 0;\n}\n:host #hxClear {\n  background-color: transparent;\n  border: none;\n  color: #757575;\n  cursor: pointer;\n  flex-shrink: 0;\n  line-height: 1;\n  order: 3;\n  padding: 0.5rem;\n  z-index: 1;\n}\n:host #hxClear::-moz-focus-inner {\n  outline: none;\n  border: none;\n}\n:host #hxClear:focus {\n  outline: none;\n}\n:host #hxClear:focus hx-icon {\n  outline-offset: 2px;\n  outline: 1px dotted currentColor;\n}\n:host #hxClear:focus ~ * {\n  color: #0e94a6;\n}\n:host #hxClear:focus ~ #hxCustomControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host([invalid]) {\n  color: #d32f2f;\n}\n:host([invalid]) #hxIcon,\n:host([invalid]) #hxClear {\n  color: inherit;\n}\n:host([invalid]) #hxCustomControl {\n  border-color: #d32f2f;\n  border-width: 2px;\n}\n:host([invalid]) #hxClear:focus hx-icon {\n  outline-color: currentColor;\n}\n:host([invalid]) #hxNativeControl:focus ~ #hxClear {\n  color: #d32f2f;\n}\n:host([invalid]) #hxClear:focus ~ #hxCustomControl,\n:host([invalid]) #hxNativeControl:focus ~ #hxCustomControl {\n  box-shadow: 0 0 4px rgba(211, 47, 47, 0.5);\n  border-color: #d32f2f;\n}\n:host([disabled]) {\n  color: #d8d8d8;\n}\n:host([disabled]) #hxSearch {\n  color: inherit;\n  cursor: not-allowed;\n}\n:host([disabled]) #hxIcon {\n  color: inherit;\n}\n:host([disabled]) #hxClear {\n  display: none;\n}\n:host([disabled]) #hxNativeControl {\n  color: inherit;\n}\n:host([disabled]) #hxNativeControl::-moz-placeholder {\n  color: inherit;\n}\n:host([disabled]) #hxNativeControl::-ms-input-placeholder {\n  color: inherit;\n}\n:host([disabled]) #hxNativeControl::-webkit-input-placeholder {\n  color: inherit;\n}\n:host([disabled]) #hxNativeControl::placeholder {\n  color: inherit;\n}\n:host([disabled]) #hxCustomControl {\n  background-color: #f5f5f5;\n  border-color: #e0e0e0;\n  border-width: 1px;\n}\n";

/**
 * Fires when the element loses focus.
 *
 * - **does not bubble**
 *
 * @event Search:blur
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the clear button ("X") is pressed.
 *
 * @event Search:clear
 * @since 0.5.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element receives focus.
 *
 * - **does not bubble**
 *
 * @event Search:focus
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-search>` element.
 *
 * @emits Search:blur
 * @emits Search:clear
 * @emits Search:focus
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
        return `<style>${shadowStyles$e}</style>${shadowMarkup$e}`;
    }

    $onCreate () {
        this._onClearClick = this._onClearClick.bind(this);
        this._onSearchInput = this._onSearchInput.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('invalid');
        this.$upgradeProperty('placeholder');
        this.$upgradeProperty('value');

        this._btnClear.addEventListener('click', this._onClearClick);
        this._elSearch.addEventListener('input', this._onSearchInput);

        this.$relayNonBubblingEvents(this._elSearch);
    }

    $onDisconnect () {
        this._btnClear.removeEventListener('click', this._onClearClick);
        this._elSearch.removeEventListener('input', this._onSearchInput);

        this.$removeNonBubblingRelays(this._elSearch);
    }

    static get $observedAttributes () {
        return [
            'disabled',
            'placeholder',
            'value',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);

        switch (attr) {
            case 'disabled': {
                this._elSearch.disabled = hasValue;
                break;
            }

            case 'placeholder': {
                this._elSearch.placeholder = newVal;
                break;
            }

            case 'value': {
                if (this._elSearch.value !== newVal) {
                    this._elSearch.value = newVal;
                }

                if (hasValue) {
                    this._btnClear.hidden = (newVal === '');
                } else {
                    this._btnClear.hidden = true;
                }
                break;
            }
        }
    }

    /**
     * @default [false]
     * @type {Boolean}
     */
    get invalid () {
        return this.hasAttribute('invalid');
    }
    set invalid (isInvalid) {
        if (isInvalid) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    /**
     * @default ['']
     * @type {String}
     */
    get placeholder () {
        return this.getAttribute('placeholder');
    }
    set placeholder (newVal) {
        if (newVal) {
            this.setAttribute('placeholder', newVal);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    /**
     * @default ['']
     * @type {String}
     */
    get value () {
        return this.getAttribute('value');
    }
    set value (newVal) {
        if (newVal) {
            this.setAttribute('value', newVal);
        } else {
            this.removeAttribute('value');
        }
    }

    /**
     * Simulate pressing "X" to clear input value
     */
    clear () {
        if (this.value !== '') {
            this.value = '';
            this.$emit('clear');
        }
    }

    /**
     * Override HTMLElement#focus(), because we need to focus the
     * inner `<input>` instead of the outer `<hx-search>`.
     */
    focus () {
        this._elSearch.focus();
    }

    /** @private */
    get _btnClear () {
        return this.shadowRoot.getElementById('hxClear');
    }

    /** @private */
    get _elSearch () {
        return this.shadowRoot.getElementById('hxNativeControl');
    }

    /**
     * Clear value and focus input when user presses "X" via the UI.
     * @private
     */
    _onClearClick (evt) {
        evt.preventDefault();
        this.clear();
        this.focus();
    }

    /**
     * Keep state in sync with `<input>`
     *
     * 1. synchronize `value`
     * 2. determine whether to reveal the clear button
     *
     * @private
     */
    _onSearchInput (evt) {
        this.value = evt.target.value;
        let hasValue = (evt.target.value !== '');
        this._btnClear.hidden = !hasValue;
    }
}

/**
 * Defines behavior for the `<hx-tab>` element.
 *
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
class HXTabElement extends HXElement {
    static get is () {
        return 'hx-tab';
    }

    $onConnect () {
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
    }

    static get $observedAttributes () {
        return [ 'current' ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        if (attr === 'current') {
            this.setAttribute('aria-selected', newVal !== null);
        }
    }

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
 * @since 0.2.0
 */
class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    $onCreate () {
        this.$onConnect = defer(this.$onConnect);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTabClick = this._onTabClick.bind(this);
    }

    $onConnect () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('id', `tabset-${generateId()}`);
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this._tablist.addEventListener('keyup', this._onKeyUp);
        this._tablist.addEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this._onTabClick);
        });

        if (this.hasAttribute('current-tab')) {
            this._activateTab(this.currentTab);
        }
    }

    $onDisconnect () {
        this._tablist.removeEventListener('keyup', this._onKeyUp);
        this._tablist.removeEventListener('keydown', preventKeyScroll);
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this._onTabClick);
        });
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
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (idx < 0 || idx >= this.tabs.length) {
            throw new RangeError('currentTab index is out of bounds');
        }

        this.setAttribute('current-tab', idx);
    }

    /**
     * All `<hx-tabpanel>` elements within the tabset.
     * @readonly
     * @type {HXTabpanelElement[]}
     */
    get tabpanels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    /**
     * All `<hx-tab>` elements within the tabset.
     * @readonly
     * @type {HXTabElement[]}
     */
    get tabs () {
        return Array.from(this.querySelectorAll('hx-tablist > hx-tab'));
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

    /** @private */
    get _tablist () {
        return this.querySelector('hx-tablist');
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

    /**
     * @private
     * @todo migrate tab click listener logic to HXTabElement
     */
    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
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
            if (tabpanel.hasAttribute('id')) {
                tabpanelId = tabpanel.getAttribute('id');
            } else {
                tabpanel.setAttribute('id', tabpanelId);
            }

            tab.setAttribute('aria-controls', tabpanelId);
            tabpanel.setAttribute('aria-labelledby', tabId);
        });
    }
}

var shadowMarkup$f = "<div id='hxToast'><div id='hxIconWrapper'><hx-icon id='hxIcon' type='info-circle'></hx-icon></div><div id='hxContent'><div><slot></slot></div><button id='hxCta' type='button'></button></div><button id='hxDismiss' type='button'><hx-icon type='times'></hx-icon></button></div>";

var shadowStyles$f = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n#hxToast #hxCta {\n  background-color: transparent;border: 0;color: inherit;cursor: pointer;display: inline-block;font: inherit;font-weight: 500;line-height: 1;margin: 0;padding: 0;border-radius: 2px;display: inline-flex;justify-content: center;border: 1px solid #0c7c84;color: #0c7c84;font-size: 0.875rem;padding: 8px 12px;\n}\n#hxToast {\n  padding: 0.75rem;\n  background-color: #ffffff;\n  box-shadow: 0px 3px 3px 0 rgba(0, 0, 0, 0.16);\n  color: #424242;\n  display: flex;\n  min-height: 3.5rem;\n  position: relative;\n  width: 22rem;\n}\n#hxToast::before,\n#hxToast::after {\n  content: '';\n  display: block;\n  height: 100%;\n  left: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n#hxToast::before {\n  border: 1px solid #e0e0e0;\n}\n#hxToast::after {\n  border-left: 8px solid currentColor;\n}\n#hxToast #hxIconWrapper {\n  align-items: center;\n  display: flex;\n  margin: 0 0.75rem 0 0.5rem;\n}\n#hxToast #hxIconWrapper hx-icon {\n  font-size: 2rem;\n}\n#hxToast #hxContent {\n  flex-grow: 1;\n  margin-right: 1.5rem;\n  text-align: right;\n  word-wrap: break-word;\n}\n#hxToast #hxContent div {\n  font-size: 0.875rem;\n  text-align: left;\n}\n#hxToast #hxCta {\n  text-transform: uppercase;\n}\n#hxToast #hxCta:empty {\n  display: none;\n}\n#hxToast #hxDismiss {\n  background-color: transparent;\n  border: 0;\n  color: #757575;\n  cursor: pointer;\n  flex-shrink: 0;\n  font-size: 0.75rem;\n  height: 2.25rem;\n  line-height: 0;\n  margin: 0;\n  padding: 0.75rem;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 2.25rem;\n}\n:host([type=\"info\"]) #hxToast::after {\n  border-left-color: #3b44a9;\n}\n:host([type=\"info\"]) #hxIcon {\n  color: #3b44a9;\n}\n:host([type=\"error\"]) #hxToast::after {\n  border-left-color: #d32f2f;\n}\n:host([type=\"error\"]) #hxIcon {\n  color: #d32f2f;\n}\n:host([type=\"success\"]) #hxToast::after {\n  border-left-color: #4caf51;\n}\n:host([type=\"success\"]) #hxIcon {\n  color: #4caf51;\n}\n";

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
        return `<style>${shadowStyles$f}</style>${shadowMarkup$f}`;
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

var shadowMarkup$g = "<div id='hxTooltip' class='has-arrow'><slot></slot></div>";

var shadowStyles$g = "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\n/* MIXINS */\n.has-arrow {\n  margin: 0;\n  position: relative;\n  /*======================================== *\\\n   * TOP POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * RIGHT POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * BOTTOM POSITIONS\n  \\*======================================== */\n  /*======================================== *\\\n   * LEFT POSITIONS\n  \\*======================================== */\n}\n.has-arrow::before {\n  box-shadow: 0 0 0 1px #e0e0e0;\n  z-index: -1;\n}\n.has-arrow::before,\n.has-arrow::after {\n  content: '';\n  display: block;\n  height: 13px;\n  position: absolute;\n  width: 13px;\n}\n.has-arrow[position^=\"top\"] {\n  margin-bottom: 8px;\n}\n.has-arrow[position^=\"top\"]::before,\n.has-arrow[position^=\"top\"]::after {\n  bottom: -8px;\n}\n.has-arrow[position^=\"top\"]::after {\n  background-image: linear-gradient(to bottom left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before,\n.has-arrow[position=\"top\"]::after,\n.has-arrow[position=\"top-center\"]::after {\n  left: 50%;\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top\"]::before,\n.has-arrow[position=\"top-center\"]::before,\n.has-arrow[position=\"top\"]::after,\n.has-arrow[position=\"top-center\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"top-right\"]::before,\n.has-arrow[position=\"top-right\"]::after {\n  left: 1.25rem;\n}\n.has-arrow[position=\"top-right\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top-right\"]::before,\n.has-arrow[position=\"top-right\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"top-left\"]::before,\n.has-arrow[position=\"top-left\"]::after {\n  right: 1.25rem;\n}\n.has-arrow[position=\"top-left\"]::after {\n  background-image: linear-gradient(to bottom right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"top-left\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"top-left\"]::before,\n.has-arrow[position=\"top-left\"]::after {\n  transform-origin: bottom right;\n  transform: rotate(45deg);\n}\n.has-arrow[position^=\"right\"] {\n  margin-left: 8px;\n}\n.has-arrow[position^=\"right\"]::before,\n.has-arrow[position^=\"right\"]::after {\n  left: -8px;\n}\n.has-arrow[position^=\"right\"]::after {\n  background-image: linear-gradient(to top left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before,\n.has-arrow[position=\"right\"]::after,\n.has-arrow[position=\"right-middle\"]::after {\n  top: 50%;\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right\"]::before,\n.has-arrow[position=\"right-middle\"]::before,\n.has-arrow[position=\"right\"]::after,\n.has-arrow[position=\"right-middle\"]::after {\n  transform-origin: top left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"right-bottom\"]::before,\n.has-arrow[position=\"right-bottom\"]::after {\n  top: 1.25rem;\n}\n.has-arrow[position=\"right-bottom\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right-bottom\"]::before,\n.has-arrow[position=\"right-bottom\"]::after {\n  transform-origin: top left;\n  transform: rotate(-45deg);\n}\n.has-arrow[position=\"right-top\"]::before,\n.has-arrow[position=\"right-top\"]::after {\n  bottom: 1.25rem;\n}\n.has-arrow[position=\"right-top\"]::after {\n  background-image: linear-gradient(to bottom left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"right-top\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"right-top\"]::before,\n.has-arrow[position=\"right-top\"]::after {\n  transform-origin: bottom left;\n  transform: rotate(45deg);\n}\n.has-arrow[position^=\"bottom\"] {\n  margin-top: 8px;\n}\n.has-arrow[position^=\"bottom\"]::before,\n.has-arrow[position^=\"bottom\"]::after {\n  top: -8px;\n}\n.has-arrow[position^=\"bottom\"]::after {\n  background-image: linear-gradient(to top left, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"bottom\"]::before,\n.has-arrow[position=\"bottom-center\"]::before,\n.has-arrow[position=\"bottom\"]::after,\n.has-arrow[position=\"bottom-center\"]::after {\n  left: 50%;\n}\n.has-arrow[position=\"bottom\"]::before,\n.has-arrow[position=\"bottom-center\"]::before,\n.has-arrow[position=\"bottom\"]::after,\n.has-arrow[position=\"bottom-center\"]::after {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"bottom-right\"]::before,\n.has-arrow[position=\"bottom-right\"]::after {\n  left: 1.25rem;\n}\n.has-arrow[position=\"bottom-right\"]::before,\n.has-arrow[position=\"bottom-right\"]::after {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"bottom-left\"]::before,\n.has-arrow[position=\"bottom-left\"]::after {\n  right: 1.25rem;\n}\n.has-arrow[position=\"bottom-left\"]::after {\n  background-image: linear-gradient(to top right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"bottom-left\"]::before,\n.has-arrow[position=\"bottom-left\"]::after {\n  transform-origin: top right;\n  transform: rotate(-45deg);\n}\n.has-arrow[position^=\"left\"] {\n  margin-right: 8px;\n}\n.has-arrow[position^=\"left\"]::before,\n.has-arrow[position^=\"left\"]::after {\n  right: -8px;\n}\n.has-arrow[position^=\"left\"]::after {\n  background-image: linear-gradient(to top right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before,\n.has-arrow[position=\"left\"]::after,\n.has-arrow[position=\"left-middle\"]::after {\n  top: 50%;\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left\"]::before,\n.has-arrow[position=\"left-middle\"]::before,\n.has-arrow[position=\"left\"]::after,\n.has-arrow[position=\"left-middle\"]::after {\n  transform-origin: top right;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"left-bottom\"]::before,\n.has-arrow[position=\"left-bottom\"]::after {\n  top: 1.25rem;\n}\n.has-arrow[position=\"left-bottom\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, 3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left-bottom\"]::before,\n.has-arrow[position=\"left-bottom\"]::after {\n  transform-origin: top right;\n  transform: rotate(45deg);\n}\n.has-arrow[position=\"left-top\"]::before,\n.has-arrow[position=\"left-top\"]::after {\n  bottom: 1.25rem;\n}\n.has-arrow[position=\"left-top\"]::after {\n  background-image: linear-gradient(to bottom right, transparent 50%, #ffffff 50%);\n}\n.has-arrow[position=\"left-top\"]::before {\n  box-shadow: 0 0 0 1px #e0e0e0, -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n.has-arrow[position=\"left-top\"]::before,\n.has-arrow[position=\"left-top\"]::after {\n  transform-origin: bottom right;\n  transform: rotate(-45deg);\n}\n#hxTooltip {\n  background-color: #ffffff;\n  border-radius: 2px;\n  border: 1px solid #e0e0e0;\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16);\n  padding: 0.75rem;\n}\n";

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
        return `<style>${shadowStyles$g}</style>${shadowMarkup$g}`;
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

        this.addEventListener('reposition', this._onReposition);
        this._connectToControl();
    }

    /** @override */
    $onDisconnect () {
        super.$onDisconnect();

        this.removeEventListener('reposition', this._onReposition);
        this._detachListeners();
    }

    /** @override */
    static get $observedAttributes () {
        return super.$observedAttributes.concat([ 'for' ]);
    }

    /** @override */
    $onAttributeChange (attr, oldVal, newVal) {
        super.$onAttributeChange(attr, oldVal, newVal);

        switch (attr) {
            case 'for':
                this._connectToControl();
                break;

            case 'position':
                this._setShadowPosition(newVal);
                break;
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

    /** @private */
    _onReposition () {
        this._setShadowPosition(this.optimumPosition);
    }

    /** @private */
    _setShadowPosition (position) {
        this._elRoot.setAttribute('position', position);
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
    HXAccordionElement: HXAccordionElement,
    HXAccordionPanelElement: HXAccordionPanelElement,
    HXAlertElement: HXAlertElement,
    HXBusyElement: HXBusyElement,
    HXCheckboxElement: HXCheckboxElement,
    HXDisclosureElement: HXDisclosureElement,
    HXDivElement: HXDivElement,
    HXDropFenceElement: HXDropFenceElement,
    HXDropZoneElement: HXDropZoneElement,
    HXElement: HXElement,
    HXErrorElement: HXErrorElement,
    HXFileIconElement: HXFileIconElement,
    HXFileInputElement: HXFileInputElement,
    HXFileTileElement: HXFileTileElement,
    HXIconElement: HXIconElement,
    HXMenuElement: HXMenuElement,
    HXMenuitemElement: HXMenuitemElement,
    HXModalElement: HXModalElement,
    HXPillElement: HXPillElement,
    HXPopoverElement: HXPopoverElement,
    HXProgressElement: HXProgressElement,
    HXRevealElement: HXRevealElement,
    HXSearchAssistanceElement: HXSearchAssistanceElement,
    HXSearchElement: HXSearchElement,
    HXTabElement: HXTabElement,
    HXTabcontentElement: HXTabcontentElement,
    HXTablistElement: HXTablistElement,
    HXTabpanelElement: HXTabpanelElement,
    HXTabsetElement: HXTabsetElement,
    HXToastElement: HXToastElement,
    HXTooltipElement: HXTooltipElement
});

var version = "0.15.0";

/** @module HelixUI */

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
 * Initialize HelixUI when Web Components are ready.
 */
function initialize () {
    if (window.WebComponents) {
        // Polyfill detected
        if (window.WebComponents.ready) {
            // polyfill already finished loading, initialize immediately
            _defineElements();
        } else {
            // initialize when polyfill has finished loading
            window.addEventListener('WebComponentsReady', function () {
                _defineElements();
            });
        }
    } else {
        // No polyfills detected, initialize immediately
        _defineElements();
    }
}

export { initialize, Elements, version as VERSION, MAP as ICONS, index as Utils };
