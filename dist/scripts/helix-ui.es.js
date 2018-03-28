const KEYS = {
    Alt: 18,
    Backspace: 8,
    Control: 17,
    Delete: 46,
    Down: 40,
    End: 35,
    Enter: 13,
    Escape: 27,
    Home: 36,
    Insert: 45,
    Left: 37,
    PageDown: 34,
    PageUp: 33,
    Right: 39,
    Shift: 16,
    Space: 32,
    Tab: 9,
    Up: 38,
};

// ALIASES
KEYS['Ctrl'] = KEYS['Control'];
KEYS['Del'] = KEYS['Delete'];
KEYS['Esc'] = KEYS['Escape'];
KEYS['Ins'] = KEYS['Insert'];
KEYS['Option'] = KEYS['Alt'];
KEYS['PgDown'] = KEYS['PageDown'];
KEYS['PgUp'] = KEYS['PageUp'];
KEYS['Return'] = KEYS['Enter'];

function getCenter (off, ref) {
    let x = ref.left + (ref.width / 2) - (off.width / 2);
    let y = ref.top + (ref.height / 2) - (off.height / 2);
    return [ x, y ];
}

function getTop (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top - off.height;
    y -= config.margin;
    return [ x, y ];
}

function getBottom (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top + ref.height;
    y += config.margin;
    return [ x, y ];
}

function getLeft (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left - off.width - config.margin;
    return [ x, y ];
}

function getRight (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left + ref.width + config.margin;
    return [ x, y ];
}

function getTopLeft (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

function getTopStart (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

function getTopEnd (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

function getTopRight (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

function getRightTop (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

function getRightStart (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

function getRightEnd (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

function getRightBottom (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

function getBottomRight (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

function getBottomEnd (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

function getBottomStart (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

function getBottomLeft (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

function getLeftBottom (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

function getLeftEnd (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

function getLeftStart (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

function getLeftTop (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

const offsetFunctions = {
    'top-left': getTopLeft,
    'top-start': getTopStart,
    'top': getTop,
    'top-end': getTopEnd,
    'top-right': getTopRight,
    'right-top': getRightTop,
    'right-start': getRightStart,
    'right': getRight,
    'right-end': getRightEnd,
    'right-bottom': getRightBottom,
    'bottom-right': getBottomRight,
    'bottom-end': getBottomEnd,
    'bottom': getBottom,
    'bottom-start': getBottomStart,
    'bottom-left': getBottomLeft,
    'left-bottom': getLeftBottom,
    'left-end': getLeftEnd,
    'left': getLeft,
    'left-start': getLeftStart,
    'left-top': getLeftTop,
    'center': getCenter,
};

/**
 * @typedef {Object} Config
 * @param {String} [config.position='top']
 * position of offsetElement in relation to referenceElement
 * @param {Integer} [config.margin=0]
 * distance in pixels between offset element and reference element
 * @param {Integer} [config.offset=0]
 * offset in pixels towards the center axis
*/

/**
 * Calculate the top, right, bottom, and left x/y values of
 * an element at given coordinates.
 *
 * @function
 * @param {HTMLElement} element
 * @param {Object} coord - (x,y) coordinates
 */
function _getElementBox (element, coord) {
    let boundingRect = element.getBoundingClientRect();

    return {
        top: coord.y,
        right: coord.x + boundingRect.width,
        bottom: coord.y + boundingRect.height,
        left: coord.x,
    };
}

/**
 * Calculate coordinates of an element in relation to a reference element.
 *
 * @function
 * @param {String} position - the position of the offset element
 * @param {HTMLElement} offsetElement - the element to calculate (x,y) coordinates
 * @param {HTMLElement} referenceElement - the element that is being offset from
 * @param {Config} config - configuration object
 *
 * @returns {Object} absolute (x,y) coordinates and metadata to position offsetElement
 * in relation to referenceElement
 */
function _getCoords (position, offsetElement, referenceElement, config) {
    // The 'position' property is added to provide information about final
    // calculated position of offset element in relation to reference element
    let coords = {
        x: 0,
        y: 0,
        position,
    };

    let offRect = offsetElement.getBoundingClientRect();
    let refRect = referenceElement.getBoundingClientRect();

    [ coords.x, coords.y ] = offsetFunctions[position](offRect, refRect, config);
    coords.x += window.pageXOffset;
    coords.y += window.pageYOffset;

    return coords;
}

/**
 * Determine if any side of an element is obscured by the viewport.
 *
 * @function
 * @argument {HTMLElement} element - the element to check against the viewport
 * @argument {Object} coords - (x,y) coordinates
 *
 * @returns {Object} metadata object with boolean values to quickly
 * identify which sides of an element are outside the viewport
 */
function _getOffscreenMetadata (element, coords) {
    let elementBox = _getElementBox(element, coords);
    let viewportBox = {
        top: window.pageYOffset,
        right: window.innerWidth + window.pageXOffset,
        bottom: window.innerHeight + window.pageYOffset,
        left: window.pageXOffset,
    };

    let offscreen = {
        top: elementBox.top < viewportBox.top,
        right: elementBox.right > viewportBox.right,
        bottom: elementBox.bottom > viewportBox.bottom,
        left: elementBox.left < viewportBox.left,
    };

    offscreen.vertically = (offscreen.top || offscreen.bottom);
    offscreen.horizontally = (offscreen.left || offscreen.right);
    offscreen.anywhere = (offscreen.vertically || offscreen.horizontally);

    return offscreen;
}

/**
 * Modify the position of an element so that it appears toward
 * the center of the viewport.
 *
 * @function
 * @param {String} position - the current position
 * @param {Object} offscreen - offscreen metadata
 * @returns {String} corrected position
 */
function _repositionTowardCenter (position, offscreen) {
    let vShiftMap = {
        'top': 'bottom',
        'top-right': 'bottom-right',
        'top-left': 'bottom-left',
        'top-start': 'bottom-start',
        'top-end': 'bottom-end',
        'right': 'right',
        'right-top': 'right-bottom',
        'right-bottom': 'right-top',
        'right-start': 'right-end',
        'right-end': 'right-start',
        'bottom': 'top',
        'bottom-right': 'top-right',
        'bottom-left': 'top-left',
        'bottom-start': 'top-start',
        'bottom-end': 'top-end',
        'left': 'left',
        'left-top': 'left-bottom',
        'left-bottom': 'left-top',
        'left-start': 'left-end',
        'left-end': 'left-start',
    };

    let hShiftMap = {
        'top': 'top',
        'top-right': 'top-left',
        'top-left': 'top-right',
        'top-start': 'top-end',
        'top-end': 'top-start',
        'right': 'left',
        'right-top': 'left-top',
        'right-bottom': 'left-bottom',
        'right-start': 'left-start',
        'right-end': 'left-end',
        'bottom': 'bottom',
        'bottom-right': 'bottom-left',
        'bottom-left': 'bottom-right',
        'bottom-start': 'bottom-end',
        'bottom-end': 'bottom-start',
        'left': 'right',
        'left-top': 'right-top',
        'left-bottom': 'right-bottom',
        'left-start': 'right-start',
        'left-end': 'right-end',
    };

    if (offscreen.vertically) {
        position = vShiftMap[position];
    }

    if (offscreen.horizontally) {
        position = hShiftMap[position];
    }

    return position;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @function
 * @param {Element} offsetElement element to position
 * @param {Element} referenceElement
 * reference element used to calculate position of offsetElement
 * @param {Config} config - configuration object
 *
 * @returns {Object} (x,y) coordinates
 */
function getPosition (offsetElement, referenceElement, config) {
    let defaults = {
        position: 'top',
        margin: 0,
        offset: 0,
    };
    let cfg = Object.assign({}, defaults, config);
    
    let coords = _getCoords(cfg.position, offsetElement, referenceElement, cfg);
    let isOffscreen = _getOffscreenMetadata(offsetElement, coords);

    if (isOffscreen.anywhere) {
        let newPosition = _repositionTowardCenter(cfg.position, isOffscreen);
        let newCoords = _getCoords(newPosition, offsetElement, referenceElement, cfg);

        //If the repositioned element is no longer offscreen,
        //use the respositioned element coordinates
        isOffscreen = _getOffscreenMetadata(offsetElement, newCoords);
        if (!isOffscreen.anywhere) {
            coords = newCoords;
        }
    }

    return coords;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @function
 * @param {Element} offsetElement element to position
 * @param {Element} referenceElement
 * reference element used to calculate position of offsetElement
 * @param {Config} config - configuration object
 * @param {Integer} [config.margin=12]
 * distance in pixels between the base and the tip of the arrow
 * @param {Integer} [config.offset=20]
 * distance in pixels from the edge of the offset element to the center of the arrow
 *
 * @returns {Object} (x,y) coordinates
 */
function getPositionWithArrow (offsetElement, referenceElement, config) {
    let defaults = {
        margin: 12, // base to tip of the arrow
        offset: 20, // distance from the edge to the center of the arrow
    };

    let cfg = Object.assign({}, defaults, config);

    return getPosition(offsetElement, referenceElement, cfg);
}

class HXElement extends HTMLElement {
    static $define () {
        customElements.define(this.is, this);
    }

    static get observedAttributes () {
        return [ 'disabled' ];
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

    connectedCallback () {
        this._$tabIndex = this.getAttribute('tabindex') || 0;
        this.$upgradeProperty('disabled');
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);

        switch (attr) {
            case 'disabled':
                if (hasValue) {
                    this.removeAttribute('tabindex');
                    this.setAttribute('aria-disabled', true);
                    this.blur();
                } else {
                    this.setAttribute('tabindex', this._$tabIndex);
                    this.removeAttribute('aria-disabled');
                }
                break;
        }
    }//attributeChangedCallback

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
            detail: details,
        });
        this.dispatchEvent(evt);
    }//$emit

    // Properties
    set disabled (value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled () {
        return this.hasAttribute('disabled');
    }
}//HXElement

class HXAccordionElement extends HXElement {
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

var shadowStyles = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\nhx-icon {\n  background-color: transparent;\n  color: inherit;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  line-height: 1;\n  vertical-align: initial;\n  width: 1em;\n}\nhx-icon svg {\n  fill: currentColor;\n  stroke: none;\n}\n#toggle {\n  background-color: transparent;\n  border: 0;\n  cursor: pointer;\n  padding: 0;\n  text-align: left;\n  width: 100%;\n}\n#toggle[aria-expanded=\"true\"] .header__icon {\n  transform: scaleY(-1);\n}\n.header {\n  align-items: center;\n  display: flex;\n}\n.header__content {\n  flex-shrink: 0;\n  flex-grow: 1;\n}\n.header__icon {\n  flex-shrink: 0;\n  margin-left: 0.5rem;\n}\n#body {\n  display: none;\n}\n#body[aria-expanded=\"true\"] {\n  display: block;\n}\n";

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  <style>${shadowStyles}</style>
  <button id="toggle" aria-controls="body" aria-expanded="false">
    <div class="header">
      <span class="header__content">
        <slot name="header"></slot>
      </span>
      <hx-icon class="header__icon" type="angle-down"></hx-icon>
    </div>
  </button>
  <div id="body" aria-expanded="false">
    <slot></slot>
  </div>
`;

class HXAccordionPanelElement extends HXElement {
    static get is () {
        return tagName;
    }

    constructor () {
        super(tagName, template);

        this._btnToggle = this.shadowRoot.getElementById('toggle');
        this._elBody = this.shadowRoot.getElementById('body');
        this._onClick = this._onClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this._btnToggle.addEventListener('click', this._onClick);
    }

    disconnectedCallback () {
        this._btnToggle.removeEventListener('click', this._onClick);
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        let isOpen = (newVal !== null);

        if (newVal !== oldVal) {
            this._btnToggle.setAttribute('aria-expanded', isOpen);
            this._elBody.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                this.$emit('open');
            }
        }
    }

    // PUBLIC PROPERTIES

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

    // PRIVATE METHODS

    _onClick () {
        if (!this.disabled) {
            this.open = !this.open;
        }
    }
}

const tagName$1 = 'hx-busy';
// leave ShadowDOM template empty to remove LightDOM children
const template$1 = document.createElement('template');

class HXBusyElement extends HXElement {
    static get is () {
        return tagName$1;
    }

    constructor () {
        super(tagName$1, template$1);
    }

    connectedCallback () {
        this.$upgradeProperty('paused');
        this.$defaultAttribute('aria-hidden', true);
    }

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
}//HXBusyElement

var shadowStyles$1 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\nhx-icon {\n  background-color: transparent;\n  color: inherit;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  line-height: 1;\n  vertical-align: initial;\n  width: 1em;\n}\nhx-icon svg {\n  fill: currentColor;\n  stroke: none;\n}\n#container {\n  display: flex;\n  height: 100%;\n  position: relative;\n  width: 100%;\n}\n#customControl {\n  align-content: center;\n  align-items: center;\n  background-color: #ffffff;\n  border: 1px solid currentColor;\n  border-radius: 2px;\n  color: #bdbdbd;\n  display: flex;\n  font-size: 0.625rem;\n  /* ~10px */\n  height: 100%;\n  justify-content: center;\n  left: 0;\n  position: absolute;\n  top: 0;\n  vertical-align: middle;\n  width: 100%;\n  z-index: 10;\n}\n#customControl:hover {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n/* icons */\n#minus,\n#tick {\n  display: none;\n  height: 1em;\n  line-height: 1;\n  width: 1em;\n}\n#nativeControl:checked:not(:indeterminate) ~ #customControl #tick {\n  display: block;\n}\n#nativeControl:indeterminate ~ #customControl #minus {\n  display: block;\n}\n#nativeControl {\n  /* opacity 0 because Firefox and OS focus styles */\n  opacity: 0;\n  z-index: 0;\n  /* default checked and indeterminate (checked or unchecked) */\n  /* disabled unchecked */\n}\n#nativeControl:focus {\n  border: none;\n  outline: none;\n}\n#nativeControl:focus ~ #customControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n#nativeControl:checked ~ #customControl,\n#nativeControl:indeterminate ~ #customControl {\n  color: #0c7c84;\n}\n#nativeControl:checked ~ #customControl:hover,\n#nativeControl:indeterminate ~ #customControl:hover {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n#nativeControl:disabled ~ #customControl {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n  cursor: not-allowed;\n}\n#nativeControl:disabled ~ #customControl:hover {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n}\n/* invalid */\n:host([invalid]) {\n  /* below styles needed to override above, custom control styles */\n  /* invalid and checked or indeterminate */\n  /* invalid and disabled */\n}\n:host([invalid]) #customControl {\n  border-width: 2px;\n  color: #d32f2f;\n}\n:host([invalid]) #customControl:hover {\n  background-color: #ffcdd2;\n}\n:host([invalid]) #nativeControl:focus ~ #customControl {\n  border-color: #d32f2f;\n  box-shadow: 0 0 4px rgba(211, 47, 47, 0.5);\n}\n:host([invalid]) #nativeControl:checked ~ #customControl,\n:host([invalid]) #nativeControl:indeterminate ~ #customControl {\n  color: #d32f2f;\n}\n:host([invalid]) #nativeControl:checked ~ #customControl:hover,\n:host([invalid]) #nativeControl:indeterminate ~ #customControl:hover {\n  background-color: #ffcdd2;\n}\n:host([invalid]) #nativeControl:disabled ~ #customControl {\n  border-width: 1px;\n  color: #bdbdbd;\n}\n:host([invalid]) #nativeControl:disabled ~ #customControl:hover {\n  background-color: #eeeeee;\n}\n";

const tagName$2 = 'hx-checkbox';
const template$2 = document.createElement('template');

template$2.innerHTML = `
  <style>${shadowStyles$1}</style>
  <label id="container">
    <input type="checkbox" id="nativeControl"/>
    <div id="customControl">
      <hx-icon type="checkmark" id="tick"></hx-icon>
      <hx-icon type="minus" id="minus"></hx-icon>
    </div>
  </label>
`;

class HXCheckboxElement extends HXElement {
    static get is () {
        return tagName$2;
    }

    static get observedAttributes () {
        return [
            'checked',
            'disabled',
            'indeterminate',
        ];
    }

    constructor () {
        super(tagName$2, template$2);
        this._input = this.shadowRoot.getElementById('nativeControl');
        this._onChange = this._onChange.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('checked');
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('indeterminate');
        this._input.addEventListener('change', this._onChange);
    }

    disconnectedCallback () {
        this._input.removeEventListener('change', this._onChange);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);
        switch (attr) {
            case 'indeterminate':
                this._input.indeterminate = hasValue;
                break;
            case 'checked':
                if (this._input.checked !== hasValue) {
                    this._input.checked = hasValue;
                }
                break;
            case 'disabled':
                this._input.disabled = hasValue;
                break;
        }
    }//attributeChangedCallback()

    set checked (value) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    get checked () {
        return this.hasAttribute('checked');
    }

    set indeterminate (value) {
        if (value) {
            this.setAttribute('indeterminate', '');
        } else {
            this.removeAttribute('indeterminate');
        }
    }

    get indeterminate () {
        return this.hasAttribute('indeterminate');
    }

    set disabled (value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled () {
        return this.hasAttribute('disabled');
    }

    _onChange (evt) {
        // Update internal state
        this.checked = evt.target.checked;

        // Prevent 'change' listeners from firing twice in polyfilled browsers.
        evt.stopImmediatePropagation();

        // Emit a new 'change' event from the custom element
        this.$emit('change');
    }
}//HXCheckboxElement

class HXDisclosureElement extends HXElement {
    static get is () {
        return 'hx-disclosure';
    }

    static get observedAttributes () {
        return super.observedAttributes.concat([
            'aria-expanded',
        ]);
    }

    constructor () {
        super();
        this._onTargetOpen = this._onTargetOpen.bind(this);
        this._onTargetClose = this._onTargetClose.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        this.$upgradeProperty('expanded');
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex') && !this.disabled) {
            this.setAttribute('tabindex', 0);
        }

        if (this.target) {
            this.expanded = this.target.hasAttribute('open');
            this.target.addEventListener('open', this._onTargetOpen);
            this.target.addEventListener('close', this._onTargetClose);
        } else {
            this.expanded = false;
        }

        this.addEventListener('click', this._toggle);
        this.addEventListener('keydown', this.$preventScroll);
        this.addEventListener('keyup', this._keyUp);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this._toggle);
        this.removeEventListener('keydown', this.$preventScroll);
        this.removeEventListener('keyup', this._keyUp);

        if (this.target) {
            this.target.removeEventListener('open', this._onTargetOpen);
            this.target.removeEventListener('close', this._onTargetClose);
        }
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);

        switch(attr) {
            case 'aria-expanded':
                if (this.target) {
                    let setTo = (newVal === 'true');
                    if (this.target.open !== setTo) {
                        this.target.open = setTo;
                    }
                }
                break;
        }
    }

    get expanded () {
        return this.getAttribute('aria-expanded') === 'true';
    }

    set expanded (newVal) {
        this.setAttribute('aria-expanded', !!newVal);
    }

    get target () {
        if (!this._target) {
            let targetId = this.getAttribute('aria-controls');
            this._target = this.getRootNode().getElementById(targetId);
        }
        return this._target;
    }

    _keyUp (event) {
        switch (event.keyCode) {
            case KEYS.Space:
            case KEYS.Enter:
                this._toggle();
                break;
            default:
                break;
        }
    }

    _toggle () {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }

    _onTargetOpen () {
        this.expanded = true;
    }

    _onTargetClose () {
        this.expanded = false;
    }
}//HXDisclosureElement

var shadowStyles$2 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\nhx-icon {\n  background-color: transparent;\n  color: inherit;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  line-height: 1;\n  vertical-align: initial;\n  width: 1em;\n}\nhx-icon svg {\n  fill: currentColor;\n  stroke: none;\n}\n";

const tagName$3 = 'hx-error';
const template$3 = document.createElement('template');

template$3.innerHTML = `
  <style>${shadowStyles$2}</style>
  <hx-icon type="exclamation-circle"></hx-icon>
  <slot></slot>
`;

class HXErrorElement extends HXElement {
    static get is () {
        return tagName$3;
    }

    constructor () {
        super(tagName$3, template$3);
    }
}//HXErrorElement

var _account = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.2 2c.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8h-2.4a1.2 1.2 0 1 0-2.4 0H5.6a1.2 1.2 0 0 0-2.4 0H.8c-.44 0-.8-.36-.8-.8V2.8c0-.44.36-.8.8-.8h14.4zM9 10.562v-.437a.44.44 0 0 0-.242-.392c-.075-.037-1.859-.92-3.258-.92s-3.183.883-3.258.92a.44.44 0 0 0-.242.392v.437c0 .242.196.438.438.438h6.125A.438.438 0 0 0 9 10.562zm-5.287-4.74v.875c0 .965.785 1.75 1.75 1.75s1.75-.785 1.75-1.75v-.875c0-.965-.785-1.75-1.75-1.75s-1.75.785-1.75 1.75zM10 11h4v-1h-4v1zm0-3h4V7h-4v1zm0-3h4V4h-4v1z'/></svg>";

var _angleBottom = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 3.01a.997.997 0 0 1-.232.64l-5.765 6.912-5.77-6.921A1 1 0 1 1 3.767 2.36l4.235 5.079 4.23-5.071A1.001 1.001 0 0 1 14 3.01zM2 12.562a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1z'/></svg>";

var _angleDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.004 12.561l-5.771-6.92a1 1 0 1 1 1.535-1.282l4.236 5.08 4.229-5.072a1 1 0 0 1 1.535 1.281l-5.764 6.913z'/></svg>";

var _angleEnd = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3.229 1.78c.226 0 .452.077.64.233l6.912 5.765-6.921 5.77a1 1 0 1 1-1.281-1.535l5.079-4.235-5.071-4.23a1.001 1.001 0 0 1 .642-1.767zm9.552 12a1 1 0 0 1-1-1v-10a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z'/></svg>";

var _angleLeft = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.409 13.985a.997.997 0 0 1-.64-.232L3.857 7.988l6.92-5.77a1 1 0 1 1 1.282 1.535l-5.08 4.235 5.072 4.23a1.001 1.001 0 0 1-.642 1.767z'/></svg>";

var _angleRight = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.65 2.232a1 1 0 1 0-1.282 1.536l5.07 4.229-5.079 4.235a1 1 0 0 0 1.281 1.536l6.921-5.771L5.65 2.232z'/></svg>";

var _angleStart = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.771 13.78a.997.997 0 0 1-.64-.231L5.22 7.784l6.921-5.771a1 1 0 1 1 1.281 1.536L8.342 7.784l5.071 4.229a1.001 1.001 0 0 1-.642 1.768zm-9.552-12a1 1 0 0 1 1 1v10a1 1 0 0 1-2 0v-10a1 1 0 0 1 1-1z'/></svg>";

var _angleTop = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 12.552c0-.226.076-.452.232-.64L7.997 5l5.771 6.921a1 1 0 1 1-1.536 1.281L7.997 8.123l-4.229 5.071A1.001 1.001 0 0 1 2 12.552zM14 3a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h10a1 1 0 0 1 1 1z'/></svg>";

var _angleUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13.001 11.562c-.287 0-.571-.123-.769-.36L7.996 6.125l-4.228 5.07a1 1 0 1 1-1.536-1.281L7.996 3l5.772 6.92a1.001 1.001 0 0 1-.767 1.642'/></svg>";

var _bell = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 13.752c-2.651 0-4.8-.373-4.8-.832 0-.46 2.149-.832 4.8-.832s4.8.372 4.8.832c0 .46-2.149.832-4.8.832m6.371-1.69c-1.196-1.06-2.186-2.333-2.186-6.422 0-1.597-1.243-3.329-3.31-3.724C8.875 1.408 8.483 1 8 1s-.875.41-.875.915v.001c-2.067.395-3.31 2.127-3.31 3.724 0 4.09-.99 5.361-2.186 6.422-.4.262-.629.552-.629.858C1 14.068 4.134 15 8 15s7-.932 7-2.08c0-.306-.229-.596-.629-.858'/></svg>";

var _billing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.969 0L14 3.031V15c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h7.969zM9 6h3V5H9v1zm0 3h3V8H9v1zm-5 3h8v-1H4v1zm1.448-8.978c-.804.101-1.45.723-1.45 1.456 0 .809.782 1.52 1.673 1.52h.754c.352 0 .582.203.584.517a.46.46 0 0 1-.127.338.514.514 0 0 1-.457.148L4 7.002v.996l1.448-.001V9h1.104V7.99a1.53 1.53 0 0 0 1.03-.43c.275-.273.425-.647.423-1.052-.008-.859-.687-1.506-1.58-1.506h-.754c-.329 0-.677-.27-.677-.524 0-.243.335-.48.677-.48H8v-.996H6.552V2H5.448v1.022z'/></svg>";

var _calendar = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7 12.981h2v-2.02H7v2.02zm-3.999 0h2v-2.02H3v2.02zm8-4.029H13v-2.02h-2v2.02zm-4 0h2v-2.02H7v2.02zm-4 0h2v-2.02H3v2.02zm8.769-6.66c0-.112-.127-.21-.27-.21h-.537c-.144 0-.27.098-.27.21v2.556c0 .11.126.209.27.209h.536c.144 0 .27-.099.27-.21V2.292zm-6.462 0c0-.112-.126-.21-.27-.21h-.537c-.144 0-.27.098-.27.21v2.556c0 .11.126.209.27.209h.537c.144 0 .27-.099.27-.21V2.292zM15 13.918c0 .59-.487 1.081-1.076 1.081H2.077C1.488 15 1 14.51 1 13.919V4.246c0-.592.488-1.082 1.077-1.082h1.077v-.811C3.154 1.609 3.761 1 4.501 1h.537c.74 0 1.348.609 1.348 1.353v.81h3.23v-.81c0-.744.606-1.353 1.347-1.353h.536c.741 0 1.347.609 1.347 1.353v.81h1.078c.589 0 1.076.49 1.076 1.083v9.673z'/></svg>";

var _checkmark = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.038 14.997c-.438 0-.858-.192-1.145-.53L1.355 9.111a1.5 1.5 0 0 1 2.289-1.939l3.171 3.742 5.392-9.175a1.5 1.5 0 0 1 2.586 1.52L8.331 14.257a1.5 1.5 0 0 1-1.293.74'/></svg>";

var _checkmarkCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.16 5.9l-4.164 5.418a1 1 0 0 1-.74.39c-.018.002-.035.002-.053.002-.273 0-.535-.113-.725-.312L3.91 8.694a1 1 0 0 1 1.45-1.378l1.763 1.856 3.451-4.492A1 1 0 0 1 12.16 5.9M8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7'/></svg>";

var _cog = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.006 10.16A2.19 2.19 0 0 1 5.82 7.973a2.19 2.19 0 0 1 2.187-2.188 2.19 2.19 0 0 1 2.188 2.188 2.19 2.19 0 0 1-2.188 2.187m6.778-3.458l-1.292-.209a5.673 5.673 0 0 0-.73-1.635l.807-.972a.246.246 0 0 0-.014-.323L12.22 2.23a.253.253 0 0 0-.326-.019l-1.058.834a5.634 5.634 0 0 0-1.615-.626l-.085-1.2A.238.238 0 0 0 8.904 1H7.019a.243.243 0 0 0-.237.218l-.102 1.23a5.63 5.63 0 0 0-1.539.618L4.03 2.209a.256.256 0 0 0-.327.021L2.369 3.563a.253.253 0 0 0-.019.326l.845 1.059a5.65 5.65 0 0 0-.688 1.597l-1.29.1A.241.241 0 0 0 1 6.88v1.886c0 .12.098.23.217.245l1.228.148a5.62 5.62 0 0 0 .647 1.669l-.741.93a.25.25 0 0 0 .018.325l1.333 1.333a.263.263 0 0 0 .33.024l.915-.677c.547.35 1.157.609 1.81.756l.094 1.263a.24.24 0 0 0 .235.218h1.761c.12 0 .232-.097.247-.217l.16-1.264a5.634 5.634 0 0 0 1.776-.735l.862.654a.26.26 0 0 0 .329-.022l1.334-1.333a.263.263 0 0 0 .023-.331l-.671-.903c.33-.563.568-1.187.69-1.852l1.185-.094A.24.24 0 0 0 15 8.668V6.955a.267.267 0 0 0-.216-.253'/></svg>";

var _copy = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9 6c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h7zm5-5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h1V3H8v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1h7z'/></svg>";

var _download = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.081 12.581L4.22 8.701a.999.999 0 0 1 .004-1.414.999.999 0 0 1 1.414.003l1.377 1.384.04-6.68c.003-.552.483-.976 1.006-.994a1 1 0 0 1 .994 1.006l-.04 6.804 1.512-1.52a1.001 1.001 0 0 1 1.418 1.411l-3.863 3.88zM14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1z'/></svg>";

var _envelope = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.995 2C15.55 2 16 2.458 16 3.019v1.055L8.017 8.861 0 4.062V3.019C0 2.458.453 2 1.005 2h13.99zm-6.978 8.885c.189 0 .379-.05.545-.15L16 6.276V12.982c0 .56-.45 1.019-1 1.019H1c-.549 0-1-.458-1-1.02V6.263l7.473 4.474c.165.099.355.149.544.149z'/></svg>";

var _exclamationCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8.654 10H7.466a.52.52 0 0 1-.515-.5l-.15-5a.485.485 0 0 1 .485-.5H8.87c.275 0 .515.201.482.5l-.179 5c.013.251-.244.5-.518.5M8.5 13h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1c.275 0 .5.225.5.5v1c0 .275-.225.5-.5.5M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7'/></svg>";

var _exclamationDiamond = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.692 7.253c.41.412.41 1.082 0 1.492l-6.946 6.948c-.41.41-1.082.41-1.492 0L.308 8.745a1.057 1.057 0 0 1 0-1.493L7.254.308c.41-.41 1.082-.41 1.492 0l6.946 6.946zM8.654 10c.274 0 .531-.249.518-.5l.18-5c.032-.299-.208-.5-.483-.5H7.286a.485.485 0 0 0-.486.5l.151 5c.008.275.24.5.515.5h1.188zM8.5 13c.275 0 .5-.225.5-.5v-1c0-.275-.225-.5-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1z'/></svg>";

var _exclamationTriangle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.19 9.008c-.01.275-.072.612-.14.75-.067.137-.622.25-.896.25h-.189c-.274 0-.614-.05-.752-.113-.14-.062-.269-.612-.277-.887l-.12-4c-.008-.276.032-.613.09-.75.058-.138.605-.25.88-.25h.584c.275 0 .616.045.758.1.14.055.216.624.207.9l-.146 4zm-.19 3c0 .274-.05.612-.113.75-.062.137-.612.25-.886.25-.276 0-.613-.05-.75-.113-.139-.062-.25-.613-.25-.887 0-.275.05-.613.111-.75.063-.138.612-.25.889-.25.274 0 .612.05.75.112.136.062.25.613.25.888zm5.832 1.292c-.28-.562-.567-1.12-.85-1.679-1.683-3.315-3.366-6.63-5.046-9.947-.204-.402-.49-.667-.925-.674-.423-.007-.724.234-.924.627-1.982 3.906-3.965 7.812-5.94 11.724a1.395 1.395 0 0 0-.145.663c.03.595.476.984 1.084.984 1.97.003 3.942.001 5.913.001 1.962 0 3.926.002 5.89 0 .928-.002 1.38-.819.944-1.699z'/></svg>";

var _export = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.452 6.138c-.2.19-.463.285-.724.285-.261 0-.522-.093-.721-.282a.937.937 0 0 1-.004-1.373L8 1l3.896 3.768a.938.938 0 0 1-.003 1.373c-.4.378-1.048.375-1.445-.003L9.043 4.796 9 11.28c-.004.534-.46.964-1.027.964-.566-.003-1.02-.44-1.016-.976L7 4.658 5.452 6.138zM14 7.835a1 1 0 0 1 1 1V13.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V8.836a1 1 0 1 1 2 0V13h10V8.836a1 1 0 0 1 1-1z'/></svg>";

var _externalLink = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10 1h5v5a1 1 0 1 1-2 0V4.509L8.099 9.411a1 1 0 0 1-1.414-1.414L11.682 3H10a1 1 0 1 1 0-2zm2 7a1 1 0 0 1 1 1v4.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 13.5v-9A1.5 1.5 0 0 1 2.5 3H7a1 1 0 1 1 0 2H3v8h8V9a1 1 0 0 1 1-1z'/></svg>";

var _filter = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.811 2.084L9.909 6.986v7.378a.644.644 0 0 1-.387.587.743.743 0 0 1-.25.049.592.592 0 0 1-.447-.189L6.28 12.266a.63.63 0 0 1-.189-.447V6.986L1.19 2.084a.626.626 0 0 1-.14-.696c.1-.229.329-.388.587-.388h12.727c.258 0 .487.16.586.389a.626.626 0 0 1-.139.695'/></svg>";

var _helpCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M10.789 6.858c-.14.278-.366.562-.677.853l-.733.657c-.209.192-.354.39-.435.591a2.55 2.55 0 0 0-.134.541H6.985c0-.367.07-.838.21-1.183.142-.347.368-.647.684-.9.314-.254.554-.486.717-.697.165-.211.247-.444.247-.697 0-.618-.278-.927-.831-.927-.254 0-.46.09-.618.27-.14.159-.217.377-.24.748H5c.034-.893.293-1.498.792-1.93.527-.456 1.267-.684 2.22-.684.95 0 1.684.21 2.206.632.52.422.782 1.02.782 1.8 0 .339-.07.648-.211.926m-2.075 5.861A.98.98 0 0 1 8 13a.98.98 0 0 1-.714-.28A.965.965 0 0 1 7 12c0-.291.095-.532.286-.72A.98.98 0 0 1 8 11a.968.968 0 0 1 1 1 .969.969 0 0 1-.286.72M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7'/></svg>";

var _infoCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.859 0 7 3.141 7 7 0 3.861-3.141 7-7 7s-7-3.139-7-7c0-3.859 3.141-7 7-7zm-.25 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm1.785 6.019h-.542c.004-1.328.003-4.146-.003-4.633-.003-.251-.115-.374-.32-.37-.189.006-.376.003-.565.002H7.302 6.5a.5.5 0 1 0 0 1h.497a889.327 889.327 0 0 0 0 4H6.5a.5.5 0 1 0 0 1h3.035a.5.5 0 0 0 0-1z'/></svg>";

var _inputFile = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15 4c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V5c0-.005.003-.009.003-.013 0-.005-.003-.008-.003-.013V3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1h9zm-7.3 8.022l.053-.001a1 1 0 0 0 .74-.39l3.237-4.214a1.001 1.001 0 0 0-1.586-1.219L7.62 9.485 6.426 8.23a1 1 0 1 0-1.45 1.378l2 2.103c.19.199.451.311.724.311z'/></svg>";

var _inputTime = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15.827 10.24a.5.5 0 0 1 .066.686l-2.197 2.878c-.099.13-.233.163-.399.196a.707.707 0 0 1-.366-.13l-1.399-1.438a.467.467 0 0 1 0-.686c.2-.196.532-.163.732 0l1.033 1.013 1.83-2.454a.523.523 0 0 1 .7-.065zM6.022 2c3.326 0 6.022 2.675 6.022 5.973 0 3.299-2.696 5.974-6.022 5.974S0 11.272 0 7.973C0 4.675 2.696 2 6.022 2zm1.122 7.449V4.412a.904.904 0 0 0-.915-.894c-.505 0-.913.4-.913.894v3.233l-1.82-.016h-.01a.904.904 0 0 0-.914.886.904.904 0 0 0 .906.902l3.666.032z'/></svg>";

var _inputUrl = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.652 3.478a8.466 8.466 0 0 0 2.005 1.324c-.187.87-.3 1.827-.324 2.832H3.36v.025H1.176A.348.348 0 0 0 1 7.707a6.948 6.948 0 0 1 1.652-4.229zm10.766.082A6.946 6.946 0 0 1 15 7.66h-2.267v-.025H11.7a15.256 15.256 0 0 0-.313-2.777 8.435 8.435 0 0 0 2.031-1.297zM5.235 5.047c-.16.792-.26 1.665-.28 2.587h5.938a14.851 14.851 0 0 0-.26-2.481 8.005 8.005 0 0 1-5.398-.106zm.204-.849C5.981 2.268 6.914 1 7.924 1c1.028 0 1.977 1.314 2.514 3.304a7.248 7.248 0 0 1-4.999-.106zm-2.2-1.332a6.999 6.999 0 0 1 3.006-1.64c-.568.641-1.04 1.584-1.372 2.723a7.665 7.665 0 0 1-1.634-1.083zm7.331 8.288a14.63 14.63 0 0 0 .324-2.822h-5.94c.022 1.056.146 2.048.347 2.927a7.026 7.026 0 0 1 5.27-.105zm-.216.837C9.804 13.815 8.9 15 7.924 15c-.958 0-1.847-1.14-2.398-2.906a6.378 6.378 0 0 1 4.828-.103zm2.763.777a8.224 8.224 0 0 0-.571-.492 7.588 7.588 0 0 0-1.217-.814c.217-.933.347-1.972.371-3.067h3.296a6.953 6.953 0 0 1-1.88 4.373zm-10.17.065a6.955 6.955 0 0 1-1.944-4.484c.051.029.11.046.173.046h3.157a15.01 15.01 0 0 0 .386 3.132 7.413 7.413 0 0 0-.348.208 8.02 8.02 0 0 0-1.424 1.098zm9.451.394c.04.036.08.073.118.11a6.995 6.995 0 0 1-2.641 1.391c.492-.593.908-1.417 1.218-2.4.46.246.897.546 1.305.9zm-7.904-.575c.151-.1.305-.192.46-.278.311.968.724 1.78 1.213 2.365a6.993 6.993 0 0 1-2.592-1.329c.29-.282.598-.535.92-.758zm6.644-8.778c-.33-1.1-.79-2.011-1.341-2.638a6.998 6.998 0 0 1 2.898 1.568 7.511 7.511 0 0 1-1.557 1.07z'/></svg>";

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

var _lock = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6 4.827C6 3.837 6.916 3 8 3s2 .837 2 1.827v2.646H6V4.827zm7.766 2.646H12V4.827C12 2.723 10.2 1 8 1S4 2.723 4 4.827v2.646H2.234C1.556 7.473 1 8.028 1 8.707v5.531c0 .679.556 1.235 1.234 1.235h11.532c.678 0 1.234-.556 1.234-1.235V8.707c0-.679-.556-1.234-1.234-1.234z'/></svg>";

var _minus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13.152 9H2.847c-.466 0-.845-.448-.845-1s.379-1 .845-1h10.306c.47 0 .849.448.849 1s-.38 1-.848 1'/></svg>";

var _minusCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 1c3.859 0 7 3.141 7 7 0 3.86-3.141 7-7 7s-7-3.14-7-7c0-3.859 3.141-7 7-7zm4 8a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2h8z'/></svg>";

var _monitoring = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M15 12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v9h13zM11.267 2H15v3.78l-1.174-1.19-4.05 4.049a1 1 0 0 1-1.413 0l-1.42-1.42-2.68 2.679a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l3.387-3.386a.996.996 0 0 1 1.414 0l1.42 1.42 3.35-3.351L11.267 2z'/></svg>";

var _payment = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.714 11.083C9.714 13.8 7.54 16 4.858 16 2.174 16 0 13.799 0 11.083c0-2.715 2.174-4.918 4.858-4.918 2.682 0 4.856 2.203 4.856 4.918zM10.801 1C13.672 1 16 3.357 16 6.263c0 2.695-2.01 4.891-4.588 5.2.012-.164.025-.327.025-.495 0-.32-.031-.63-.076-.939a3.805 3.805 0 0 0 3.218-3.766c0-2.109-1.696-3.824-3.778-3.824-1.595 0-2.955 1.01-3.507 2.428a6.277 6.277 0 0 0-1.371-.365C6.64 2.466 8.543 1 10.8 1zM5.174 12.706a.48.48 0 0 1-.368.14c-.214 0-.379-.068-.495-.206-.116-.14-.175-.34-.175-.606H2.974c0 .482.134.87.402 1.164.268.294.653.47 1.154.522v.705h.548v-.7c.43-.043.77-.19 1.02-.44.249-.253.373-.577.373-.975 0-.235-.038-.437-.116-.604a1.39 1.39 0 0 0-.324-.44 2.275 2.275 0 0 0-.493-.337 8.98 8.98 0 0 0-.605-.287c-.213-.091-.369-.187-.466-.29a.563.563 0 0 1-.145-.41c0-.17.043-.303.127-.4a.443.443 0 0 1 .353-.144c.17 0 .302.065.393.195.093.13.139.317.139.559H6.5c0-.442-.122-.808-.362-1.095-.24-.287-.57-.462-.99-.524v-.751h-.55v.736c-.437.042-.786.19-1.048.444-.262.257-.394.58-.394.974 0 .235.038.435.112.6.072.165.178.31.316.436s.304.237.495.332c.19.096.398.19.623.283.225.093.383.193.472.297.09.105.135.248.135.433a.537.537 0 0 1-.135.389zM11.482 7.9a.5.5 0 0 1-.286-.09L9.714 6.797V3.807c0-.294.232-.534.518-.534.285 0 .517.24.517.534v2.414l1.02.698a.546.546 0 0 1 .144.742.512.512 0 0 1-.43.24z'/></svg>";

var _pencil = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.423 10.716L9.567 3.56l2.802 2.807-7.145 7.158-2.801-2.808zm-1.415 3.895l.708-3.186 2.8 2.807-3.122.759a.32.32 0 0 1-.386-.38zm13.85-11.355a.489.489 0 0 1-.004.693l-.776.765.007.007-.953.924-2.802-2.807.34-.33c.004-.003.005-.01.01-.015l1.373-1.351a.498.498 0 0 1 .7.003l2.104 2.11z'/></svg>";

var _phone = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.177 10.059h-3.294a.823.823 0 0 0-.824.824v.823c-3.294 0-5.713-2.522-5.765-5.764h.823a.824.824 0 0 0 .825-.824V1.824A.824.824 0 0 0 5.117 1H1.823A.824.824 0 0 0 1 1.824v4.118A9.058 9.058 0 0 0 10.059 15h4.118a.822.822 0 0 0 .823-.823v-3.294a.823.823 0 0 0-.823-.824'/></svg>";

var _plus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14 7H9V2a1 1 0 1 0-2 0v5H2a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0V9h5a1 1 0 1 0 0-2'/></svg>";

var _plusOrMinus = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.508 15H3.49c-.408 0-.74-.392-.74-.875s.332-.875.74-.875h9.018c.41 0 .742.392.742.875s-.331.875-.742.875zM8.875 5.375h3.5a.875.875 0 1 1 0 1.75h-3.5v3.5a.875.875 0 1 1-1.75 0v-3.5h-3.5a.875.875 0 1 1 0-1.75h3.5v-3.5a.875.875 0 1 1 1.75 0v3.5z'/></svg>";

var _search = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M6.494 10a3.502 3.502 0 0 1-3.496-3.5c0-1.93 1.568-3.5 3.496-3.5A3.502 3.502 0 0 1 9.99 6.5c0 1.93-1.568 3.5-3.496 3.5m8.213 3.292l-3.683-3.683a5.475 5.475 0 0 0 .963-3.109c0-3.038-2.459-5.5-5.493-5.5A5.497 5.497 0 0 0 1 6.5C1 9.538 3.46 12 6.494 12a5.456 5.456 0 0 0 3.118-.975l3.683 3.683a.998.998 0 0 0 1.412-.001 1 1 0 0 0 0-1.415'/></svg>";

var _server = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1 10.783h14v2.811C15 14.37 14.372 15 13.6 15H2.4c-.773 0-1.4-.63-1.4-1.406v-2.811zm0-.646V5.92h14v4.217H1zm14-4.92H1V2.406C1 1.63 1.628 1 2.4 1h11.2c.773 0 1.4.63 1.4 1.406v2.811zM3.107 13.398h3.36v-1.125h-3.36v1.125zm7.242-1.125a.56.56 0 0 0-.56.562.56.56 0 1 0 1.12 0 .56.56 0 0 0-.56-.562zm1.983 0a.56.56 0 0 0-.56.562.56.56 0 1 0 1.121 0 .561.561 0 0 0-.561-.562zM3.1 8.591h3.36V7.466H3.1v1.125zm7.249-1.125a.56.56 0 0 0-.56.562.561.561 0 1 0 1.12 0 .56.56 0 0 0-.56-.562zm1.983 0a.56.56 0 0 0-.56.562.561.561 0 1 0 1.121 0 .561.561 0 0 0-.561-.562zM3.1 3.728h3.36V2.603H3.1v1.125zm7.249-1.125a.56.56 0 0 0-.56.562.56.56 0 1 0 1.12 0 .56.56 0 0 0-.56-.562zm1.983 0a.56.56 0 0 0-.56.562.56.56 0 1 0 1.121 0 .561.561 0 0 0-.561-.562z'/></svg>";

var _sort = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M7.12 3.898v8.204l-1.41-1.41a1 1 0 0 0-1.416 0 1 1 0 0 0 0 1.416L8.187 16l3.888-3.888a1 1 0 1 0-1.416-1.416l-1.535 1.535V3.769l1.535 1.535a1 1 0 0 0 1.416 0 1 1 0 0 0 0-1.416L8.187 0 4.294 3.892a1 1 0 0 0 0 1.416 1 1 0 0 0 1.416 0l1.41-1.41z'/></svg>";

var _sortDown = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.075 10.696a1 1 0 0 0-1.416 0l-1.535 1.535V1.002a1.001 1.001 0 1 0-2.003 0v11.1l-1.411-1.41a1 1 0 0 0-1.416 0 1 1 0 0 0 0 1.416L8.187 16l3.888-3.888a1 1 0 0 0 0-1.416'/></svg>";

var _sortUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.293 5.305a.997.997 0 0 0 1.414 0L7.239 3.77v11.229a1 1 0 1 0 2 0v-11.1l1.409 1.41a.998.998 0 0 0 1.415 0c.39-.391.39-1.025 0-1.416L8.175 0 4.293 3.889a1.001 1.001 0 0 0 0 1.416'/></svg>";

var _support = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.334 8.048c.189 3.135-.773 4.94-2.448 6.172-.606.446-1.593 1.033-2.633.663-.26-.093-1.155-.52-1.74-1.045-.652-.588-.985-1.276-.985-1.276.179.073.68.25 1.158.362.482.114.996.17 1.071.179.177.356.613.609 1.124.609.667 0 1.208-.43 1.208-.96s-.54-.96-1.208-.96c-.493 0-.915.235-1.104.57a4.37 4.37 0 0 1-1.847-.426c-.656-.32-1.08-.802-1.095-.853A7.437 7.437 0 0 1 3.6 9.8c-.056-.677-.019-1.32-.019-1.32s.608.075 1.554-.986c.854-.956.831-2.565.831-2.565.389.848 3.809 2.695 6.035 2.426.238-.03.293.664.333.692zm2.243.024c.258.242.423.596.423.99v1.577c0 .724-.554 1.317-1.232 1.317h-.544-.031v-.003a.336.336 0 0 1-.292-.342c0-.044.008-.087.023-.126l.001-.01c.209-.75.33-1.622.33-2.634 0-.26-.008-.491-.024-.74v-.005-.006c0-.19.143-.344.32-.345h.216c.037 0 .072.002.108.006-.148-1.594-.627-2.95-1.408-3.964-1.04-1.353-2.594-2.068-4.493-2.068-1.802 0-3.313.713-4.37 2.064C2.79 4.82 2.29 6.178 2.134 7.75c.033-.003.065-.005.098-.005h.069c.176 0 .319.15.322.338l.001.003v.004c-.018.245-.027.495-.027.75a8.117 8.117 0 0 0 .449 2.702l.005.015a.094.094 0 0 1 0 .051l.001.003a.335.335 0 0 1-.306.343l-.002.002h-.512C1.554 11.956 1 11.363 1 10.64V9.062c0-.398.168-.755.43-.997.122-1.879.687-3.507 1.654-4.742C4.274 1.803 5.965 1 7.974 1c2.108 0 3.843.806 5.016 2.332.93 1.209 1.473 2.837 1.587 4.74zM9.75 9.91c.434 0 .785-.375.785-.838 0-.463-.351-.838-.785-.838-.433 0-.784.375-.784.838 0 .463.351.838.784.838zm-3.584 0c.433 0 .784-.375.784-.838 0-.463-.351-.838-.784-.838-.433 0-.784.375-.784.838 0 .463.35.838.784.838z'/></svg>";

var _tag = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2.856 1h4.082c.196 0 .386.078.524.218l7.32 7.32a.74.74 0 0 1 0 1.05l-5.194 5.195c-.29.29-.76.29-1.05 0l-7.32-7.321A.737.737 0 0 1 1 6.938V2.856C1 1.83 1.83 1 2.856 1zm.99 4.01a1.311 1.311 0 1 0 0-2.623 1.311 1.311 0 0 0 0 2.623z'/></svg>";

var _technicalChange = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.914 11.676a.106.106 0 0 1 .086.101v.686c0 .048-.04.091-.087.095l-.476.037a2.239 2.239 0 0 1-.276.742l.27.362a.106.106 0 0 1-.01.133l-.535.533a.105.105 0 0 1-.132.009l-.346-.262a2.272 2.272 0 0 1-.712.295l-.064.506a.104.104 0 0 1-.1.087h-.706a.097.097 0 0 1-.094-.087l-.037-.507a2.231 2.231 0 0 1-.726-.303l-.368.272a.105.105 0 0 1-.132-.01l-.535-.533a.1.1 0 0 1-.007-.131l.297-.372a2.279 2.279 0 0 1-.26-.669l-.493-.059a.102.102 0 0 1-.086-.099v-.754c0-.049.04-.091.087-.095l.517-.04c.06-.229.153-.444.277-.639l-.339-.425a.1.1 0 0 1 .007-.131l.535-.533a.103.103 0 0 1 .131-.009l.446.343a2.25 2.25 0 0 1 .617-.247l.042-.493a.096.096 0 0 1 .095-.087h.756c.048 0 .09.039.093.087l.034.481c.231.051.448.137.648.251l.424-.334a.102.102 0 0 1 .131.008l.534.533a.099.099 0 0 1 .006.13l-.323.389c.13.199.23.42.292.655l.519.084zm-6.726.388c0 .212.03.416.062.62H2.17c-.645 0-1.17-.525-1.17-1.169V9.178h8.43a3.98 3.98 0 0 0-1.242 2.886zm4.005-4c-.716 0-1.377.202-1.958.53H1V5.089h11.7v3.026c-.168-.022-.334-.051-.507-.051zm.507-3.559H1V2.168A1.17 1.17 0 0 1 2.17 1h9.36c.645 0 1.17.524 1.17 1.168v2.337zm-2.23 1.869a.467.467 0 1 0-.001.934.467.467 0 0 0 0-.934zm-1.657.935a.468.468 0 1 0 .002-.935.468.468 0 0 0-.002.935zm-6.058 0h2.808v-.935H2.755v.935zm9.44 5.752a.878.878 0 0 0 .877-.876.878.878 0 0 0-1.754 0c0 .483.394.876.877.876zM2.76 11.398h2.808v-.935H2.76v.935zm0-8.131h2.808v-.935H2.76v.935zm6.053-.935a.467.467 0 1 0 0 .935.468.468 0 1 0 0-.935zm1.657 0a.467.467 0 1 0-.001.934.467.467 0 0 0 0-.934z'/></svg>";

var _technicalIncident = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.93 14.286c.183.37-.007.713-.395.714h-2.467l-2.478-.001c-.253 0-.441-.164-.454-.413a.598.598 0 0 1 .062-.279c.827-1.642 1.657-3.281 2.487-4.922.084-.165.211-.265.388-.263.181.003.302.114.386.283l2.115 4.176c.119.235.239.469.356.705zm-5.87-3.028l-.706 1.396h-6.19A1.165 1.165 0 0 1 1 11.488v-2.33h9.122l-.269.53-.63 1.244c.002-.009.007-.017.007-.027a.466.466 0 1 0-.465.467.455.455 0 0 0 .294-.114zm3.038-3.636a1.977 1.977 0 0 0-1.657.953H1V5.079h11.627v2.63a1.86 1.86 0 0 0-.53-.087zm.529-3.125H1V2.166C1 1.523 1.521 1 2.163 1h9.302c.642 0 1.162.523 1.162 1.166v2.33zm-.065 8.26l.072-2.007c.014-.12-.083-.2-.193-.2h-.635c-.11 0-.197.09-.194.2l.06 2.008c.003.11.096.201.206.201h.477c.11 0 .213-.1.207-.201zm-.068 1.206v-.403c0-.11-.09-.2-.202-.2h-.4a.2.2 0 0 0-.2.2v.403c0 .11.09.2.2.2h.4c.111 0 .202-.09.202-.2zM9.947 6.826a.465.465 0 1 0 .93.003.465.465 0 0 0-.93-.003zm-1.182.467a.466.466 0 1 0-.001-.932.466.466 0 0 0 0 .932zm-6.02 0h2.79v-.932h-2.79v.933zm-.005 4.079h2.79v-.932H2.74v.932zm0-8.11h2.79v-.933H2.74v.933zm6.025-.933a.465.465 0 1 0-.001.93.465.465 0 0 0 0-.93zm1.647 0a.465.465 0 1 0 0 .93.465.465 0 0 0 0-.93z'/></svg>";

var _ticketing = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M13 2.997c.55 0 1 .45 1 1V15c0 .55-.45 1-1 1H5.997c-.55 0-1-.45-1-1V3.997c0-.55.45-1 1-1H13zm-1.997-1.028h-7V13H3c-.55 0-1-.444-1-.984V.985C2 .443 2.45 0 3 0h7.003c.55 0 1 .443 1 .985v.984zM6.988 11.997h5.022v-.985H6.988v.985zm-.001 1.97h3.049v-.986h-3.05v.985zm.164-6.121l2.076 2.032 2.697-4.088a.488.488 0 0 0-.147-.68.506.506 0 0 0-.691.144L9.059 8.326 7.856 7.148a.504.504 0 0 0-.707.002.487.487 0 0 0 .002.696z'/></svg>";

var _times = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M9.414 8l4.293-4.293a.999.999 0 1 0-1.414-1.414L8 6.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L6.586 8l-4.293 4.293a.999.999 0 1 0 1.414 1.414L8 9.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L9.414 8z'/></svg>";

var _timesCircle = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M11.682 10.268a.999.999 0 1 1-1.414 1.414L8 9.414l-2.267 2.268a.999.999 0 1 1-1.414-1.414L6.586 8 4.319 5.732a.999.999 0 1 1 1.414-1.414L8 6.586l2.268-2.268a.999.999 0 1 1 1.414 1.414L9.414 8l2.268 2.268zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z'/></svg>";

var _trash = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 13.27V5h12v8.27c0 .95-.778 1.729-1.729 1.729H3.729A1.734 1.734 0 0 1 2 13.268zM14 2c.55 0 1 .45 1 1v1H1V3c0-.55.45-1 1-1h4V1h4v1h4zM5 8.555v2.998a1 1 0 1 0 2 0V8.555a1 1 0 1 0-2 0zm4 0v2.998a1 1 0 1 0 2 0V8.555a1 1 0 1 0-2 0z'/></svg>";

var _user = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M14.517 12.467c-.15-.075-3.717-1.842-6.517-1.842-2.798 0-6.366 1.767-6.516 1.842A.876.876 0 0 0 1 13.25v.875c0 .483.392.875.875.875h12.25a.875.875 0 0 0 .875-.875v-.875a.875.875 0 0 0-.483-.783M4.5 6.25V4.5C4.5 2.57 6.07 1 8 1s3.5 1.57 3.5 3.5v1.75c0 1.93-1.57 3.5-3.5 3.5a3.505 3.505 0 0 1-3.5-3.5'/></svg>";

var Icons = {
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
    'cog': _cog,
    'copy': _copy,
    'download': _download,
    'envelope': _envelope,
    'exclamation-circle': _exclamationCircle,
    'exclamation-diamond': _exclamationDiamond,
    'exclamation-triangle': _exclamationTriangle,
    'export': _export,
    'external-link': _externalLink,
    'filter': _filter,
    'help-circle': _helpCircle,
    'info-circle': _infoCircle,
    'input-file': _inputFile,
    'input-time': _inputTime,
    'input-url': _inputUrl,
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
    'lock': _lock,
    'minus': _minus,
    'minus-circle': _minusCircle,
    'monitoring': _monitoring,
    'payment': _payment,
    'pencil': _pencil,
    'phone': _phone,
    'plus': _plus,
    'plus-or-minus': _plusOrMinus,
    'search': _search,
    'server': _server,
    'sort': _sort,
    'sort-down': _sortDown,
    'sort-up': _sortUp,
    'support': _support,
    'tag': _tag,
    'technical-change': _technicalChange,
    'technical-incident': _technicalIncident,
    'ticketing': _ticketing,
    'times': _times,
    'times-circle': _timesCircle,
    'trash': _trash,
    'user': _user,
};

class HXIconElement extends HXElement {
    static get is () {
        return 'hx-icon';
    }

    static get icons () {
        return Icons;
    }

    static get observedAttributes () {
        return [ 'type' ];
    }

    constructor (type) {
        super();

        if (type) {
            this.type = type;
        }
    }

    connectedCallback () {
        this.$upgradeProperty('type');
        this.$defaultAttribute('aria-hidden', true);
        this._render();
    }

    attributeChangedCallback () {
        this._render();
    }

    get type () {
        return this.getAttribute('type');
    }

    set type (newVal) {
        this.setAttribute('type', newVal);
    }

    _render () {
        // erase previously injected markup
        this.innerHTML = '';

        if (this.type in Icons) {
            // create surrogate DIV to add raw SVG markup
            const tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = Icons[this.type];
            // grab SVG from surrogate DIV
            const svg = tmpDiv.firstElementChild;

            // inject SVG into Light DOM
            this.appendChild(svg);
        }
    }//_render()
}//HXIconElement

class HXMenuElement extends HXElement {
    static get is () {
        return 'hx-menu';
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super();
        this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');
        this.$defaultAttribute('position', 'bottom-start');
        this.$defaultAttribute('role', 'menu');
        this._initialPosition = this.position;
        document.addEventListener('click', this._onDocumentClick);
    }

    disconnectedCallback () {
        document.removeEventListener('click', this._onDocumentClick);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-expanded', newValue === '');
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        if (this.hasAttribute('position')) {
            return this.getAttribute('position');
        }
        return undefined;
    }

    set relativeTo (value) {
        this.setAttribute('relative-to', value);
    }

    get relativeTo () {
        return this.getAttribute('relative-to');
    }

    get relativeElement () {
        if (this.relativeTo) {
            return this.getRootNode().getElementById(this.relativeTo);
        } else {
            return this.getRootNode().querySelector(`[aria-controls="${this.id}"]`);
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
            this.$emit('open');
        } else {
            this.removeAttribute('open');
            this.$emit('close');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    _setPosition () {
        var offset = getPosition(this, this.relativeElement, {
            position: this.position,
            margin: 2,
        });
        this.style.top = offset.y + 'px';
        this.style.left = offset.x + 'px';
    }

    _isDescendant (el) {
        if (el.closest(`hx-menu[id="${this.id}"]`)) {
            return true;
        }
        return false;
    }

    _isDisclosure (el) {
        if (el.closest(`hx-disclosure[aria-controls="${this.id}"]`)) {
            return true;
        }
        return false;
    }

    _onDocumentClick (event) {
        if (!this._isDescendant(event.target) && !this._isDisclosure(event.target)) {
            this.open = false;
        }
    }
}//HXMenuElement

class HXMenuitemElement extends HXElement {
    static get is () {
        return 'hx-menuitem';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'menuitem');
    }
}//HXMenuitemElement

var shadowStyles$3 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\nhx-icon {\n  background-color: transparent;\n  color: inherit;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  line-height: 1;\n  vertical-align: initial;\n  width: 1em;\n}\nhx-icon svg {\n  fill: currentColor;\n  stroke: none;\n}\n#container {\n  background-color: #ffffff;\n  box-shadow: 0px 7px 9px 0 rgba(0, 0, 0, 0.3);\n  display: flex;\n  flex-direction: column;\n  left: 50%;\n  max-width: 40rem;\n  min-height: 12.5rem;\n  min-width: 25rem;\n  padding: 1.25rem;\n  position: fixed;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1201;\n}\n#close {\n  border: none;\n  color: #757575;\n  cursor: pointer;\n  height: 1rem;\n  line-height: 1;\n  padding: 0;\n  position: absolute;\n  right: 1.25rem;\n  top: 1.25rem;\n}\n";

const tagName$4 = 'hx-modal';
const template$4 = document.createElement('template');

template$4.innerHTML = `
  <style>${shadowStyles$3}</style>
  <div id="container">
    <button id="close">
      <hx-icon type="times"></hx-icon>
    </button>
    <slot></slot>
  </div>
`;

class HXModalElement extends HXElement {
    static get is () {
        return tagName$4;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName$4, template$4);
        this._close = this._close.bind(this);
        this._keyUp = this._keyUp.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this._btnClose = this.shadowRoot.querySelector("#close");

        this._btnClose.addEventListener('click', this._close);
        document.addEventListener('keyup', this._keyUp);
    }

    disconnectedCallback () {
        this._btnClose.removeEventListener('click', this._close);
        document.removeEventListener('keyup', this._keyUp);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue !== '');
    }

    _close () {
        this.open = false;
    }

    _keyUp (event) {
        if (event.keyCode === KEYS.Escape) {
            this._close();
        }
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this.$emit('open');
        } else {
            this.removeAttribute('open');
            this.$emit('close');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

var shadowStyles$4 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\n.position-arrow {\n  background-color: #ffffff;\n}\n.position-arrow::before,\n.position-arrow::after {\n  content: \" \";\n  display: block;\n  height: 12px;\n  position: absolute;\n  transform: rotate(-45deg);\n  width: 12px;\n}\n.position-arrow::before {\n  background-color: #e0e0e0;\n  z-index: -1;\n}\n:host([position$='top']) .position-arrow::before,\n:host([position$='top']) .position-arrow::after {\n  bottom: 12px;\n}\n:host([position$='bottom']) .position-arrow::before,\n:host([position$='bottom']) .position-arrow::after {\n  top: 12px;\n}\n:host([position$='left']) .position-arrow::before,\n:host([position$='left']) .position-arrow::after {\n  right: 12px;\n}\n:host([position$='right']) .position-arrow::before,\n:host([position$='right']) .position-arrow::after {\n  left: 12px;\n}\n:host([position^='top']) .position-arrow::before {\n  bottom: -7px;\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n:host([position^='top']) .position-arrow::after {\n  background-image: linear-gradient(-135deg, transparent 50%, #ffffff 50%);\n  bottom: -6px;\n}\n:host([position^='bottom']) .position-arrow::before {\n  top: -7px;\n}\n:host([position^='bottom']) .position-arrow::after {\n  background-image: linear-gradient(45deg, transparent 50%, #ffffff 50%);\n  top: -6px;\n}\n:host([position^='left']) .position-arrow::before {\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n  right: -7px;\n}\n:host([position^='left']) .position-arrow::after {\n  background-image: linear-gradient(135deg, transparent 50%, #ffffff 50%);\n  right: -6px;\n}\n:host([position^='right']) .position-arrow::before {\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n  left: -7px;\n}\n:host([position^='right']) .position-arrow::after {\n  background-image: linear-gradient(-45deg, transparent 50%, #ffffff 50%);\n  left: -6px;\n}\n:host([position='top']) .position-arrow::before,\n:host([position='bottom']) .position-arrow::before,\n:host([position='top']) .position-arrow::after,\n:host([position='bottom']) .position-arrow::after {\n  left: 50%;\n  transform: translateX(-50%) rotate(-45deg);\n}\n:host([position='left']) .position-arrow::before,\n:host([position='right']) .position-arrow::before,\n:host([position='left']) .position-arrow::after,\n:host([position='right']) .position-arrow::after {\n  bottom: 50%;\n  transform: translateY(50%) rotate(-45deg);\n}\n#container {\n  overflow: hidden;\n}\n";

const tagName$5 = 'hx-popover';
const template$5 = document.createElement('template');

template$5.innerHTML = `
  <style>${shadowStyles$4}</style>
  <div class="position-arrow">
    <div id="container">
      <slot></slot>
    </div>
  </div>
`;

class HXPopoverElement extends HXElement {
    static get is () {
        return tagName$5;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName$5, template$5);
        this._toggle = this._toggle.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._closeOnBackdropClick = this._closeOnBackdropClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.$upgradeProperty('position');
        this.$defaultAttribute('position', 'bottom-right');
        this._initialPosition = this.position;

        if (!this.id) {
            return;
        }

        this._target = this.getRootNode().querySelector('[data-popover=' + this.id + ']');
        if (!this._target) {
            return;
        }

        this._target.addEventListener('click', this._toggle);
        window.addEventListener('resize', debounce_1(this._setPosition, 100));
        document.addEventListener('click', this._closeOnBackdropClick);
    }

    disconnectedCallback () {
        if (!this._target) {
            return;
        }

        this._target.removeEventListener('click', this._toggle);
        window.removeEventListener('resize', debounce_1(this._setPosition, 100));
        document.removeEventListener('click', this._closeOnBackdropClick);
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue !== '');
    }

    _toggle () {
        this.open = !this.open;
    }

    _setPosition () {
        let offset = getPositionWithArrow(this, this._target, { position: this.position });
        this.style.top = `${offset.y}px`;
        this.style.left = `${offset.x}px`;
        this.position = offset.position;
    }

    _closeOnBackdropClick (event) {
        if (this._isBackground(event) && this.open) {
            this.open = false;
        }
    }

    _isBackground (event) {
        let inComponent = this.contains(event.target);
        let inTarget = this._target.contains(event.target);
        return !inComponent && !inTarget;
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
            this.position = this._initialPosition;
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        return this.getAttribute('position');
    }
}

class HXRevealElement extends HXElement {
    static get is () {
        return 'hx-reveal';
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    connectedCallback () {
        this.$upgradeProperty('open');
        this.setAttribute('aria-expanded', this.open);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        this.setAttribute('aria-expanded', newVal === '');
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
}//HXRevealElement

var shadowStyles$5 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\nhx-icon {\n  background-color: transparent;\n  color: inherit;\n  display: inline-block;\n  flex-shrink: 0;\n  height: 1em;\n  line-height: 1;\n  vertical-align: initial;\n  width: 1em;\n}\nhx-icon svg {\n  fill: currentColor;\n  stroke: none;\n}\n:host {\n  display: block;\n  font-size: 1rem;\n  height: 2rem;\n  min-width: 8rem;\n}\n:host #wrapper {\n  display: flex;\n  height: 100%;\n  position: relative;\n}\n:host #icon {\n  color: #757575;\n  flex-shrink: 0;\n  order: 1;\n  padding: 0.5rem;\n  z-index: 1;\n}\n:host #search {\n  background-color: transparent;\n  border: none;\n  color: #424242;\n  cursor: inherit;\n  flex-grow: 1;\n  font-weight: 400;\n  min-width: 0;\n  order: 2;\n  width: 0;\n  z-index: 1;\n}\n:host #search::-moz-placeholder {\n  color: #757575;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #search::-ms-input-placeholder {\n  color: #757575;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #search::-webkit-input-placeholder {\n  color: #757575;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #search::placeholder {\n  color: #757575;\n  font-style: italic;\n  font-weight: 400;\n  opacity: 1;\n}\n:host #search::-moz-focus-inner {\n  outline: none;\n  border: none;\n}\n:host #search:focus {\n  outline: none;\n}\n:host #search:focus ~ #clear {\n  color: #0e94a6;\n}\n:host #search:focus ~ #customControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host #customControl {\n  background-color: #ffffff;\n  border-radius: 2px;\n  border: 1px solid #bdbdbd;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 0;\n}\n:host #clear {\n  background-color: transparent;\n  border: none;\n  color: #757575;\n  cursor: pointer;\n  flex-shrink: 0;\n  line-height: 1;\n  order: 3;\n  padding: 0.5rem;\n  z-index: 1;\n}\n:host #clear::-moz-focus-inner {\n  outline: none;\n  border: none;\n}\n:host #clear:focus {\n  outline: none;\n}\n:host #clear:focus hx-icon {\n  outline-offset: 2px;\n  outline: 1px dotted currentColor;\n}\n:host #clear:focus ~ * {\n  color: #0e94a6;\n}\n:host #clear:focus ~ #customControl {\n  border-color: #0e94a6;\n  box-shadow: 0 0 4px rgba(14, 148, 166, 0.5);\n}\n:host([invalid]) {\n  color: #d32f2f;\n}\n:host([invalid]) #icon,\n:host([invalid]) #clear {\n  color: inherit;\n}\n:host([invalid]) #customControl {\n  border-color: #d32f2f;\n  border-width: 2px;\n}\n:host([invalid]) #clear:focus hx-icon {\n  outline-color: currentColor;\n}\n:host([invalid]) #search:focus ~ #clear {\n  color: #d32f2f;\n}\n:host([invalid]) #clear:focus ~ #customControl,\n:host([invalid]) #search:focus ~ #customControl {\n  box-shadow: 0 0 4px rgba(211, 47, 47, 0.5);\n  border-color: #d32f2f;\n}\n:host([disabled]) {\n  color: #d8d8d8;\n}\n:host([disabled]) #wrapper {\n  color: inherit;\n  cursor: not-allowed;\n}\n:host([disabled]) #icon {\n  color: inherit;\n}\n:host([disabled]) #clear {\n  display: none;\n}\n:host([disabled]) #search {\n  color: inherit;\n}\n:host([disabled]) #search::-moz-placeholder {\n  color: inherit;\n}\n:host([disabled]) #search::-ms-input-placeholder {\n  color: inherit;\n}\n:host([disabled]) #search::-webkit-input-placeholder {\n  color: inherit;\n}\n:host([disabled]) #search::placeholder {\n  color: inherit;\n}\n:host([disabled]) #customControl {\n  background-color: #f5f5f5;\n  border-color: #e0e0e0;\n  border-width: 1px;\n}\n";

const tagName$6 = 'hx-search';
const template$6 = document.createElement('template');

template$6.innerHTML = `
    <style>${shadowStyles$5}</style>
    <label id="wrapper">
        <input type="text" role="search" id="search" autocomplete="off" />
        <button id="clear" hidden aria-label="Clear search">
            <hx-icon type="times"></hx-icon>
        </button>
        <div id="icon">
            <hx-icon type="search"></hx-icon>
        </div>
        <div id="customControl"></div>
    </label>
`;

class HXSearchElement extends HXElement {
    static get is () {
        return tagName$6;
    }

    static get observedAttributes () {
        return [
            'disabled',
            'placeholder',
            'value',
        ];
    }

    constructor () {
        super(tagName$6, template$6);
        this._elSearch = this.shadowRoot.getElementById('search');
        this._btnClear = this.shadowRoot.getElementById('clear');

        this._clearValue = this._clearValue.bind(this);
        this._onInput = this._onInput.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('disabled');
        this.$upgradeProperty('invalid');
        this.$upgradeProperty('placeholder');
        this.$upgradeProperty('value');

        this._btnClear.addEventListener('click', this._clearValue);
        this._elSearch.addEventListener('input', this._onInput);
    }

    disconnectedCallback () {
        this._btnClear.removeEventListener('click', this._clearValue);
        this._elSearch.removeEventListener('input', this._onInput);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        const hasValue = (newVal !== null);

        switch (attr) {
            case 'disabled':
                this._elSearch.disabled = hasValue;
                break;

            case 'placeholder':
                this._elSearch.placeholder = newVal;
                break;

            case 'value':
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
    }//attributeChangedCallback()

    // GETTERS
    get disabled () {
        return this.hasAttribute('disabled');
    }

    get invalid () {
        return this.hasAttribute('invalid');
    }

    get placeholder () {
        return this.getAttribute('placeholder');
    }

    get value () {
        return this.getAttribute('value');
    }

    // SETTERS
    set disabled (isDisabled) {
        if (isDisabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    set invalid (isInvalid) {
        if (isInvalid) {
            this.setAttribute('invalid', '');
        } else {
            this.removeAttribute('invalid');
        }
    }

    set placeholder (newVal) {
        if (newVal) {
            this.setAttribute('placeholder', newVal);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    set value (newVal) {
        if (newVal) {
            this.setAttribute('value', newVal);
        } else {
            this.removeAttribute('value');
        }
    }

    // PRIVATE FUNCTIONS
    _onInput (evt) {
        this.value = evt.target.value;
        if (evt.target.value === '') {
            this._btnClear.hidden = true;
        } else {
            this._btnClear.hidden = false;
        }
    }

    _clearValue () {
        this.value = '';

        // Emit a 'clear' event to communicate state change.
        this.$emit('clear');

        this._elSearch.focus();
    }
}

class HXTabcontentElement extends HXElement {
    static get is () {
        return 'hx-tabcontent';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'presentation');
    }
}//HXTabcontentElement

class HXTabElement extends HXElement {
    static get is () {
        return 'hx-tab';
    }

    connectedCallback () {
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
    }

    static get observedAttributes () {
        return [ 'current' ];
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        this.setAttribute('aria-selected', newVal !== null);
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
}//HXTabElement

class HXTablistElement extends HXElement {
    static get is () {
        return 'hx-tablist';
    }

    connectedCallback () {
        this.$defaultAttribute('role', 'tablist');
    }
}//HXTablistElement

class HXTabpanelElement extends HXRevealElement {
    static get is () {
        return 'hx-tabpanel';
    }

    connectedCallback () {
        super.connectedCallback();
        this.$defaultAttribute('role', 'tabpanel');
    }

    // because we are inheriting HXReveal, the only attribute we are watching
    // is "open"
    attributeChangedCallback (attr, oldVal, newVal) {
        super.attributeChangedCallback(arguments);
        this.setAttribute('tabindex', (newVal !== null) ? 0 : -1);
    }
}//HXTabpanelElement

class HXTabsetElement extends HXElement {
    static get is () {
        return 'hx-tabset';
    }

    static get observedAttributes () {
        return [ 'current-tab' ];
    }

    constructor () {
        super();
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTabClick = this._onTabClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('current-tab');
        this.$defaultAttribute('id', this.$generateId());
        this._setupIds();
        this.currentTab = Number(this.getAttribute('current-tab')) || 0;
        this.$tablist = this.querySelector('hx-tablist');
        this.$tablist.addEventListener('keyup', this._onKeyUp);
        this.$tablist.addEventListener('keydown', this.$preventScroll);
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this._onTabClick);
        });
    }

    disconnectedCallback () {
        this.$tablist.removeEventListener('keyup', this._onKeyUp);
        this.$tablist.removeEventListener('keydown', this.$preventScroll);
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this._onTabClick);
        });
    }

    attributeChangedCallback (attr, oldValue, newVal) {
        if (!isNaN(newVal)) {
            this.currentTab = Number(newVal);
        }
    }

    get currentTab () {
        return this._currentTab || 0;
    }

    set currentTab (idx) {
        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (idx < 0 || idx >= this.tabs.length) {
            throw new RangeError('currentTab index is out of bounds');
        }

        this._currentTab = idx;

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
    }//SET:currentTab

    get tabs () {
        return Array.from(this.querySelectorAll('hx-tablist > hx-tab'));
    }

    get tabpanels () {
        return Array.from(this.querySelectorAll('hx-tabpanel'));
    }

    _selectNext () {
        // if current tab is the last tab
        if (this.currentTab === (this.tabs.length - 1)) {
            // select first
            this.currentTab = 0;
        } else {
            // select next
            this.currentTab += 1;
        }
        this.tabs[this.currentTab].focus();
    }//_selectNext()

    _selectPrevious () {
        // if current tab is the first tab
        if (this.currentTab === 0) {
            // select last
            this.currentTab = (this.tabs.length - 1);
        } else {
            // select previous
            this.currentTab -= 1;
        }
        this.tabs[this.currentTab].focus();
    }//_selectPrevious()

    // Handle navigating the tabs via arrow keys
    _onKeyUp (evt) {
        if (evt.keyCode === KEYS.Right) {
            this._selectNext();
        }

        if (evt.keyCode === KEYS.Left) {
            this._selectPrevious();
        }
    }//_onKeyUp()

    _onTabClick (evt) {
        this.currentTab = this.tabs.indexOf(evt.target);
    }

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
    }//_setupIds
}//HXTabsetElement

var shadowStyles$6 = "* {\n  box-sizing: border-box;\n  color: inherit;\n  font: inherit;\n  letter-spacing: inherit;\n}\ninput[type=\"text\"]::-ms-clear {\n  display: none;\n}\n.position-arrow {\n  background-color: #ffffff;\n}\n.position-arrow::before,\n.position-arrow::after {\n  content: \" \";\n  display: block;\n  height: 12px;\n  position: absolute;\n  transform: rotate(-45deg);\n  width: 12px;\n}\n.position-arrow::before {\n  background-color: #e0e0e0;\n  z-index: -1;\n}\n:host([position$='top']) .position-arrow::before,\n:host([position$='top']) .position-arrow::after {\n  bottom: 12px;\n}\n:host([position$='bottom']) .position-arrow::before,\n:host([position$='bottom']) .position-arrow::after {\n  top: 12px;\n}\n:host([position$='left']) .position-arrow::before,\n:host([position$='left']) .position-arrow::after {\n  right: 12px;\n}\n:host([position$='right']) .position-arrow::before,\n:host([position$='right']) .position-arrow::after {\n  left: 12px;\n}\n:host([position^='top']) .position-arrow::before {\n  bottom: -7px;\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n}\n:host([position^='top']) .position-arrow::after {\n  background-image: linear-gradient(-135deg, transparent 50%, #ffffff 50%);\n  bottom: -6px;\n}\n:host([position^='bottom']) .position-arrow::before {\n  top: -7px;\n}\n:host([position^='bottom']) .position-arrow::after {\n  background-image: linear-gradient(45deg, transparent 50%, #ffffff 50%);\n  top: -6px;\n}\n:host([position^='left']) .position-arrow::before {\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n  right: -7px;\n}\n:host([position^='left']) .position-arrow::after {\n  background-image: linear-gradient(135deg, transparent 50%, #ffffff 50%);\n  right: -6px;\n}\n:host([position^='right']) .position-arrow::before {\n  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.16);\n  left: -7px;\n}\n:host([position^='right']) .position-arrow::after {\n  background-image: linear-gradient(-45deg, transparent 50%, #ffffff 50%);\n  left: -6px;\n}\n:host([position='top']) .position-arrow::before,\n:host([position='bottom']) .position-arrow::before,\n:host([position='top']) .position-arrow::after,\n:host([position='bottom']) .position-arrow::after {\n  left: 50%;\n  transform: translateX(-50%) rotate(-45deg);\n}\n:host([position='left']) .position-arrow::before,\n:host([position='right']) .position-arrow::before,\n:host([position='left']) .position-arrow::after,\n:host([position='right']) .position-arrow::after {\n  bottom: 50%;\n  transform: translateY(50%) rotate(-45deg);\n}\n#container {\n  padding: 1.25rem;\n}\n";

const tagName$7 = 'hx-tooltip';
const template$7 = document.createElement('template');

template$7.innerHTML = `
  <style>${shadowStyles$6}</style>
  <div id="container" class="position-arrow">
    <slot></slot>
  </div>`;

class HXTooltipElement extends HXElement {
    static get is () {
        return tagName$7;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName$7, template$7);
        this._show = this._show.bind(this);
        this._hide = this._hide.bind(this);
        this._toggle = this._toggle.bind(this);
        this._setPosition = this._setPosition.bind(this);
        this._closeOnBackgroundClick = this._closeOnBackgroundClick.bind(this);
    }

    connectedCallback () {
        this.$defaultAttribute('position', 'top');
        this.initialPosition = this.position;
        this.$upgradeProperty('open');
        this.$defaultAttribute('role', 'tooltip');

        if (this.id) {
            this._target = this.getRootNode().querySelector('[data-tooltip=' + this.id + ']');
        } else {
            return;
        }
        this._connectHandlers();
    }

    disconnectedCallback () {
        if (!this._target) {
            return;
        }
        this._destoryAllHandlers();
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue !== '');
    }

    _hide () {
        if (this._showTimer) {
            clearTimeout(this._showTimer);
        }
        this._hideTimer = setTimeout(() => {
            this.open = false;
        }, 1600);
    }

    _show () {
        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
        }
        this._showTimer = setTimeout(() => {
            this.open = true;
        }, 500);
    }

    _toggle () {
        this.open = !this.open;
    }

    _closeOnBackgroundClick (event) {
        if (this._isBackground(event)) {
            this.open = false;
        }
    }

    _connectHandlers () {
        window.addEventListener('resize', debounce_1(this._setPosition,100));
        if (this.triggerEvent === 'click') {
            document.addEventListener('click', this._closeOnBackgroundClick);
            this._target.addEventListener('click', this._toggle);
        } else {
            this._target.addEventListener('focus', this._show);
            this._target.addEventListener('blur', this._hide);
            this._target.addEventListener('mouseenter', this._show);
            this._target.addEventListener('mouseleave', this._hide);
        }
    }

    _destoryAllHandlers () {
        window.removeEventListener('resize', debounce_1(this._setPosition,100));
        document.removeEventListener('click', this._closeOnBackgroundClick);
        this._target.removeEventListener('focus', this._show);
        this._target.removeEventListener('blur', this._hide);
        this._target.removeEventListener('mouseenter', this._show);
        this._target.removeEventListener('mouseleave', this._hide);
        this._target.removeEventListener('click', this._toggle);
    }

    _setPosition () {
        var offset = getPositionWithArrow(this, this._target, { 'position':this.position });
        this.style.top = `${offset.y}px`;
        this.style.left = `${offset.x}px`;
        this.position = offset.position;
    }

    _isBackground (event) {
        let inComponent = this.contains(event.target);
        let inTarget = this._target.contains(event.target);
        return !inComponent && !inTarget ;
    }

    set position (value) {
        if (value) {
            this.setAttribute('position', value);
        } else {
            this.removeAttribute('position');
        }
    }

    get position () {
        return this.getAttribute('position');
    }

    set triggerEvent (value) {
        if (value) {
            this.setAttribute('trigger-event', value);
        } else {
            this.removeAttribute('trigger-event');
        }
    }

    get triggerEvent () {
        return this.getAttribute('trigger-event');
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this._setPosition();
        } else {
            this.removeAttribute('open');
            this.position = this.initialPosition;
        }
    }

    get open () {
        return this.hasAttribute('open');
    }
}//HXTooltipElement



var elements = Object.freeze({
	HXAccordionElement: HXAccordionElement,
	HXAccordionPanelElement: HXAccordionPanelElement,
	HXBusyElement: HXBusyElement,
	HXCheckboxElement: HXCheckboxElement,
	HXDisclosureElement: HXDisclosureElement,
	HXErrorElement: HXErrorElement,
	HXIconElement: HXIconElement,
	HXMenuElement: HXMenuElement,
	HXMenuitemElement: HXMenuitemElement,
	HXModalElement: HXModalElement,
	HXPopoverElement: HXPopoverElement,
	HXRevealElement: HXRevealElement,
	HXSearchElement: HXSearchElement,
	HXTabcontentElement: HXTabcontentElement,
	HXTabElement: HXTabElement,
	HXTablistElement: HXTablistElement,
	HXTabpanelElement: HXTabpanelElement,
	HXTabsetElement: HXTabsetElement,
	HXTooltipElement: HXTooltipElement
});

function _defineElements () {
    for (let attr in elements) {
        elements[attr].$define();
    }
}

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

const DOM = Object.assign({}, elements, { HXElement });

var HelixUI$1 = {
    DOM,
    initialize,
};

var version = "0.5.0";

HelixUI$1.VERSION = version;

export default HelixUI$1;
