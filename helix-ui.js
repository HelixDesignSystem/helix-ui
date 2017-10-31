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

__webpack_require__(50);

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
        'angle-down': __webpack_require__(5),
        'angle-left': __webpack_require__(6),
        'angle-right': __webpack_require__(7),
        'angle-up': __webpack_require__(8),
        'calendar': __webpack_require__(9),
        'checkmark': __webpack_require__(10),
        'cog': __webpack_require__(11),
        'download': __webpack_require__(12),
        'envelope': __webpack_require__(13),
        'exclamation-circle': __webpack_require__(14),
        'exclamation-triangle': __webpack_require__(15),
        'export': __webpack_require__(16),
        'fanatiguy': __webpack_require__(17),
        'filter': __webpack_require__(18),
        'info-circle': __webpack_require__(19),
        'input-file': __webpack_require__(20),
        'input-number': __webpack_require__(21),
        'input-time': __webpack_require__(22),
        'input-url': __webpack_require__(23),
        'kbd-arrow-down': __webpack_require__(24),
        'kbd-arrow-left': __webpack_require__(25),
        'kbd-arrow-right': __webpack_require__(26),
        'kbd-arrow-up': __webpack_require__(27),
        'kbd-capslock': __webpack_require__(28),
        'kbd-command': __webpack_require__(29),
        'kbd-delete': __webpack_require__(30),
        'kbd-eject': __webpack_require__(31),
        'kbd-option': __webpack_require__(32),
        'kbd-return': __webpack_require__(33),
        'kbd-shift': __webpack_require__(34),
        'kbd-space': __webpack_require__(35),
        'kbd-tab': __webpack_require__(36),
        'lock': __webpack_require__(37),
        'minus': __webpack_require__(38),
        'phone': __webpack_require__(39),
        'plus': __webpack_require__(40),
        'plus-or-minus': __webpack_require__(41),
        'search': __webpack_require__(42),
        'sort': __webpack_require__(43),
        'sort-down': __webpack_require__(44),
        'sort-up': __webpack_require__(45),
        'support': __webpack_require__(46),
        'times': __webpack_require__(47),
        'times-circle': __webpack_require__(48)
    };

    template.innerHTML = '\n        <style>' + __webpack_require__(49) + '</style>\n        <slot></slot>\n    ';

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

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.53 3.094L0 4.451 7.956 13 16 4.357 14.47 3 7.956 9.999z\"></path></svg>"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M12.906 1.53L11.549 0 3 7.956 11.643 16 13 14.47 6.001 7.956z\"></path></svg>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M3.094 14.47L4.451 16 13 8.044 4.357 0 3 1.53 9.999 8.044z\"></path></svg>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.47 12.906L16 11.549 8.044 3 0 11.643 1.53 13 8.044 6.001z\"></path></svg>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.858 13.693h2.285v-2.308H6.858v2.308zm-4.571 0h2.285v-2.308H2.287v2.308zm9.142-3.462h2.285V7.923h-2.285v2.308zm-4.571 0h2.285V7.923H6.858v2.308zm-4.571 0h2.285V7.923H2.287v2.308zm10.021-8.755c0-.128-.145-.24-.309-.24h-.613c-.164 0-.308.112-.308.24v2.921c0 .127.144.24.308.24h.613c.164 0 .309-.113.309-.24V1.476zm-7.385 0c0-.128-.144-.24-.308-.24h-.614c-.164 0-.308.112-.308.24v2.921c0 .127.144.24.308.24h.614c.164 0 .308-.113.308-.24V1.476zM16 14.764C16 15.44 15.443 16 14.77 16H1.231C.558 16 0 15.44 0 14.764V3.71c0-.676.558-1.236 1.231-1.236h1.231v-.927C2.462.696 3.155 0 4.001 0h.614c.846 0 1.54.696 1.54 1.546v.927h3.691v-.927c0-.85.693-1.546 1.54-1.546h.613c.847 0 1.539.696 1.539 1.546v.927h1.232c.673 0 1.23.56 1.23 1.236v11.055z\"></path></svg>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M4.63 14.589L.448 10.066a1.524 1.524 0 0 1 0-2.158c.597-.617 1.593-.514 2.19 0l3.087 3.186 7.666-9.56c.498-.616 1.494-.719 2.091-.205.598.514.697 1.542.2 2.159L6.92 14.383c-.299.411-.697.514-1.195.617-.398 0-.797-.206-1.095-.411z\"></path></svg>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.007 10.469a2.503 2.503 0 0 1-2.5-2.5c0-1.378 1.122-2.5 2.5-2.5s2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5m7.746-3.953l-1.476-.238a6.483 6.483 0 0 0-.835-1.869l.923-1.111a.281.281 0 0 0-.017-.369l-1.524-1.523a.29.29 0 0 0-.373-.022l-1.209.953a6.44 6.44 0 0 0-1.845-.715L9.3.25A.272.272 0 0 0 9.033 0H6.879a.278.278 0 0 0-.271.249l-.117 1.405c-.627.15-1.217.39-1.758.707l-1.271-.979a.292.292 0 0 0-.374.024L1.564 2.929a.29.29 0 0 0-.021.373l.966 1.21a6.457 6.457 0 0 0-.787 1.825l-1.473.114A.276.276 0 0 0 0 6.72v2.155c0 .137.112.263.248.28l1.403.169c.144.682.399 1.323.74 1.908l-.847 1.062a.287.287 0 0 0 .02.372l1.524 1.524a.3.3 0 0 0 .377.027l1.046-.774a6.47 6.47 0 0 0 2.068.864l.108 1.444c.01.137.131.249.268.249h2.013a.291.291 0 0 0 .282-.248l.183-1.445a6.438 6.438 0 0 0 2.03-.84l.985.748c.11.083.279.071.376-.025l1.524-1.524a.3.3 0 0 0 .027-.378l-.767-1.032a6.472 6.472 0 0 0 .788-2.117l1.355-.107A.275.275 0 0 0 16 8.763V6.806a.305.305 0 0 0-.247-.29\"></path></svg>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.217 0h1.736v9.087l1.99-2.158 1.227 1.33-4.085 4.43L4 8.26l1.227-1.33 1.99 2.158V0zm7.06 3.034c.95 0 1.723.831 1.723 1.853v9.26C16 15.169 15.228 16 14.277 16H1.723C.773 16 0 15.168 0 14.148V4.887c0-1.022.773-1.853 1.723-1.853H3v1.853H1.723v9.26h12.554v-9.26H13V3.034h1.277z\"></path></svg>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.005 2h13.99C15.548 2 16 2.458 16 3.019v1.16s-.392.243-.872.521L8.872 8.324c-.479.278-1.264.278-1.744 0L.872 4.7 0 4.196V3.019C0 2.458.452 2 1.005 2zm8.855 8.094L16 6.52v6.46c0 .562-.45 1.02-1 1.02H1c-.55 0-1-.458-1-1.02V6.52l6.14 3.574c.676.394 1.386.477 1.86.477.475 0 1.184-.083 1.86-.477z\"></path></svg>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1.3 13c0 .2-.1.3-.3.3H7c-.2 0-.3-.2-.3-.3v-2c0-.2.2-.3.3-.3h2c.2 0 .3.2.3.3v2zm0-3.6c0 .1-.2.3-.4.3H7c-.2 0-.4-.1-.4-.3l-.1-6.5c0-.1 0-.1.1-.2s.2-.1.3-.1h2.3c.1 0 .2 0 .3.1.1 0 .1.1.1.2l-.3 6.5z\"></path></svg>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.891 14.2L9.017.6c-.2-.4-.598-.6-.997-.6-.398 0-.797.2-.996.6L.15 14.2c-.199.4-.199.8 0 1.2.2.4.598.6.997.6h13.65c.398 0 .796-.2.996-.6.199-.4.299-.8.1-1.2zM9.316 14c0 .2-.1.3-.3.3H7.025c-.2 0-.299-.2-.299-.3v-2c0-.2.2-.3.3-.3h1.992c.199 0 .299.2.299.3v2zm0-3.6c0 .1-.2.3-.399.3H7.024c-.2 0-.398-.1-.398-.3l-.1-6.5c0-.1 0-.1.1-.2s.199-.1.298-.1h2.292c.1 0 .2 0 .299.1.1 0 .1.1.1.2l-.3 6.5z\"></path></svg>"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.217 0h1.736v9.087l1.99-2.158 1.227 1.33-4.085 4.43L4 8.26l1.227-1.33 1.99 2.158V0zm7.06 3.034c.95 0 1.723.831 1.723 1.853v9.26C16 15.169 15.228 16 14.277 16H1.723C.773 16 0 15.168 0 14.148V4.887c0-1.022.773-1.853 1.723-1.853H3v1.853H1.723v9.26h12.554v-9.26H13V3.034h1.277z\"></path></svg>"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.565 5.403h-.01c-.136-.002-.237-.054-.301-.155-.125-.198-.09-.556.094-.934.301-.623.907-1.13 1.35-1.13h.009c.136.003.238.056.302.157.125.197.089.555-.094.933-.301.623-.907 1.13-1.35 1.13zM7.479 1.835C3.119 2.917-.231 7.132.012 11.232.148 13.375 1.37 15.169 3.222 16a21.401 21.401 0 0 1 .969-6.958c.792-2.527 2.01-4.79 3.622-6.729a.184.184 0 0 1 .072-.052c.338-.086.66-.148.978-.191.13-.003.21.077.21.178l-.02.079a.191.191 0 0 1-.026.036 6.762 6.762 0 0 0-.703.86c-.732 1.065-1.047 1.902-.91 2.421.06.225.202.391.437.509.284.142.536.211.768.211.735 0 1.208-.721 1.808-1.634.115-.176.234-.357.36-.54.443-.646.876-1.472 1.15-2.19A6.942 6.942 0 0 0 9.51 1.58c-.664 0-1.347.086-2.031.256zM6.484 15.33c-.683 0-1.343-.09-1.964-.27-.07-1.635.279-3.257.939-4.357.496-.827 1.12-1.283 1.756-1.283.725 0 1.422.598 1.912 1.64.36.764.586 1.707.651 2.726a.181.181 0 0 0 .183.167l.057-.01c.376-.195.72-.402 1.05-.627a.176.176 0 0 0 .079-.146l-.009-.055c-.487-1.162-.947-2.587-.705-4.442.254-1.943 1.245-4.087 3.028-6.553l.025-.051.008-.05a.174.174 0 0 0-.068-.14C12.446 1.114 11.088.71 9.5.71c-.281 0-.57.012-.865.038.226-.25.461-.497.703-.738.134-.007.269-.01.401-.01 3.481 0 6.05 2.335 6.249 5.678.241 4.093-3.103 8.307-7.454 9.394a8.552 8.552 0 0 1-2.05.26zM13.127 14a.989.989 0 0 1 .502-.866c.157-.089.326-.133.508-.133a1.016 1.016 0 0 1 .877.497.989.989 0 0 1 .133.502.985.985 0 0 1-.504.869 1.01 1.01 0 0 1-.506.132 1.007 1.007 0 0 1-.876-.499.987.987 0 0 1-.134-.502zm1.845 0a.83.83 0 0 0-.107-.413.828.828 0 0 0-.728-.42.84.84 0 0 0-.725.413.826.826 0 0 0-.111.42.83.83 0 0 0 .836.835.828.828 0 0 0 .727-.42.835.835 0 0 0 .108-.415zm-1.04.101v.45h-.214v-1.136h.4c.142 0 .255.031.338.092a.304.304 0 0 1 .124.26c0 .1-.054.177-.161.233a.244.244 0 0 1 .121.115c.024.05.035.111.035.184s.002.125.005.155c.004.03.01.056.02.076v.022h-.221a1.002 1.002 0 0 1-.019-.26c0-.067-.015-.116-.046-.146-.032-.03-.084-.045-.157-.045h-.225zm0-.179h.194c.07 0 .128-.014.173-.043.045-.028.067-.066.067-.112 0-.062-.017-.107-.05-.133-.034-.026-.095-.04-.183-.04h-.2v.328z\"></path></svg>"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.784 1.239l-5.603 5.602v8.432a.736.736 0 0 1-.442.671.849.849 0 0 1-.285.056.677.677 0 0 1-.51-.216l-2.91-2.909a.72.72 0 0 1-.216-.511V6.841L.217 1.239a.716.716 0 0 1-.16-.795A.737.737 0 0 1 .727 0h14.546c.295 0 .557.182.67.444a.716.716 0 0 1-.159.795\"></path></svg>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0C3.589 0 0 3.59 0 8c0 4.412 3.589 8 8 8s8-3.588 8-8c0-4.41-3.589-8-8-8zm0 3.8a1 1 0 1 1 0 2.002A1 1 0 0 1 8 3.8zm2.4 8.2H5.6v-1.6h1.6V8h-.8V6.4H8a.8.8 0 0 1 .8.8v3.2h1.6V12z\"></path></svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15 4c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V5c0-.005.003-.009.003-.013 0-.005-.003-.008-.003-.013V3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1h9zm-7.3 8.022l.053-.001a1 1 0 0 0 .74-.39l3.237-4.214a1.001 1.001 0 0 0-1.586-1.219L7.62 9.485 6.426 8.23a1 1 0 1 0-1.45 1.378l2 2.103c.19.199.451.311.724.311z\"></path></svg>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 0h3.368v3.507H0V0zm4.21 0H7.58v3.507H4.21V0zM0 5.48h3.368v3.506H0V5.48zm4.21 0H7.58v3.506H4.21V5.48zM0 10.958h3.368v3.507H0v-3.507zm4.21 0H7.58v3.507H4.21v-3.507zM9.475 0h3.368v3.507H9.474V0zm.631 16l-1.684-5.26h1.684V5.48h2.527v4.383L16 10.74V16h-5.895z\"></path></svg>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.813 11.902a.555.555 0 0 1 .07.747l-2.326 3.138c-.105.14-.247.176-.423.213-.141 0-.282-.072-.387-.143l-1.482-1.565a.521.521 0 0 1 0-.749c.212-.213.565-.177.776 0l1.093 1.104 1.938-2.673a.543.543 0 0 1 .74-.072zm-2.47-5.268c0 3.664-2.986 6.634-6.671 6.634C2.988 13.268 0 10.298 0 6.634S2.988 0 6.672 0c3.685 0 6.671 2.97 6.671 6.634zM7.679 8.418V3.15a1.01 1.01 0 0 0-1-1.021c-.553 0-1 .456-1 1.02v3.208L3.688 6.34h-.009c-.548 0-.995.45-1 1.011a1.01 1.01 0 0 0 .991 1.03l4.009.037z\"></path></svg>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.895 2.832c.7.619 1.47 1.127 2.291 1.513a17.386 17.386 0 0 0-.37 3.237H2.702v.028H.208a.398.398 0 0 0-.201.055 7.94 7.94 0 0 1 1.888-4.833zm12.304.094a7.938 7.938 0 0 1 1.808 4.684h-2.592v-.028h-1.18a17.435 17.435 0 0 0-.357-3.173 9.64 9.64 0 0 0 2.32-1.483zm-9.352 1.7a16.881 16.881 0 0 0-.32 2.956h6.786a16.973 16.973 0 0 0-.296-2.836 9.149 9.149 0 0 1-6.17-.12zm.233-.97C5.7 1.448 6.765 0 7.92 0c1.175 0 2.259 1.502 2.873 3.776a8.288 8.288 0 0 1-5.713-.12zM2.565 2.132A7.999 7.999 0 0 1 6.001.258C5.35.99 4.813 2.068 4.432 3.37a8.76 8.76 0 0 1-1.867-1.238zm8.38 9.472a16.72 16.72 0 0 0 .369-3.225H4.526c.024 1.206.166 2.34.396 3.345a8.03 8.03 0 0 1 6.022-.12zm-.249.957C10.07 14.645 9.036 16 7.92 16c-1.095 0-2.11-1.304-2.741-3.32a7.272 7.272 0 0 1 5.518-.118zm3.158.887a9.399 9.399 0 0 0-.652-.562 8.672 8.672 0 0 0-1.39-.931c.247-1.066.396-2.253.423-3.505h3.767a7.947 7.947 0 0 1-2.148 4.998zm-11.622.074A7.948 7.948 0 0 1 .01 8.398a.398.398 0 0 0 .198.053h3.607c.028 1.281.183 2.495.442 3.58a8.472 8.472 0 0 0-.398.237 9.165 9.165 0 0 0-1.627 1.255zm10.801.451c.046.041.09.083.135.125a7.995 7.995 0 0 1-3.019 1.59c.563-.678 1.038-1.62 1.392-2.742.526.28 1.026.624 1.492 1.027zM4 13.316c.172-.113.348-.218.526-.317.355 1.107.827 2.034 1.386 2.703a7.992 7.992 0 0 1-2.963-1.52A8.241 8.241 0 0 1 4 13.317zm7.593-10.032C11.216 2.028 10.69.986 10.06.27c1.25.33 2.38.953 3.313 1.792a8.584 8.584 0 0 1-1.78 1.222z\"></path></svg>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 16L13 11.087 8.856 11.087 8.856 0 7.144 0 7.144 11.087 3 11.087z\"></path></svg>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 8L4.913 13 4.913 8.856 16 8.856 16 7.144 4.913 7.144 4.913 3z\"></path></svg>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 8L11.087 13 11.087 8.856 0 8.856 0 7.144 11.087 7.144 11.087 3z\"></path></svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0L3 4.913 7.144 4.913 7.144 16 8.856 16 8.856 4.913 13 4.913z\"></path></svg>"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M4.752 12.605h6.496V16H4.752v-3.395zm.939.967v1.454h4.618v-1.454H5.691zM1.5 6.688L7.996 0 14.5 6.688h-3.252v4.078H4.752V6.688H1.5zm6.496-5.313l-4.313 4.44h2.008v3.977h4.618V5.815h2l-4.313-4.44z\"></path></svg>"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M3.128 6.257a3.02 3.02 0 0 1-1.236-.254A3.168 3.168 0 0 1 .9 5.322c-.28-.286-.5-.618-.66-.996A3.041 3.041 0 0 1 0 3.128c0-.437.082-.844.245-1.223A3.15 3.15 0 0 1 .913.913 3.137 3.137 0 0 1 3.128 0c.426 0 .828.079 1.206.236.379.157.711.376.996.655a3.109 3.109 0 0 1 .927 2.237v2.106h3.486V3.128A3.087 3.087 0 0 1 10.67.891c.285-.28.617-.498.996-.655.378-.157.78-.236 1.206-.236a3.137 3.137 0 0 1 2.215.913c.282.283.505.613.668.992.163.379.245.786.245 1.223 0 .42-.08.819-.24 1.198-.16.378-.38.71-.66.996-.28.285-.61.512-.992.681a3.02 3.02 0 0 1-1.236.254h-2.106v3.486h2.106c.442 0 .855.085 1.236.254.382.169.712.396.992.681.28.286.5.618.66.996.16.38.24.778.24 1.198 0 .437-.082.844-.245 1.223a3.15 3.15 0 0 1-.668.992 3.137 3.137 0 0 1-2.215.913c-.426 0-.828-.079-1.206-.236a3.118 3.118 0 0 1-.996-.655 3.109 3.109 0 0 1-.927-2.237v-2.106H6.257v2.106a3.087 3.087 0 0 1-.927 2.237c-.285.28-.617.498-.996.655-.378.157-.78.236-1.206.236a3.137 3.137 0 0 1-2.215-.913 3.15 3.15 0 0 1-.668-.992A3.059 3.059 0 0 1 0 12.872c0-.42.08-.819.24-1.198.16-.378.38-.71.66-.996.28-.285.61-.512.992-.681a3.02 3.02 0 0 1 1.236-.254h2.106V6.257H3.128zm2.106-1.023V3.128a2.097 2.097 0 0 0-.607-1.49c-.19-.189-.412-.339-.669-.45a2.071 2.071 0 0 0-.83-.166c-.29 0-.562.056-.812.166-.25.111-.47.261-.66.45a2.097 2.097 0 0 0-.607 1.49c0 .297.053.574.161.83a2.068 2.068 0 0 0 1.918 1.276h2.106zm-2.106 5.532c-.29 0-.562.054-.812.161a2.068 2.068 0 0 0-1.105 1.114 2.12 2.12 0 0 0-.162.83 2.097 2.097 0 0 0 1.267 1.94c.25.111.521.167.812.167.297 0 .574-.056.83-.166a2.068 2.068 0 0 0 1.114-1.119c.108-.256.162-.53.162-.821v-2.106H3.128zm9.744-5.532a2.08 2.08 0 0 0 1.472-.607c.19-.19.338-.412.446-.669a2.12 2.12 0 0 0 .161-.83 2.097 2.097 0 0 0-1.271-1.94 1.997 1.997 0 0 0-.808-.166c-.297 0-.574.056-.83.166a2.068 2.068 0 0 0-1.114 1.119c-.108.256-.162.53-.162.821v2.106h2.106zm-2.106 5.532v2.106a2.097 2.097 0 0 0 .607 1.49c.19.189.412.339.669.45.256.11.533.166.83.166.285 0 .555-.056.808-.166.253-.111.475-.261.664-.45a2.097 2.097 0 0 0 .607-1.49 2.12 2.12 0 0 0-.161-.83 2.068 2.068 0 0 0-1.918-1.276h-2.106zm-1.023-4.51H6.257v3.487h3.486V6.257z\"></path></svg>"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M5.595 14L0 8.25 5.595 2.5H16V14H5.595zM1.58 8.25l4.484 4.6h8.817v-9.2H6.064L1.58 8.25zm7.773.808L6.851 11.63l-.787-.816L8.56 8.25 6.064 5.678l.787-.808 2.502 2.564L11.85 4.87l.794.808-2.496 2.572 2.496 2.564-.794.816-2.496-2.572z\"></path></svg>"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 15v-3h16v3H0zm0-6l7.995-8L16 9H0z\"></path></svg>"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 1h5.562l6.135 12.364H16V15h-5.562L4.294 2.627H0V1zm9.499 0H16v1.627H9.499V1z\"></path></svg>"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 8.35c0 .692-.25 1.3-.749 1.825-.499.525-1.103.788-1.813.788H7.419V13.5L0 9.963l7.419-3.567v2.537h5.155c.347 0 .645-.11.893-.329.249-.218.373-.502.373-.85V2.5H16v5.85z\"></path></svg>"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 8.489L7.995 0 16 8.489h-4.002V16H4.002V8.489H0zm7.995-6.743L2.687 7.382h2.471v7.391h5.684V7.382h2.462L7.995 1.746z\"></path></svg>"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 11L16 16 0 16 0 11 1.167 11 1.167 13.904 14.833 13.904 14.833 11z\"></path></svg>"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 12h-1.39V4H16v8zm-2.781-4L9.16 12V8.685H0v-1.37h9.16V4l4.059 4z\"></path></svg>"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M5.667 4.082c0-1.056 1.067-1.949 2.333-1.949 1.265 0 2.333.893 2.333 1.95v3.384H5.667V4.082zm7 3.385V4.082C12.667 1.838 10.566 0 8 0 5.433 0 3.333 1.838 3.333 4.082v3.385H2.44C1.648 7.467 1 8.06 1 8.783v5.9C1 15.407 1.647 16 2.44 16h11.12c.791 0 1.44-.593 1.44-1.317v-5.9c0-.723-.649-1.316-1.44-1.316h-.893z\"></path></svg>"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15 9L1 9 1 7 15 7z\"></path></svg>"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.06 10.353h-3.765a.94.94 0 0 0-.942.942v.94c-3.764 0-6.529-2.882-6.588-6.587h.94c.521 0 .943-.42.943-.942V.942A.942.942 0 0 0 4.705 0H.941A.942.942 0 0 0 0 .942v4.706C0 11.366 4.635 16 10.353 16h4.706c.52 0 .941-.42.941-.94v-3.765a.94.94 0 0 0-.94-.942\"></path></svg>"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9 9h6V7H9V1H7v6H1v2h6v6h2V9z\"></path></svg>"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.946 12V7.01H2V4.94h4.946V0h2.108v4.941H14V7.01H9.054V12H6.946zM14 16H2v-2h12v2z\"></path></svg>"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.216 10.292a4.086 4.086 0 0 1-4.083-4.08c0-2.25 1.832-4.08 4.083-4.08a4.088 4.088 0 0 1 4.085 4.08c0 2.25-1.833 4.08-4.085 4.08m9.471 3.889l-4.394-4.39a6.172 6.172 0 0 0 1.14-3.579A6.215 6.215 0 0 0 6.217 0 6.214 6.214 0 0 0 0 6.212a6.213 6.213 0 0 0 9.782 5.084l4.397 4.392c.208.209.481.312.754.312s.546-.103.754-.312a1.064 1.064 0 0 0 0-1.507\"></path></svg>"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9.062 8L9.062 3.808 11.498 6.089 13 4.682 8 0 3 4.682 4.502 6.089 6.938 3.808 6.938 8 6.938 12.192 4.502 9.911 3 11.318 8 16 13 11.318 11.498 9.911 9.062 12.192z\"></path></svg>"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.938 0L6.938 12.026 4.502 9.646 3 11.114 8 16 13 11.114 11.498 9.646 9.062 12.026 9.062 0z\"></path></svg>"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0L3 4.886 4.502 6.354 6.938 3.974 6.938 16 9.062 16 9.062 3.974 11.498 6.354 13 4.886z\"></path></svg>"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 7.779c0 .83-.604 1.523-1.422 1.737-.086.338-.189.671-.327.994a6.793 6.793 0 0 1-1.467 2.172 6.78 6.78 0 0 1-2.154 1.448c-.118.05-.24.087-.36.13-.12.424-.489.74-.946.74-.553 0-1-.453-1-1.01 0-.56.447-1.012 1-1.012.28 0 .532.118.713.306.068-.026.137-.045.204-.074a5.816 5.816 0 0 0 3.09-3.089 5.833 5.833 0 0 0 .464-2.292 5.831 5.831 0 0 0-3.555-5.382 5.773 5.773 0 0 0-4.462 0 5.76 5.76 0 0 0-1.837 1.235 5.831 5.831 0 0 0-1.717 4.147l.002.138c.008.33.047.66.118 1.014v.013c.037.154.106.403.178.5 0 0-.053.036-.266.073l-.017.002.001.001c-.006 0-.213.021-.256.021l-.04-.001C.87 9.59 0 8.78 0 7.779c0-.849.627-1.553 1.47-1.751.081-.3.175-.595.297-.883a6.792 6.792 0 0 1 1.468-2.17 6.758 6.758 0 0 1 2.154-1.449 6.786 6.786 0 0 1 5.241 0 6.769 6.769 0 0 1 2.154 1.449 6.789 6.789 0 0 1 1.467 2.17c.123.29.218.587.299.888.833.205 1.45.905 1.45 1.746zm-3.419-.11a4.571 4.571 0 1 1-9.143-.002 4.571 4.571 0 0 1 9.143.002zm-4.572 2.61c2.503 0 2.503-2.268 2.503-2.268s-2.404 2.191-5.005 0c0 0 0 2.267 2.502 2.267zm1.866-3.687c.438 0 .794-.374.794-.835 0-.462-.356-.837-.794-.837-.438 0-.794.375-.794.837 0 .461.356.835.794.835zM6.181 4.92c-.438 0-.794.375-.794.837 0 .461.356.835.794.835.439 0 .794-.374.794-.835 0-.462-.355-.837-.794-.837z\"></path></svg>"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M9.616 8l6.049-6.049A1.142 1.142 0 1 0 14.049.335L8 6.385 1.951.334A1.142 1.142 0 1 0 .335 1.951l6.05 6.05-6.05 6.048a1.142 1.142 0 1 0 1.616 1.616L8 9.616l6.049 6.049a1.14 1.14 0 0 0 1.616 0 1.142 1.142 0 0 0 0-1.616L9.615 8z\"></path></svg>"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M11.682 10.268a.999.999 0 1 1-1.414 1.414L8 9.414l-2.267 2.268a.999.999 0 1 1-1.414-1.414L6.586 8 4.319 5.732a.999.999 0 1 1 1.414-1.414L8 6.586l2.268-2.268a.999.999 0 1 1 1.414 1.414L9.414 8l2.268 2.268zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z\"></path></svg>"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = ":host {\n  background-color: inherit;\n  color: inherit;\n  display: inline-block;\n  height: 1em;\n  width: 1em;\n  /*\n    if the requested icon type is not valid (nothing injected),\n    make sure the element doesn't consume space on the page.\n  */\n}\n:host:empty {\n  height: 0;\n  width: 0;\n}\n::slotted(svg) {\n  fill: currentColor;\n  stroke: none;\n}\n"

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.addEventListener('WebComponentsReady', function () {
    var tagName = 'hx-reveal';
    var template = document.createElement('template');

    template.innerHTML = '\n      <style>' + __webpack_require__(51) + '</style>\n      ' + __webpack_require__(52) + '\n    ';

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
/* 51 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n}\n:host([open]) > #content {\n  display: block;\n}\n#content {\n  display: none;\n}\n#toggle {\n  background-color: transparent;\n  border: none;\n  color: inherit;\n  font-size: 1em;\n  margin: 0;\n  padding: 0;\n  text-align: left;\n  width: 100%;\n}\n#toggle:empty {\n  display: none;\n}\n#toggle:hover {\n  cursor: pointer;\n}\n"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "<button id=\"toggle\" aria-expanded=\"false\">\n  <slot name=\"summary\"></slot>\n</button>\n<div id=\"content\">\n  <slot></slot>\n</div>\n"

/***/ })
/******/ ]);