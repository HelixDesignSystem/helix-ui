// Keep track of prepared templates
const TEMPLATE_CACHE = {};

/**
 * Define functionality common to all HelixUI elements.
 *
 * @extends external:HTMLElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXElement extends HTMLElement {
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
