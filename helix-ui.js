/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Entrypoint to build HelixUI web components
 */


/* ===== Web Components ===== */
// Each file will be responsible for defining itself
// with the custom element registry

__webpack_require__(1);

__webpack_require__(4);

__webpack_require__(64);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEY = __webpack_require__(2);
/*
 * See "Using the checkbox role" (https://goo.gl/jDZFpH)
 */

window.addEventListener('WebComponentsReady', function () {
    var tagName = 'hx-checkbox';
    var template = document.createElement('template');

    template.innerHTML = '\n      <style>' + __webpack_require__(3) + '</style>\n      <div id="container">\n        <hx-icon type="checkmark" id="tick"></hx-icon>\n        <hx-icon type="minus" id="minus"></hx-icon>\n      </div>\n    ';

    function _preventScroll(event) {
        if (event.keyCode == KEY.Space) {
            event.preventDefault();
        }
    }

    var HxCheckbox = function (_HTMLElement) {
        _inherits(HxCheckbox, _HTMLElement);

        _createClass(HxCheckbox, null, [{
            key: 'is',
            get: function get() {
                return tagName;
            }
        }, {
            key: 'observedAttributes',
            get: function get() {
                return ['checked', 'disabled', 'indeterminate'];
            }
        }]);

        function HxCheckbox() {
            _classCallCheck(this, HxCheckbox);

            var _this = _possibleConstructorReturn(this, (HxCheckbox.__proto__ || Object.getPrototypeOf(HxCheckbox)).call(this));

            _this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(_this);
            }
            _this.shadowRoot.appendChild(template.content.cloneNode(true));
            return _this;
        }

        _createClass(HxCheckbox, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                if (!this.hasAttribute('role')) {
                    this.setAttribute('role', 'checkbox');
                }
                if (!this.hasAttribute('tabindex') && !this.disabled) {
                    this.setAttribute('tabindex', 0);
                }

                this._upgradeProperty('checked');
                this._upgradeProperty('disabled');
                this._upgradeProperty('indeterminate');

                this.addEventListener('keydown', _preventScroll);
                this.addEventListener('keyup', this._onKeyUp);
                this.addEventListener('click', this._onClick);
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                this.removeEventListener('keydown', _preventScroll);
                this.removeEventListener('keyup', this._onKeyUp);
                this.removeEventListener('click', this._onClick);
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(name, oldValue, newValue) {
                var hasValue = newValue !== null;
                switch (name) {
                    case 'indeterminate':
                        if (hasValue) {
                            this.setAttribute('aria-checked', 'mixed');
                        }
                        break;

                    case 'checked':
                        if (!this.indeterminate) {
                            this.setAttribute('aria-checked', hasValue);
                        }
                        break;

                    case 'disabled':
                        this.setAttribute('aria-disabled', hasValue);
                        if (hasValue) {
                            this.removeAttribute('tabindex');
                            this.blur();
                        } else {
                            this.setAttribute('tabindex', '0');
                        }
                        break;
                }
            } //attributeChangedCallback()

        }, {
            key: '_onKeyUp',
            value: function _onKeyUp(event) {
                if (event.altKey) {
                    return;
                }

                if (event.keyCode == KEY.Space) {
                    event.preventDefault();
                    this._toggleChecked();
                }
            }
        }, {
            key: '_onClick',
            value: function _onClick(event) {
                this._toggleChecked();
            }
        }, {
            key: '_toggleChecked',
            value: function _toggleChecked() {
                if (this.disabled) {
                    return;
                }
                this.indeterminate = false;
                this.checked = !this.checked;

                var changeEvent = new CustomEvent('change', {
                    detail: {
                        checked: this.checked
                    },
                    bubbles: true
                });

                this.dispatchEvent(changeEvent);
            }

            // A user may set a property on an _instance_ of an element, before its
            // prototype has been connected to this class. The `_upgradeProperty()`
            // method will check for any instance properties and run them through
            // the proper class setters.

        }, {
            key: '_upgradeProperty',
            value: function _upgradeProperty(prop) {
                if (this.hasOwnProperty(prop)) {
                    var value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            }
        }, {
            key: 'checked',
            set: function set(value) {
                if (Boolean(value)) {
                    this.setAttribute('checked', '');
                } else {
                    this.removeAttribute('checked');
                }
            },
            get: function get() {
                return this.hasAttribute('checked');
            }
        }, {
            key: 'disabled',
            set: function set(value) {
                if (Boolean(value)) {
                    this.setAttribute('disabled', '');
                } else {
                    this.removeAttribute('disabled');
                }
            },
            get: function get() {
                return this.hasAttribute('disabled');
            }
        }, {
            key: 'indeterminate',
            set: function set(value) {
                if (Boolean(value)) {
                    this.setAttribute('indeterminate', '');
                } else {
                    this.removeAttribute('indeterminate');
                }
            },
            get: function get() {
                return this.hasAttribute('indeterminate');
            }
        }]);

        return HxCheckbox;
    }(HTMLElement);

    customElements.define(HxCheckbox.is, HxCheckbox);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var KEYCODE = {
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
    Up: 38
};

// ALIASES
KEYCODE['Ctrl'] = KEYCODE['Control'];
KEYCODE['Del'] = KEYCODE['Delete'];
KEYCODE['Esc'] = KEYCODE['Escape'];
KEYCODE['Ins'] = KEYCODE['Insert'];
KEYCODE['Option'] = KEYCODE['Alt'];
KEYCODE['PgDown'] = KEYCODE['PageDown'];
KEYCODE['PgUp'] = KEYCODE['PageUp'];
KEYCODE['Return'] = KEYCODE['Enter'];

module.exports = KEYCODE;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = ":host {\n  background-color: #ffffff;\n  border-color: currentColor;\n  border-radius: 2px;\n  border-style: solid;\n  border-width: 1px;\n  color: #bdbdbd;\n  display: inline-block;\n  height: 1rem;\n  vertical-align: middle;\n  width: 1rem;\n  /* default unchecked */\n  /* default checked */\n  /* default indeterminate (checked or unchecked) */\n  /* invalid unchecked */\n  /* invalid checked */\n  /* invalid indeterminate (checked or unchecked) */\n  /* disabled unchecked */\n  /* disabled checked */\n  /* disabled indeterminate (checked or unchecked) */\n}\n:host([hidden]) {\n  display: none;\n}\n:host(:hover) {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n:host([checked]) {\n  color: #0c7c84;\n}\n:host([checked]:hover) {\n  background-color: #e4f9f9;\n  color: #16b9d4;\n}\n:host([indeterminate]) {\n  color: #0c7c84;\n}\n:host([indeterminate]:hover) {\n  color: #16b9d4;\n}\n:host([invalid]) {\n  border-width: 2px;\n  color: #d32f2f;\n}\n:host([invalid]:hover) {\n  background-color: #ffcdd2;\n  color: #d32f2f;\n}\n:host([disabled]) {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n  cursor: not-allowed;\n}\n:host([disabled]:hover) {\n  background-color: #eeeeee;\n  color: #bdbdbd;\n}\n:host([disabled][indeterminate]) {\n  color: #bdbdbd;\n}\n#container {\n  align-content: center;\n  align-items: center;\n  display: flex;\n  font-size: 0.625em;\n  /* ~10px */\n  height: 100%;\n  justify-content: center;\n  width: 100%;\n}\n#minus,\n#tick {\n  display: none;\n  height: 1em;\n  line-height: 1;\n  width: 1em;\n}\n:host([checked]:not([indeterminate])) #tick {\n  display: block;\n}\n:host([indeterminate]) #minus {\n  display: block;\n}\n"

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.addEventListener('WebComponentsReady', function () {
    var tagName = 'hx-icon';
    var template = document.createElement('template');
    var icons = {
        'account': __webpack_require__(5),
        'angle-down': __webpack_require__(6),
        'angle-left': __webpack_require__(7),
        'angle-right': __webpack_require__(8),
        'angle-up': __webpack_require__(9),
        'bell': __webpack_require__(10),
        'billing': __webpack_require__(11),
        'calendar': __webpack_require__(12),
        'checkmark': __webpack_require__(13),
        'checkmark-circle': __webpack_require__(14),
        'cog': __webpack_require__(15),
        'copy': __webpack_require__(16),
        'download': __webpack_require__(17),
        'envelope': __webpack_require__(18),
        'exclamation-circle': __webpack_require__(19),
        'exclamation-triangle': __webpack_require__(20),
        'export': __webpack_require__(21),
        'external-link': __webpack_require__(22),
        'fanatiguy': __webpack_require__(23),
        'filter': __webpack_require__(24),
        'help-circle': __webpack_require__(25),
        'info-circle': __webpack_require__(26),
        'input-file': __webpack_require__(27),
        'input-time': __webpack_require__(28),
        'input-url': __webpack_require__(29),
        'kbd-arrow-down': __webpack_require__(30),
        'kbd-arrow-left': __webpack_require__(31),
        'kbd-arrow-right': __webpack_require__(32),
        'kbd-arrow-up': __webpack_require__(33),
        'kbd-capslock': __webpack_require__(34),
        'kbd-command': __webpack_require__(35),
        'kbd-delete': __webpack_require__(36),
        'kbd-eject': __webpack_require__(37),
        'kbd-option': __webpack_require__(38),
        'kbd-return': __webpack_require__(39),
        'kbd-shift': __webpack_require__(40),
        'kbd-space': __webpack_require__(41),
        'kbd-tab': __webpack_require__(42),
        'lock': __webpack_require__(43),
        'minus': __webpack_require__(44),
        'minus-circle': __webpack_require__(45),
        'monitoring': __webpack_require__(46),
        'pencil': __webpack_require__(47),
        'phone': __webpack_require__(48),
        'plus': __webpack_require__(49),
        'plus-or-minus': __webpack_require__(50),
        'search': __webpack_require__(51),
        'server': __webpack_require__(52),
        'sort': __webpack_require__(53),
        'sort-down': __webpack_require__(54),
        'sort-up': __webpack_require__(55),
        'support': __webpack_require__(56),
        'tag': __webpack_require__(57),
        'ticketing': __webpack_require__(58),
        'times': __webpack_require__(59),
        'times-circle': __webpack_require__(60),
        'trash': __webpack_require__(61),
        'user': __webpack_require__(62)
    };

    template.innerHTML = '\n        <style>' + __webpack_require__(63) + '</style>\n        <slot></slot>\n    ';

    var HxIcon = function (_HTMLElement) {
        _inherits(HxIcon, _HTMLElement);

        _createClass(HxIcon, null, [{
            key: 'is',
            get: function get() {
                return tagName;
            }
        }, {
            key: 'observedAttributes',
            get: function get() {
                return ['type'];
            }
        }, {
            key: 'icons',
            get: function get() {
                return icons;
            }
        }]);

        function HxIcon(type) {
            _classCallCheck(this, HxIcon);

            var _this = _possibleConstructorReturn(this, (HxIcon.__proto__ || Object.getPrototypeOf(HxIcon)).call(this));

            _this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(_this);
            }
            _this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (type) {
                _this.setAttribute('type', type);
            }
            return _this;
        }

        _createClass(HxIcon, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                this._render();
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attr, oldValue, newValue) {
                if (attr === 'type') {
                    this._render();
                }
            }
        }, {
            key: '_render',
            value: function _render() {
                var type = this.getAttribute('type');

                // erase previously injected markup
                this.innerHTML = '';

                if (type in HxIcon.icons) {
                    // create surrogate DIV to add raw SVG markup
                    var tmpDiv = document.createElement('div');
                    tmpDiv.innerHTML = HxIcon.icons[type];
                    // grab SVG from surrogate DIV
                    var svg = tmpDiv.firstElementChild;

                    // inject SVG into Light DOM
                    this.appendChild(svg);
                }
            } //_render()

        }]);

        return HxIcon;
    }(HTMLElement); //HxIcon

    customElements.define(HxIcon.is, HxIcon);
});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.2 2c.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8h-2.4a1.2 1.2 0 1 0-2.4 0H5.6a1.2 1.2 0 0 0-2.4 0H.8c-.44 0-.8-.36-.8-.8V2.8c0-.44.36-.8.8-.8h14.4zM9 10.562v-.437a.44.44 0 0 0-.242-.392c-.075-.037-1.859-.92-3.258-.92s-3.183.883-3.258.92a.44.44 0 0 0-.242.392v.437c0 .242.196.438.438.438h6.125A.438.438 0 0 0 9 10.562zm-5.287-4.74v.875c0 .965.785 1.75 1.75 1.75s1.75-.785 1.75-1.75v-.875c0-.965-.785-1.75-1.75-1.75s-1.75.785-1.75 1.75zM10 11h4v-1h-4v1zm0-3h4V7h-4v1zm0-3h4V4h-4v1z\"></path></svg>"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.004 12.561l-5.771-6.92a1 1 0 1 1 1.535-1.282l4.236 5.08 4.229-5.072a1 1 0 0 1 1.535 1.281l-5.764 6.913z\"></path></svg>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M11.409 13.985a.997.997 0 0 1-.64-.232L3.857 7.988l6.92-5.77a1 1 0 1 1 1.282 1.535l-5.08 4.235 5.072 4.23a1.001 1.001 0 0 1-.642 1.767z\"></path></svg>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M5.65 2.232a1 1 0 1 0-1.282 1.536l5.07 4.229-5.079 4.235a1 1 0 0 0 1.281 1.536l6.921-5.771L5.65 2.232z\"></path></svg>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M13.001 11.562c-.287 0-.571-.123-.769-.36L7.996 6.125l-4.228 5.07a1 1 0 1 1-1.536-1.281L7.996 3l5.772 6.92a1.001 1.001 0 0 1-.767 1.642\"></path></svg>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 13.752c-2.651 0-4.8-.373-4.8-.832 0-.46 2.149-.832 4.8-.832s4.8.372 4.8.832c0 .46-2.149.832-4.8.832m6.371-1.69c-1.196-1.06-2.186-2.333-2.186-6.422 0-1.597-1.243-3.329-3.31-3.724C8.875 1.408 8.483 1 8 1s-.875.41-.875.915v.001c-2.067.395-3.31 2.127-3.31 3.724 0 4.09-.99 5.361-2.186 6.422-.4.262-.629.552-.629.858C1 14.068 4.134 15 8 15s7-.932 7-2.08c0-.306-.229-.596-.629-.858\"></path></svg>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.2 14H.8c-.44 0-.8-.36-.8-.8V2.8c0-.44.36-.8.8-.8h14.4c.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8zM1.6 10.8h1.6v.8h1.6v-.84a2.007 2.007 0 0 0 1.507-2.576C6.052 7.337 5.213 6.8 4.329 6.8h-.695a.397.397 0 0 1-.394-.4c0-.22.176-.4.394-.4H6.4V4.4H4.8v-.8H3.2v.84A1.997 1.997 0 0 0 1.62 6.4c0 1.103.885 2 1.975 2h.803c.218 0 .395.18.395.4 0 .22-.177.4-.395.4H1.6v1.6zM9 11h5v-1H9v1zm0-3h5V7H9v1zm0-3h5V4H9v1z\"></path></svg>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7 12.981h2v-2.02H7v2.02zm-3.999 0h2v-2.02H3v2.02zm8-4.029H13v-2.02h-2v2.02zm-4 0h2v-2.02H7v2.02zm-4 0h2v-2.02H3v2.02zm8.769-6.66c0-.112-.127-.21-.27-.21h-.537c-.144 0-.27.098-.27.21v2.556c0 .11.126.209.27.209h.536c.144 0 .27-.099.27-.21V2.292zm-6.462 0c0-.112-.126-.21-.27-.21h-.537c-.144 0-.27.098-.27.21v2.556c0 .11.126.209.27.209h.537c.144 0 .27-.099.27-.21V2.292zM15 13.918c0 .59-.487 1.081-1.076 1.081H2.077C1.488 15 1 14.51 1 13.919V4.246c0-.592.488-1.082 1.077-1.082h1.077v-.811C3.154 1.609 3.761 1 4.501 1h.537c.74 0 1.348.609 1.348 1.353v.81h3.23v-.81c0-.744.606-1.353 1.347-1.353h.536c.741 0 1.347.609 1.347 1.353v.81h1.078c.589 0 1.076.49 1.076 1.083v9.673z\"></path></svg>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.038 14.997c-.438 0-.858-.192-1.145-.53L1.355 9.111a1.5 1.5 0 0 1 2.289-1.939l3.171 3.742 5.392-9.175a1.5 1.5 0 0 1 2.586 1.52L8.331 14.257a1.5 1.5 0 0 1-1.293.74\"></path></svg>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M12.16 5.9l-4.164 5.418a1 1 0 0 1-.74.39c-.018.002-.035.002-.053.002-.273 0-.535-.113-.725-.312L3.91 8.694a1 1 0 0 1 1.45-1.378l1.763 1.856 3.451-4.492A1 1 0 0 1 12.16 5.9M8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7\"></path></svg>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.006 10.16A2.19 2.19 0 0 1 5.82 7.973a2.19 2.19 0 0 1 2.187-2.188 2.19 2.19 0 0 1 2.188 2.188 2.19 2.19 0 0 1-2.188 2.187m6.778-3.458l-1.292-.209a5.673 5.673 0 0 0-.73-1.635l.807-.972a.246.246 0 0 0-.014-.323L12.22 2.23a.253.253 0 0 0-.326-.019l-1.058.834a5.634 5.634 0 0 0-1.615-.626l-.085-1.2A.238.238 0 0 0 8.904 1H7.019a.243.243 0 0 0-.237.218l-.102 1.23a5.63 5.63 0 0 0-1.539.618L4.03 2.209a.256.256 0 0 0-.327.021L2.369 3.563a.253.253 0 0 0-.019.326l.845 1.059a5.65 5.65 0 0 0-.688 1.597l-1.29.1A.241.241 0 0 0 1 6.88v1.886c0 .12.098.23.217.245l1.228.148a5.62 5.62 0 0 0 .647 1.669l-.741.93a.25.25 0 0 0 .018.325l1.333 1.333a.263.263 0 0 0 .33.024l.915-.677c.547.35 1.157.609 1.81.756l.094 1.263a.24.24 0 0 0 .235.218h1.761c.12 0 .232-.097.247-.217l.16-1.264a5.634 5.634 0 0 0 1.776-.735l.862.654a.26.26 0 0 0 .329-.022l1.334-1.333a.263.263 0 0 0 .023-.331l-.671-.903c.33-.563.568-1.187.69-1.852l1.185-.094A.24.24 0 0 0 15 8.668V6.955a.267.267 0 0 0-.216-.253\"></path></svg>"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9 6c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h7zm5-5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h1V3H8v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1h7z\"></path></svg>"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.081 12.581L4.22 8.701a.999.999 0 0 1 .004-1.414.999.999 0 0 1 1.414.003l1.377 1.384.04-6.68c.003-.552.483-.976 1.006-.994a1 1 0 0 1 .994 1.006l-.04 6.804 1.512-1.52a1.001 1.001 0 0 1 1.418 1.411l-3.863 3.88zM14 8a1 1 0 0 1 1 1v4.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V9a1 1 0 1 1 2 0v4h10V9a1 1 0 0 1 1-1z\"></path></svg>"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.995 2C15.55 2 16 2.458 16 3.019v1.055L8.017 8.861 0 4.062V3.019C0 2.458.453 2 1.005 2h13.99zm-6.978 8.885c.189 0 .379-.05.545-.15L16 6.276V12.982c0 .56-.45 1.019-1 1.019H1c-.549 0-1-.458-1-1.02V6.263l7.473 4.474c.165.099.355.149.544.149z\"></path></svg>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.654 10H7.466a.52.52 0 0 1-.515-.5l-.15-5a.485.485 0 0 1 .485-.5H8.87c.275 0 .515.201.482.5l-.179 5c.013.251-.244.5-.518.5M8.5 13h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1c.275 0 .5.225.5.5v1c0 .275-.225.5-.5.5M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7\"></path></svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9.19 9.008c-.01.275-.072.612-.14.75-.067.137-.622.25-.896.25h-.189c-.274 0-.614-.05-.752-.113-.14-.062-.269-.612-.277-.887l-.12-4c-.008-.276.032-.613.09-.75.058-.138.605-.25.88-.25h.584c.275 0 .616.045.758.1.14.055.216.624.207.9l-.146 4zm-.19 3c0 .274-.05.612-.113.75-.062.137-.612.25-.886.25-.276 0-.613-.05-.75-.113-.139-.062-.25-.613-.25-.887 0-.275.05-.613.111-.75.063-.138.612-.25.889-.25.274 0 .612.05.75.112.136.062.25.613.25.888zm5.832 1.292c-.28-.562-.567-1.12-.85-1.679-1.683-3.315-3.366-6.63-5.046-9.947-.204-.402-.49-.667-.925-.674-.423-.007-.724.234-.924.627-1.982 3.906-3.965 7.812-5.94 11.724a1.395 1.395 0 0 0-.145.663c.03.595.476.984 1.084.984 1.97.003 3.942.001 5.913.001 1.962 0 3.926.002 5.89 0 .928-.002 1.38-.819.944-1.699z\"></path></svg>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M5.452 6.138c-.2.19-.463.285-.724.285-.261 0-.522-.093-.721-.282a.937.937 0 0 1-.004-1.373L8 1l3.896 3.768a.938.938 0 0 1-.003 1.373c-.4.378-1.048.375-1.445-.003L9.043 4.796 9 11.28c-.004.534-.46.964-1.027.964-.566-.003-1.02-.44-1.016-.976L7 4.658 5.452 6.138zM14 7.835a1 1 0 0 1 1 1V13.5c0 .827-.673 1.5-1.5 1.5h-11c-.827 0-1.5-.673-1.5-1.5V8.836a1 1 0 1 1 2 0V13h10V8.836a1 1 0 0 1 1-1z\"></path></svg>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M10 1h5v5a1 1 0 1 1-2 0V4.509L8.099 9.411a1 1 0 0 1-1.414-1.414L11.682 3H10a1 1 0 1 1 0-2zm2 7a1 1 0 0 1 1 1v4.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 13.5v-9A1.5 1.5 0 0 1 2.5 3H7a1 1 0 1 1 0 2H3v8h8V9a1 1 0 0 1 1-1z\"></path></svg>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.565 5.403h-.01c-.136-.002-.237-.054-.301-.155-.125-.198-.09-.556.094-.934.301-.623.907-1.13 1.35-1.13h.009c.136.003.238.056.302.157.125.197.089.555-.094.933-.301.623-.907 1.13-1.35 1.13zM7.479 1.835C3.119 2.917-.231 7.132.012 11.232.148 13.375 1.37 15.169 3.222 16a21.401 21.401 0 0 1 .969-6.958c.792-2.527 2.01-4.79 3.622-6.729a.184.184 0 0 1 .072-.052c.338-.086.66-.148.978-.191.13-.003.21.077.21.178l-.02.079a.191.191 0 0 1-.026.036 6.762 6.762 0 0 0-.703.86c-.732 1.065-1.047 1.902-.91 2.421.06.225.202.391.437.509.284.142.536.211.768.211.735 0 1.208-.721 1.808-1.634.115-.176.234-.357.36-.54.443-.646.876-1.472 1.15-2.19A6.942 6.942 0 0 0 9.51 1.58c-.664 0-1.347.086-2.031.256zM6.484 15.33c-.683 0-1.343-.09-1.964-.27-.07-1.635.279-3.257.939-4.357.496-.827 1.12-1.283 1.756-1.283.725 0 1.422.598 1.912 1.64.36.764.586 1.707.651 2.726a.181.181 0 0 0 .183.167l.057-.01c.376-.195.72-.402 1.05-.627a.176.176 0 0 0 .079-.146l-.009-.055c-.487-1.162-.947-2.587-.705-4.442.254-1.943 1.245-4.087 3.028-6.553l.025-.051.008-.05a.174.174 0 0 0-.068-.14C12.446 1.114 11.088.71 9.5.71c-.281 0-.57.012-.865.038.226-.25.461-.497.703-.738.134-.007.269-.01.401-.01 3.481 0 6.05 2.335 6.249 5.678.241 4.093-3.103 8.307-7.454 9.394a8.552 8.552 0 0 1-2.05.26zM13.127 14a.989.989 0 0 1 .502-.866c.157-.089.326-.133.508-.133a1.016 1.016 0 0 1 .877.497.989.989 0 0 1 .133.502.985.985 0 0 1-.504.869 1.01 1.01 0 0 1-.506.132 1.007 1.007 0 0 1-.876-.499.987.987 0 0 1-.134-.502zm1.845 0a.83.83 0 0 0-.107-.413.828.828 0 0 0-.728-.42.84.84 0 0 0-.725.413.826.826 0 0 0-.111.42.83.83 0 0 0 .836.835.828.828 0 0 0 .727-.42.835.835 0 0 0 .108-.415zm-1.04.101v.45h-.214v-1.136h.4c.142 0 .255.031.338.092a.304.304 0 0 1 .124.26c0 .1-.054.177-.161.233a.244.244 0 0 1 .121.115c.024.05.035.111.035.184s.002.125.005.155c.004.03.01.056.02.076v.022h-.221a1.002 1.002 0 0 1-.019-.26c0-.067-.015-.116-.046-.146-.032-.03-.084-.045-.157-.045h-.225zm0-.179h.194c.07 0 .128-.014.173-.043.045-.028.067-.066.067-.112 0-.062-.017-.107-.05-.133-.034-.026-.095-.04-.183-.04h-.2v.328z\"></path></svg>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.811 2.084L9.909 6.986v7.378a.644.644 0 0 1-.387.587.743.743 0 0 1-.25.049.592.592 0 0 1-.447-.189L6.28 12.266a.63.63 0 0 1-.189-.447V6.986L1.19 2.084a.626.626 0 0 1-.14-.696c.1-.229.329-.388.587-.388h12.727c.258 0 .487.16.586.389a.626.626 0 0 1-.139.695\"></path></svg>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M10.789 6.858c-.14.278-.366.562-.677.853l-.733.657c-.209.192-.354.39-.435.591a2.55 2.55 0 0 0-.134.541H6.985c0-.367.07-.838.21-1.183.142-.347.368-.647.684-.9.314-.254.554-.486.717-.697.165-.211.247-.444.247-.697 0-.618-.278-.927-.831-.927-.254 0-.46.09-.618.27-.14.159-.217.377-.24.748H5c.034-.893.293-1.498.792-1.93.527-.456 1.267-.684 2.22-.684.95 0 1.684.21 2.206.632.52.422.782 1.02.782 1.8 0 .339-.07.648-.211.926m-2.075 5.861A.98.98 0 0 1 8 13a.98.98 0 0 1-.714-.28A.965.965 0 0 1 7 12c0-.291.095-.532.286-.72A.98.98 0 0 1 8 11a.968.968 0 0 1 1 1 .969.969 0 0 1-.286.72M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7\"></path></svg>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 5.85a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m1.243 6.79c-.003.232-.131.36-.376.36-.58-.004-1.161-.003-1.741-.001-.248 0-.367-.136-.37-.366-.008-.595-.008-4.66.001-5.254.003-.232.131-.364.376-.362.29.003.58 0 .87 0 .28 0 .559.005.84-.001.257-.005.397.118.401.37.008.593.008 4.659-.001 5.254M8 1C4.141 1 1 4.14 1 8s3.141 7 7 7 7-3.14 7-7-3.141-7-7-7\"></path></svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15 4c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V5c0-.005.003-.009.003-.013 0-.005-.003-.008-.003-.013V3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1h9zm-7.3 8.022l.053-.001a1 1 0 0 0 .74-.39l3.237-4.214a1.001 1.001 0 0 0-1.586-1.219L7.62 9.485 6.426 8.23a1 1 0 1 0-1.45 1.378l2 2.103c.19.199.451.311.724.311z\"></path></svg>"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.827 10.24a.5.5 0 0 1 .066.686l-2.197 2.878c-.099.13-.233.163-.399.196a.707.707 0 0 1-.366-.13l-1.399-1.438a.467.467 0 0 1 0-.686c.2-.196.532-.163.732 0l1.033 1.013 1.83-2.454a.523.523 0 0 1 .7-.065zM6.022 2c3.326 0 6.022 2.675 6.022 5.973 0 3.299-2.696 5.974-6.022 5.974S0 11.272 0 7.973C0 4.675 2.696 2 6.022 2zm1.122 7.449V4.412a.904.904 0 0 0-.915-.894c-.505 0-.913.4-.913.894v3.233l-1.82-.016h-.01a.904.904 0 0 0-.914.886.904.904 0 0 0 .906.902l3.666.032z\"></path></svg>"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M2.652 3.478a8.466 8.466 0 0 0 2.005 1.324c-.187.87-.3 1.827-.324 2.832H3.36v.025H1.176A.348.348 0 0 0 1 7.707a6.948 6.948 0 0 1 1.652-4.229zm10.766.082A6.946 6.946 0 0 1 15 7.66h-2.267v-.025H11.7a15.256 15.256 0 0 0-.313-2.777 8.435 8.435 0 0 0 2.031-1.297zM5.235 5.047c-.16.792-.26 1.665-.28 2.587h5.938a14.851 14.851 0 0 0-.26-2.481 8.005 8.005 0 0 1-5.398-.106zm.204-.849C5.981 2.268 6.914 1 7.924 1c1.028 0 1.977 1.314 2.514 3.304a7.248 7.248 0 0 1-4.999-.106zm-2.2-1.332a6.999 6.999 0 0 1 3.006-1.64c-.568.641-1.04 1.584-1.372 2.723a7.665 7.665 0 0 1-1.634-1.083zm7.331 8.288a14.63 14.63 0 0 0 .324-2.822h-5.94c.022 1.056.146 2.048.347 2.927a7.026 7.026 0 0 1 5.27-.105zm-.216.837C9.804 13.815 8.9 15 7.924 15c-.958 0-1.847-1.14-2.398-2.906a6.378 6.378 0 0 1 4.828-.103zm2.763.777a8.224 8.224 0 0 0-.571-.492 7.588 7.588 0 0 0-1.217-.814c.217-.933.347-1.972.371-3.067h3.296a6.953 6.953 0 0 1-1.88 4.373zm-10.17.065a6.955 6.955 0 0 1-1.944-4.484c.051.029.11.046.173.046h3.157a15.01 15.01 0 0 0 .386 3.132 7.413 7.413 0 0 0-.348.208 8.02 8.02 0 0 0-1.424 1.098zm9.451.394c.04.036.08.073.118.11a6.995 6.995 0 0 1-2.641 1.391c.492-.593.908-1.417 1.218-2.4.46.246.897.546 1.305.9zm-7.904-.575c.151-.1.305-.192.46-.278.311.968.724 1.78 1.213 2.365a6.993 6.993 0 0 1-2.592-1.329c.29-.282.598-.535.92-.758zm6.644-8.778c-.33-1.1-.79-2.011-1.341-2.638a6.998 6.998 0 0 1 2.898 1.568 7.511 7.511 0 0 1-1.557 1.07z\"></path></svg>"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 16L13 11.087 8.856 11.087 8.856 0 7.144 0 7.144 11.087 3 11.087z\"></path></svg>"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 8L4.913 13 4.913 8.856 16 8.856 16 7.144 4.913 7.144 4.913 3z\"></path></svg>"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 8L11.087 13 11.087 8.856 0 8.856 0 7.144 11.087 7.144 11.087 3z\"></path></svg>"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0L3 4.913 7.144 4.913 7.144 16 8.856 16 8.856 4.913 13 4.913z\"></path></svg>"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M4.752 12.605h6.496V16H4.752v-3.395zm.939.967v1.454h4.618v-1.454H5.691zM1.5 6.688L7.996 0 14.5 6.688h-3.252v4.078H4.752V6.688H1.5zm6.496-5.313l-4.313 4.44h2.008v3.977h4.618V5.815h2l-4.313-4.44z\"></path></svg>"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M3.128 6.257a3.02 3.02 0 0 1-1.236-.254A3.168 3.168 0 0 1 .9 5.322c-.28-.286-.5-.618-.66-.996A3.041 3.041 0 0 1 0 3.128c0-.437.082-.844.245-1.223A3.15 3.15 0 0 1 .913.913 3.137 3.137 0 0 1 3.128 0c.426 0 .828.079 1.206.236.379.157.711.376.996.655a3.109 3.109 0 0 1 .927 2.237v2.106h3.486V3.128A3.087 3.087 0 0 1 10.67.891c.285-.28.617-.498.996-.655.378-.157.78-.236 1.206-.236a3.137 3.137 0 0 1 2.215.913c.282.283.505.613.668.992.163.379.245.786.245 1.223 0 .42-.08.819-.24 1.198-.16.378-.38.71-.66.996-.28.285-.61.512-.992.681a3.02 3.02 0 0 1-1.236.254h-2.106v3.486h2.106c.442 0 .855.085 1.236.254.382.169.712.396.992.681.28.286.5.618.66.996.16.38.24.778.24 1.198 0 .437-.082.844-.245 1.223a3.15 3.15 0 0 1-.668.992 3.137 3.137 0 0 1-2.215.913c-.426 0-.828-.079-1.206-.236a3.118 3.118 0 0 1-.996-.655 3.109 3.109 0 0 1-.927-2.237v-2.106H6.257v2.106a3.087 3.087 0 0 1-.927 2.237c-.285.28-.617.498-.996.655-.378.157-.78.236-1.206.236a3.137 3.137 0 0 1-2.215-.913 3.15 3.15 0 0 1-.668-.992A3.059 3.059 0 0 1 0 12.872c0-.42.08-.819.24-1.198.16-.378.38-.71.66-.996.28-.285.61-.512.992-.681a3.02 3.02 0 0 1 1.236-.254h2.106V6.257H3.128zm2.106-1.023V3.128a2.097 2.097 0 0 0-.607-1.49c-.19-.189-.412-.339-.669-.45a2.071 2.071 0 0 0-.83-.166c-.29 0-.562.056-.812.166-.25.111-.47.261-.66.45a2.097 2.097 0 0 0-.607 1.49c0 .297.053.574.161.83a2.068 2.068 0 0 0 1.918 1.276h2.106zm-2.106 5.532c-.29 0-.562.054-.812.161a2.068 2.068 0 0 0-1.105 1.114 2.12 2.12 0 0 0-.162.83 2.097 2.097 0 0 0 1.267 1.94c.25.111.521.167.812.167.297 0 .574-.056.83-.166a2.068 2.068 0 0 0 1.114-1.119c.108-.256.162-.53.162-.821v-2.106H3.128zm9.744-5.532a2.08 2.08 0 0 0 1.472-.607c.19-.19.338-.412.446-.669a2.12 2.12 0 0 0 .161-.83 2.097 2.097 0 0 0-1.271-1.94 1.997 1.997 0 0 0-.808-.166c-.297 0-.574.056-.83.166a2.068 2.068 0 0 0-1.114 1.119c-.108.256-.162.53-.162.821v2.106h2.106zm-2.106 5.532v2.106a2.097 2.097 0 0 0 .607 1.49c.19.189.412.339.669.45.256.11.533.166.83.166.285 0 .555-.056.808-.166.253-.111.475-.261.664-.45a2.097 2.097 0 0 0 .607-1.49 2.12 2.12 0 0 0-.161-.83 2.068 2.068 0 0 0-1.918-1.276h-2.106zm-1.023-4.51H6.257v3.487h3.486V6.257z\"></path></svg>"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M5.595 14L0 8.25 5.595 2.5H16V14H5.595zM1.58 8.25l4.484 4.6h8.817v-9.2H6.064L1.58 8.25zm7.773.808L6.851 11.63l-.787-.816L8.56 8.25 6.064 5.678l.787-.808 2.502 2.564L11.85 4.87l.794.808-2.496 2.572 2.496 2.564-.794.816-2.496-2.572z\"></path></svg>"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 15v-3h16v3H0zm0-6l7.995-8L16 9H0z\"></path></svg>"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 1h5.562l6.135 12.364H16V15h-5.562L4.294 2.627H0V1zm9.499 0H16v1.627H9.499V1z\"></path></svg>"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 8.35c0 .692-.25 1.3-.749 1.825-.499.525-1.103.788-1.813.788H7.419V13.5L0 9.963l7.419-3.567v2.537h5.155c.347 0 .645-.11.893-.329.249-.218.373-.502.373-.85V2.5H16v5.85z\"></path></svg>"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 8.489L7.995 0 16 8.489h-4.002V16H4.002V8.489H0zm7.995-6.743L2.687 7.382h2.471v7.391h5.684V7.382h2.462L7.995 1.746z\"></path></svg>"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 11L16 16 0 16 0 11 1.167 11 1.167 13.904 14.833 13.904 14.833 11z\"></path></svg>"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 12h-1.39V4H16v8zm-2.781-4L9.16 12V8.685H0v-1.37h9.16V4l4.059 4z\"></path></svg>"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6 4.827C6 3.837 6.916 3 8 3s2 .837 2 1.827v2.646H6V4.827zm7.766 2.646H12V4.827C12 2.723 10.2 1 8 1S4 2.723 4 4.827v2.646H2.234C1.556 7.473 1 8.028 1 8.707v5.531c0 .679.556 1.235 1.234 1.235h11.532c.678 0 1.234-.556 1.234-1.235V8.707c0-.679-.556-1.234-1.234-1.234z\"></path></svg>"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M13.152 9H2.847c-.466 0-.845-.448-.845-1s.379-1 .845-1h10.306c.47 0 .849.448.849 1s-.38 1-.848 1\"></path></svg>"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 1c3.859 0 7 3.141 7 7 0 3.86-3.141 7-7 7s-7-3.14-7-7c0-3.859 3.141-7 7-7zm4 8a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2h8z\"></path></svg>"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15 12a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v9h13zM11.267 2H15v3.78l-1.174-1.19-4.05 4.049a1 1 0 0 1-1.413 0l-1.42-1.42-2.68 2.679a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l3.387-3.386a.996.996 0 0 1 1.414 0l1.42 1.42 3.35-3.351L11.267 2z\"></path></svg>"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M2.423 10.716L9.567 3.56l2.802 2.807-7.145 7.158-2.801-2.808zm-1.415 3.895l.708-3.186 2.8 2.807-3.122.759a.32.32 0 0 1-.386-.38zm13.85-11.355a.489.489 0 0 1-.004.693l-.776.765.007.007-.953.924-2.802-2.807.34-.33c.004-.003.005-.01.01-.015l1.373-1.351a.498.498 0 0 1 .7.003l2.104 2.11z\"></path></svg>"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.177 10.059h-3.294a.823.823 0 0 0-.824.824v.823c-3.294 0-5.713-2.522-5.765-5.764h.823a.824.824 0 0 0 .825-.824V1.824A.824.824 0 0 0 5.117 1H1.823A.824.824 0 0 0 1 1.824v4.118A9.058 9.058 0 0 0 10.059 15h4.118a.822.822 0 0 0 .823-.823v-3.294a.823.823 0 0 0-.823-.824\"></path></svg>"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14 7H9V2a1 1 0 1 0-2 0v5H2a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0V9h5a1 1 0 1 0 0-2\"></path></svg>"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M12.508 15H3.49c-.408 0-.74-.392-.74-.875s.332-.875.74-.875h9.018c.41 0 .742.392.742.875s-.331.875-.742.875zM8.875 5.375h3.5a.875.875 0 1 1 0 1.75h-3.5v3.5a.875.875 0 1 1-1.75 0v-3.5h-3.5a.875.875 0 1 1 0-1.75h3.5v-3.5a.875.875 0 1 1 1.75 0v3.5z\"></path></svg>"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.494 10a3.502 3.502 0 0 1-3.496-3.5c0-1.93 1.568-3.5 3.496-3.5A3.502 3.502 0 0 1 9.99 6.5c0 1.93-1.568 3.5-3.496 3.5m8.213 3.292l-3.683-3.683a5.475 5.475 0 0 0 .963-3.109c0-3.038-2.459-5.5-5.493-5.5A5.497 5.497 0 0 0 1 6.5C1 9.538 3.46 12 6.494 12a5.456 5.456 0 0 0 3.118-.975l3.683 3.683a.998.998 0 0 0 1.412-.001 1 1 0 0 0 0-1.415\"></path></svg>"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.5 10.727c.276 0 .5.246.5.546v2.182c0 .3-.224.545-.5.545H.5c-.275 0-.5-.246-.5-.545v-2.182c0-.3.225-.546.5-.546h15zm0-4.363c.276 0 .5.245.5.546v2.18c0 .3-.224.547-.5.547H.5c-.275 0-.5-.246-.5-.546V6.91c0-.301.225-.546.5-.546h15zM15.5 2c.276 0 .5.246.5.546v2.182c0 .3-.224.545-.5.545H.5c-.275 0-.5-.245-.5-.545V2.546C0 2.246.225 2 .5 2h15zM13.393 13.23c.399-.009.737-.364.735-.773-.002-.426-.37-.783-.785-.762a.776.776 0 0 0-.715.792c.016.41.369.752.765.743zm0-4.397c.399-.01.737-.364.735-.773-.002-.426-.37-.783-.785-.762a.776.776 0 0 0-.715.792c.016.41.369.752.765.743zm0-4.398c.399-.01.737-.364.735-.773-.002-.426-.37-.783-.785-.762a.776.776 0 0 0-.715.792c.016.41.369.752.765.743zm-11.26 8.473h8.534v-1.09H2.134v1.09zm0-4.363h8.534V7.455H2.134v1.09zm0-4.364h8.534V3.09H2.134v1.09z\"></path></svg>"

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.12 3.898v8.204l-1.41-1.41a1 1 0 0 0-1.416 0 1 1 0 0 0 0 1.416L8.187 16l3.888-3.888a1 1 0 1 0-1.416-1.416l-1.535 1.535V3.769l1.535 1.535a1 1 0 0 0 1.416 0 1 1 0 0 0 0-1.416L8.187 0 4.294 3.892a1 1 0 0 0 0 1.416 1 1 0 0 0 1.416 0l1.41-1.41z\"></path></svg>"

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M12.075 10.696a1 1 0 0 0-1.416 0l-1.535 1.535V1.002a1.001 1.001 0 1 0-2.003 0v11.1l-1.411-1.41a1 1 0 0 0-1.416 0 1 1 0 0 0 0 1.416L8.187 16l3.888-3.888a1 1 0 0 0 0-1.416\"></path></svg>"

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M4.293 5.305a.997.997 0 0 0 1.414 0L7.239 3.77v11.229a1 1 0 1 0 2 0v-11.1l1.409 1.41a.998.998 0 0 0 1.415 0c.39-.391.39-1.025 0-1.416L8.175 0 4.293 3.889a1.001 1.001 0 0 0 0 1.416\"></path></svg>"

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 7.779c0 .83-.604 1.523-1.422 1.737-.086.338-.189.671-.327.994a6.793 6.793 0 0 1-1.467 2.172 6.78 6.78 0 0 1-2.154 1.448c-.118.05-.24.087-.36.13-.12.424-.489.74-.946.74-.553 0-1-.453-1-1.01 0-.56.447-1.012 1-1.012.28 0 .532.118.713.306.068-.026.137-.045.204-.074a5.816 5.816 0 0 0 3.09-3.089 5.833 5.833 0 0 0 .464-2.292 5.831 5.831 0 0 0-3.555-5.382 5.773 5.773 0 0 0-4.462 0 5.76 5.76 0 0 0-1.837 1.235 5.831 5.831 0 0 0-1.717 4.147l.002.138c.008.33.047.66.118 1.014v.013c.037.154.106.403.178.5 0 0-.053.036-.266.073l-.017.002.001.001c-.006 0-.213.021-.256.021l-.04-.001C.87 9.59 0 8.78 0 7.779c0-.849.627-1.553 1.47-1.751.081-.3.175-.595.297-.883a6.792 6.792 0 0 1 1.468-2.17 6.758 6.758 0 0 1 2.154-1.449 6.786 6.786 0 0 1 5.241 0 6.769 6.769 0 0 1 2.154 1.449 6.789 6.789 0 0 1 1.467 2.17c.123.29.218.587.299.888.833.205 1.45.905 1.45 1.746zm-3.419-.11a4.571 4.571 0 1 1-9.143-.002 4.571 4.571 0 0 1 9.143.002zm-4.572 2.61c2.503 0 2.503-2.268 2.503-2.268s-2.404 2.191-5.005 0c0 0 0 2.267 2.502 2.267zm1.866-3.687c.438 0 .794-.374.794-.835 0-.462-.356-.837-.794-.837-.438 0-.794.375-.794.837 0 .461.356.835.794.835zM6.181 4.92c-.438 0-.794.375-.794.837 0 .461.356.835.794.835.439 0 .794-.374.794-.835 0-.462-.355-.837-.794-.837z\"></path></svg>"

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M2.856 1h4.082c.196 0 .386.078.524.218l7.32 7.32a.74.74 0 0 1 0 1.05l-5.194 5.195c-.29.29-.76.29-1.05 0l-7.32-7.321A.737.737 0 0 1 1 6.938V2.856C1 1.83 1.83 1 2.856 1zm.99 4.01a1.311 1.311 0 1 0 0-2.623 1.311 1.311 0 0 0 0 2.623z\"></path></svg>"

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15 2c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h14zM8.657 5.491a1 1 0 1 0-1.742-.982L4.813 8.241 3.768 6.977a1 1 0 0 0-1.541 1.275L4.2 10.638a1.004 1.004 0 0 0 .86.358.997.997 0 0 0 .782-.505l2.815-5zM10 11h4v-1h-4v1zm0-3h4V7h-4v1zm0-3h4V4h-4v1z\"></path></svg>"

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9.414 8l4.293-4.293a.999.999 0 1 0-1.414-1.414L8 6.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L6.586 8l-4.293 4.293a.999.999 0 1 0 1.414 1.414L8 9.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L9.414 8z\"></path></svg>"

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M11.682 10.268a.999.999 0 1 1-1.414 1.414L8 9.414l-2.267 2.268a.999.999 0 1 1-1.414-1.414L6.586 8 4.319 5.732a.999.999 0 1 1 1.414-1.414L8 6.586l2.268-2.268a.999.999 0 1 1 1.414 1.414L9.414 8l2.268 2.268zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z\"></path></svg>"

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M2 13.27V5h12v8.27c0 .95-.778 1.729-1.729 1.729H3.729A1.734 1.734 0 0 1 2 13.268zM14 2c.55 0 1 .45 1 1v1H1V3c0-.55.45-1 1-1h4V1h4v1h4zM5 8.555v2.998a1 1 0 1 0 2 0V8.555a1 1 0 1 0-2 0zm4 0v2.998a1 1 0 1 0 2 0V8.555a1 1 0 1 0-2 0z\"></path></svg>"

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.517 12.467c-.15-.075-3.717-1.842-6.517-1.842-2.798 0-6.366 1.767-6.516 1.842A.876.876 0 0 0 1 13.25v.875c0 .483.392.875.875.875h12.25a.875.875 0 0 0 .875-.875v-.875a.875.875 0 0 0-.483-.783M4.5 6.25V4.5C4.5 2.57 6.07 1 8 1s3.5 1.57 3.5 3.5v1.75c0 1.93-1.57 3.5-3.5 3.5a3.505 3.505 0 0 1-3.5-3.5\"></path></svg>"

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = ":host {\n  background-color: inherit;\n  color: inherit;\n  display: inline-block;\n  height: 1em;\n  width: 1em;\n  /*\n    if the requested icon type is not valid (nothing injected),\n    make sure the element doesn't consume space on the page.\n  */\n}\n:host:empty {\n  height: 0;\n  width: 0;\n}\n::slotted(svg) {\n  fill: currentColor;\n  stroke: none;\n}\n"

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.addEventListener('WebComponentsReady', function () {
    var tagName = 'hx-reveal';
    var template = document.createElement('template');

    template.innerHTML = '\n      <style>' + __webpack_require__(65) + '</style>\n      ' + __webpack_require__(66) + '\n    ';

    var HxReveal = function (_HTMLElement) {
        _inherits(HxReveal, _HTMLElement);

        _createClass(HxReveal, null, [{
            key: 'is',
            get: function get() {
                return tagName;
            }
        }, {
            key: 'observedAttributes',
            get: function get() {
                return ['open'];
            }
        }]);

        function HxReveal() {
            _classCallCheck(this, HxReveal);

            var _this = _possibleConstructorReturn(this, (HxReveal.__proto__ || Object.getPrototypeOf(HxReveal)).call(this));

            _this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(_this);
            }
            _this.shadowRoot.appendChild(template.content.cloneNode(true));
            _this._btnToggle = _this.shadowRoot.querySelector('#toggle');
            _this._toggle = _this._toggle.bind(_this);
            return _this;
        }

        _createClass(HxReveal, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                this._btnToggle.addEventListener('click', this._toggle);
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                this._btnToggle.removeEventListener('click', this._toggle);
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attr, oldValue, newValue) {
                if (attr === 'open') {
                    this._btnToggle.setAttribute('aria-expanded', newValue === '');
                }
            }
        }, {
            key: '_toggle',
            value: function _toggle() {
                this.open = !this.open;
            }
        }, {
            key: 'open',
            set: function set(value) {
                if (Boolean(value)) {
                    this.setAttribute('open', '');
                } else {
                    this.removeAttribute('open');
                }
            },
            get: function get() {
                return this.hasAttribute('open');
            }
        }]);

        return HxReveal;
    }(HTMLElement);

    customElements.define(HxReveal.is, HxReveal);
});

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n}\n:host([open]) > #content {\n  display: block;\n}\n#content {\n  display: none;\n}\n#toggle {\n  background-color: transparent;\n  border: none;\n  color: inherit;\n  font-size: 1em;\n  margin: 0;\n  padding: 0;\n  text-align: left;\n  width: 100%;\n}\n#toggle:empty {\n  display: none;\n}\n#toggle:hover {\n  cursor: pointer;\n}\n"

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<button id=\"toggle\" aria-expanded=\"false\">\n  <slot name=\"summary\"></slot>\n</button>\n<div id=\"content\">\n  <slot></slot>\n</div>\n"

/***/ })
/******/ ]);