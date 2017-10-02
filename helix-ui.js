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

__webpack_require__(44);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.addEventListener('WebComponentsReady', function () {
    var icons = {
        'angle-down': __webpack_require__(2),
        'angle-left': __webpack_require__(3),
        'angle-right': __webpack_require__(4),
        'angle-up': __webpack_require__(5),
        'calendar': __webpack_require__(6),
        'checkmark': __webpack_require__(7),
        'cog': __webpack_require__(8),
        'download': __webpack_require__(9),
        'envelope': __webpack_require__(10),
        'exclamation-circle': __webpack_require__(11),
        'exclamation-triangle': __webpack_require__(12),
        'export': __webpack_require__(13),
        'fanatiguy': __webpack_require__(14),
        'filter': __webpack_require__(15),
        'info-circle': __webpack_require__(16),
        'input-file': __webpack_require__(17),
        'input-number': __webpack_require__(18),
        'input-time': __webpack_require__(19),
        'input-url': __webpack_require__(20),
        'kbd-arrow-down': __webpack_require__(21),
        'kbd-arrow-left': __webpack_require__(22),
        'kbd-arrow-right': __webpack_require__(23),
        'kbd-arrow-up': __webpack_require__(24),
        'kbd-capslock': __webpack_require__(25),
        'kbd-command': __webpack_require__(26),
        'kbd-delete': __webpack_require__(27),
        'kbd-eject': __webpack_require__(28),
        'kbd-option': __webpack_require__(29),
        'kbd-return': __webpack_require__(30),
        'kbd-shift': __webpack_require__(31),
        'kbd-space': __webpack_require__(32),
        'kbd-tab': __webpack_require__(33),
        'lock': __webpack_require__(34),
        'phone': __webpack_require__(35),
        'plus-or-minus': __webpack_require__(36),
        'search': __webpack_require__(37),
        'sort': __webpack_require__(38),
        'sort-down': __webpack_require__(39),
        'sort-up': __webpack_require__(40),
        'support': __webpack_require__(41),
        'times': __webpack_require__(42),
        'times-circle': __webpack_require__(43)
    };

    var HxIcon = function (_HTMLElement) {
        _inherits(HxIcon, _HTMLElement);

        _createClass(HxIcon, null, [{
            key: 'is',
            get: function get() {
                return 'hx-icon';
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
/* 2 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.528 3.098L0 4.51 7.946 13.405 15.98 4.412 14.452 3 7.946 10.282z\"></path></svg>"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.98 3.095L0.5 4.461 8.198 13.067 15.98 4.366 14.5 3 8.198 10.046z\" transform=\"rotate(90 8.24 8.033)\"></path></svg>"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.98 3.095L0.5 4.461 8.198 13.067 15.98 4.366 14.5 3 8.198 10.046z\" transform=\"rotate(-90 8.24 8.033)\"></path></svg>"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.528 3.098L0 4.51 7.946 13.405 15.98 4.412 14.452 3 7.946 10.282z\" transform=\"rotate(-180 7.99 8.202)\"></path></svg>"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M14.41 1.464h-1.49V0h-1.491v3.765H9.938v-2.3H5.764V0H4.373v3.765H2.882v-2.3H1.491C.696 1.464 0 2.195 0 3.032V14.43C0 15.268.696 16 1.49 16h13.02c.794 0 1.49-.732 1.49-1.569V3.033c-.1-.837-.795-1.569-1.59-1.569zM5.068 13.7H2.186v-3.032h2.882v3.032zm0-4.601H2.186V6.065h2.882v3.033zm4.373 4.601H6.46v-3.032h2.882v3.032h.099zm0-4.601H6.46V6.065h2.882v3.033h.099zm4.273 0h-2.882V6.065h2.882v3.033z\"></path></svg>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M4.63 14.604L.448 10.242c-.597-.594-.597-1.486 0-2.081s1.593-.496 2.19 0l3.087 3.073 7.666-9.218c.498-.595 1.494-.694 2.091-.199.598.496.697 1.487.2 2.082L6.92 14.405c-.299.397-.697.496-1.195.595-.398 0-.797-.198-1.095-.396z\"></path></svg>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 9.6V6.4h-1.8c-.2-.8-.5-1.4-.9-2.1l1.1-1.1-1.6-1.6-1.1 1.1c-.7-.4-1.4-.7-2.1-.9V0H6.4v1.8c-.7.2-1.4.5-2.1.9L3.2 1.6 1.6 3.2l1.1 1.1c-.4.7-.7 1.3-.9 2.1H0v3.2h1.8c.2.7.5 1.4.9 2l-1.1 1.1 1.6 1.6 1.1-1.1c.7.5 1.4.8 2.1 1V16h3.2v-1.8c.7-.2 1.4-.5 2.1-.9l1.1 1.1 1.6-1.6-1.1-1.1c.4-.6.7-1.3.9-2.1H16zm-8 1.694c-1.59 0-2.98-1.407-2.98-3.216C5.02 6.27 6.31 4.863 8 4.863s2.98 1.407 2.98 3.215c0 1.81-1.39 3.216-2.98 3.216z\"></path></svg>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.217 0h1.736v9.087l1.99-2.158 1.227 1.33-4.085 4.43L4 8.26l1.227-1.33 1.99 2.158V0zm7.06 3.034c.95 0 1.723.831 1.723 1.853v9.26C16 15.169 15.228 16 14.277 16H1.723C.773 16 0 15.168 0 14.148V4.887c0-1.022.773-1.853 1.723-1.853H3v1.853H1.723v9.26h12.554v-9.26H13V3.034h1.277z\"></path></svg>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.02 7.165L1.493 2.586c.178-.05.36-.086.554-.086h11.947c.193 0 .376.036.553.086L8.02 7.165zm.523 1.211l7.331-5.142c.034.14.055.286.055.436v7.823c0 1.078-.893 1.955-1.991 1.955H1.99C.893 13.448 0 12.571 0 11.493V3.67c0-.15.022-.296.055-.437l7.331 5.143a1 1 0 0 0 1.157 0z\"></path></svg>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1.3 13c0 .2-.1.3-.3.3H7c-.2 0-.3-.2-.3-.3v-2c0-.2.2-.3.3-.3h2c.2 0 .3.2.3.3v2zm0-3.6c0 .1-.2.3-.4.3H7c-.2 0-.4-.1-.4-.3l-.1-6.5c0-.1 0-.1.1-.2s.2-.1.3-.1h2.3c.1 0 .2 0 .3.1.1 0 .1.1.1.2l-.3 6.5z\"></path></svg>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.891 14.2L9.017.6c-.2-.4-.598-.6-.997-.6-.398 0-.797.2-.996.6L.15 14.2c-.199.4-.199.8 0 1.2.2.4.598.6.997.6h13.65c.398 0 .796-.2.996-.6.199-.4.299-.8.1-1.2zM9.316 14c0 .2-.1.3-.3.3H7.025c-.2 0-.299-.2-.299-.3v-2c0-.2.2-.3.3-.3h1.992c.199 0 .299.2.299.3v2zm0-3.6c0 .1-.2.3-.399.3H7.024c-.2 0-.398-.1-.398-.3l-.1-6.5c0-.1 0-.1.1-.2s.199-.1.298-.1h2.292c.1 0 .2 0 .299.1.1 0 .1.1.1.2l-.3 6.5z\"></path></svg>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.217 0h1.736v9.087l1.99-2.158 1.227 1.33-4.085 4.43L4 8.26l1.227-1.33 1.99 2.158V0zm7.06 3.034c.95 0 1.723.831 1.723 1.853v9.26C16 15.169 15.228 16 14.277 16H1.723C.773 16 0 15.168 0 14.148V4.887c0-1.022.773-1.853 1.723-1.853H3v1.853H1.723v9.26h12.554v-9.26H13V3.034h1.277z\"></path></svg>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><g fill-rule=\"evenodd\"><path fill-rule=\"nonzero\" d=\"M8.482 5.403h-.01c-.134-.002-.235-.054-.298-.155-.124-.198-.088-.556.093-.934.298-.623.898-1.13 1.337-1.13h.009c.135.003.235.056.299.157.123.197.088.555-.093.933-.298.623-.898 1.13-1.337 1.13zM7.406 1.835C3.089 2.917-.228 7.132.012 11.232.147 13.375 1.357 15.169 3.191 16a21.597 21.597 0 0 1 .96-6.958c.783-2.527 1.99-4.79 3.586-6.729a.182.182 0 0 1 .072-.052c.335-.086.652-.148.968-.191.129-.003.208.077.208.178l-.02.079a.191.191 0 0 1-.026.036 6.749 6.749 0 0 0-.696.86c-.725 1.065-1.036 1.902-.901 2.421.059.225.2.391.433.509.281.142.53.211.76.211.728 0 1.197-.721 1.79-1.634.115-.176.232-.357.357-.54.439-.646.868-1.472 1.14-2.19a6.815 6.815 0 0 0-2.405-.421c-.657 0-1.334.086-2.011.256zM6.421 15.33c-.676 0-1.33-.09-1.945-.27-.069-1.635.276-3.257.93-4.357.492-.827 1.11-1.283 1.74-1.283.717 0 1.407.598 1.893 1.64.356.764.58 1.707.645 2.726a.18.18 0 0 0 .18.167l.057-.01a10.07 10.07 0 0 0 1.04-.627.176.176 0 0 0 .078-.146l-.009-.055c-.482-1.162-.938-2.587-.698-4.442.251-1.943 1.232-4.087 2.999-6.553l.025-.051.008-.05a.175.175 0 0 0-.068-.14C12.325 1.114 10.98.71 9.407.71a9.87 9.87 0 0 0-.855.038c.223-.25.456-.497.695-.738.133-.007.266-.01.398-.01 3.447 0 5.991 2.335 6.188 5.678.239 4.093-3.073 8.307-7.382 9.394a8.391 8.391 0 0 1-2.03.26z\"></path><path d=\"M13 13.999a.996.996 0 0 1 .496-.866A.999.999 0 0 1 14 13a.999.999 0 0 1 .868.497A.996.996 0 0 1 15 14 .993.993 0 0 1 14 15a.99.99 0 0 1-.868-.499A.995.995 0 0 1 13 14zm1.827 0a.837.837 0 0 0-.106-.413.814.814 0 0 0-.721-.42.826.826 0 0 0-.718.413.832.832 0 0 0-.11.42.837.837 0 0 0 .41.724.817.817 0 0 0 .418.111c.15 0 .29-.038.419-.113a.801.801 0 0 0 .3-.307.842.842 0 0 0 .108-.415zm-1.03.101v.45h-.212v-1.136h.395c.142 0 .254.031.335.092a.305.305 0 0 1 .123.26c0 .1-.053.177-.16.233a.242.242 0 0 1 .121.115c.023.05.035.111.035.184s.001.125.005.155c.003.03.01.056.019.076v.022h-.219a1.011 1.011 0 0 1-.018-.26c0-.067-.015-.116-.046-.146-.031-.03-.083-.045-.155-.045h-.223zm0-.179h.192c.07 0 .126-.014.17-.043.045-.028.068-.066.068-.112 0-.062-.017-.107-.05-.133-.034-.026-.094-.04-.181-.04h-.199v.328z\"></path></g></svg>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.784 1.239l-5.603 5.602v8.432a.736.736 0 0 1-.442.671.849.849 0 0 1-.285.056.677.677 0 0 1-.51-.216l-2.91-2.909a.72.72 0 0 1-.216-.511V6.841L.217 1.239a.716.716 0 0 1-.16-.795A.737.737 0 0 1 .727 0h14.546c.295 0 .557.182.67.444a.716.716 0 0 1-.159.795\"></path></svg>"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.005.241C3.725.241.241 3.725.241 8.005c0 4.282 3.483 7.764 7.764 7.764 4.281 0 7.764-3.482 7.764-7.764 0-4.28-3.483-7.764-7.764-7.764zm0 3.689a.97.97 0 1 1 0 1.942.97.97 0 0 1 0-1.942zm2.33 7.957H5.675v-1.553H7.23V8.005h-.777V6.452h1.553c.43 0 .777.348.777.777v3.105h1.552v1.553z\"></path></svg>"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.2 12.152L4.234 9.208l1.132-1.123L7.2 9.907l3.434-3.41 1.132 1.123L7.2 12.152zm7.2-8.27H8L6.842 2.378a1.603 1.603 0 0 0-1.43-.878H.8c-.442 0-.8.356-.8.794v11.118C0 14.288.716 15 1.6 15h12.8c.883 0 1.6-.712 1.6-1.588V5.47c0-.876-.717-1.588-1.6-1.588z\"></path></svg>"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M0 .5h3.362v3.386H0V.5zm4.203 0h3.362v3.386H4.203V.5zM0 5.79h3.362v3.385H0V5.79zm4.203 0h3.362v3.385H4.203V5.79zM0 11.08h3.362v3.385H0V11.08zm4.203 0h3.362v3.385H4.203V11.08zM9.456.5h3.362v3.386H9.456V.5zm.63 15.446l-1.68-5.078h1.68V5.79h2.522v4.232l3.362.846v5.078h-5.884z\"></path></svg>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M12.093 6.118C12.093 2.745 9.381 0 6.047 0 2.712 0 0 2.745 0 6.118s2.713 6.117 6.047 6.117c3.333 0 6.046-2.744 6.046-6.117zM7.689 8.043L5.375 6.48V2.72h1.343v3.035l1.717 1.158-.746 1.13zm7.361 3.063l.95.971L12.165 16l-2.49-2.548.95-.972 1.54 1.576 2.885-2.95z\"></path></svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M1.89 2.832a9.646 9.646 0 0 0 2.284 1.513 17.433 17.433 0 0 0-.369 3.237h-1.11v.028H.208a.396.396 0 0 0-.201.055A7.953 7.953 0 0 1 1.89 2.832zm12.27.094a7.951 7.951 0 0 1 1.802 4.684h-2.584v-.028H12.2a17.482 17.482 0 0 0-.355-3.173 9.61 9.61 0 0 0 2.314-1.483zm-9.327 1.7a16.927 16.927 0 0 0-.32 2.956h6.768a17.019 17.019 0 0 0-.295-2.836 9.1 9.1 0 0 1-6.153-.12zm.232-.97C5.683 1.448 6.746 0 7.897 0c1.172 0 2.253 1.502 2.866 3.776a8.244 8.244 0 0 1-5.697-.12zM2.558 2.132A7.97 7.97 0 0 1 5.984.258C5.337.99 4.8 2.068 4.42 3.37a8.734 8.734 0 0 1-1.862-1.238zm8.355 9.472c.214-.975.345-2.066.37-3.225h-6.77c.024 1.206.166 2.34.395 3.345a7.987 7.987 0 0 1 6.005-.12zm-.247.957C10.041 14.645 9.01 16 7.897 16c-1.091 0-2.104-1.304-2.733-3.32a7.233 7.233 0 0 1 5.502-.118zm3.15.887a9.38 9.38 0 0 0-.652-.562 8.646 8.646 0 0 0-1.386-.931c.248-1.066.396-2.253.423-3.505h3.757a7.958 7.958 0 0 1-2.142 4.998zm-11.59.074A7.959 7.959 0 0 1 .01 8.398a.396.396 0 0 0 .198.053h3.597a17.2 17.2 0 0 0 .44 3.58 8.443 8.443 0 0 0-.396.237 9.143 9.143 0 0 0-1.624 1.255zm10.77.451c.046.041.09.083.135.125a7.965 7.965 0 0 1-3.01 1.59c.56-.678 1.034-1.62 1.388-2.742.524.28 1.023.624 1.488 1.027zm-9.007-.658c.172-.113.347-.218.525-.317.353 1.107.824 2.034 1.381 2.703a7.961 7.961 0 0 1-2.954-1.52c.33-.322.681-.611 1.048-.866zM11.56 3.284c-.376-1.256-.9-2.298-1.528-3.014a7.968 7.968 0 0 1 3.303 1.792 8.559 8.559 0 0 1-1.775 1.222z\"></path></svg>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 8.25L11.087 13 11.087 9.064 0 9.064 0 7.436 11.087 7.436 11.087 3.5z\" transform=\"matrix(0 1 1 0 -.25 .25)\"></path></svg>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 8.25L11.087 13 11.087 9.064 0 9.064 0 7.436 11.087 7.436 11.087 3.5z\" transform=\"matrix(-1 0 0 1 16 0)\"></path></svg>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 8.25L11.087 13 11.087 9.064 0 9.064 0 7.436 11.087 7.436 11.087 3.5z\"></path></svg>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 8.25L11.087 13 11.087 9.064 0 9.064 0 7.436 11.087 7.436 11.087 3.5z\" transform=\"matrix(0 -1 -1 0 16.25 16.25)\"></path></svg>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M4.752 12.605h6.496V16H4.752v-3.395zm.939.967v1.454h4.618v-1.454H5.691zM1.5 6.688L7.996 0 14.5 6.688h-3.252v4.078H4.752V6.688H1.5zm6.496-5.313l-4.313 4.44h2.008v3.977h4.618V5.815h2l-4.313-4.44z\"></path></svg>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M3.128 6.257a3.02 3.02 0 0 1-1.236-.254A3.168 3.168 0 0 1 .9 5.322c-.28-.286-.5-.618-.66-.996A3.041 3.041 0 0 1 0 3.128c0-.437.082-.844.245-1.223A3.15 3.15 0 0 1 .913.913 3.137 3.137 0 0 1 3.128 0c.426 0 .828.079 1.206.236.379.157.711.376.996.655a3.109 3.109 0 0 1 .927 2.237v2.106h3.486V3.128A3.087 3.087 0 0 1 10.67.891c.285-.28.617-.498.996-.655.378-.157.78-.236 1.206-.236a3.137 3.137 0 0 1 2.215.913c.282.283.505.613.668.992.163.379.245.786.245 1.223 0 .42-.08.819-.24 1.198-.16.378-.38.71-.66.996-.28.285-.61.512-.992.681a3.02 3.02 0 0 1-1.236.254h-2.106v3.486h2.106c.442 0 .855.085 1.236.254.382.169.712.396.992.681.28.286.5.618.66.996.16.38.24.778.24 1.198 0 .437-.082.844-.245 1.223a3.15 3.15 0 0 1-.668.992 3.137 3.137 0 0 1-2.215.913c-.426 0-.828-.079-1.206-.236a3.118 3.118 0 0 1-.996-.655 3.109 3.109 0 0 1-.927-2.237v-2.106H6.257v2.106a3.087 3.087 0 0 1-.927 2.237c-.285.28-.617.498-.996.655-.378.157-.78.236-1.206.236a3.137 3.137 0 0 1-2.215-.913 3.15 3.15 0 0 1-.668-.992A3.059 3.059 0 0 1 0 12.872c0-.42.08-.819.24-1.198.16-.378.38-.71.66-.996.28-.285.61-.512.992-.681a3.02 3.02 0 0 1 1.236-.254h2.106V6.257H3.128zm2.106-1.023V3.128a2.097 2.097 0 0 0-.607-1.49c-.19-.189-.412-.339-.669-.45a2.071 2.071 0 0 0-.83-.166c-.29 0-.562.056-.812.166-.25.111-.47.261-.66.45a2.097 2.097 0 0 0-.607 1.49c0 .297.053.574.161.83a2.068 2.068 0 0 0 1.918 1.276h2.106zm-2.106 5.532c-.29 0-.562.054-.812.161a2.068 2.068 0 0 0-1.105 1.114 2.12 2.12 0 0 0-.162.83 2.097 2.097 0 0 0 1.267 1.94c.25.111.521.167.812.167.297 0 .574-.056.83-.166a2.068 2.068 0 0 0 1.114-1.119c.108-.256.162-.53.162-.821v-2.106H3.128zm9.744-5.532a2.08 2.08 0 0 0 1.472-.607c.19-.19.338-.412.446-.669a2.12 2.12 0 0 0 .161-.83 2.097 2.097 0 0 0-1.271-1.94 1.997 1.997 0 0 0-.808-.166c-.297 0-.574.056-.83.166a2.068 2.068 0 0 0-1.114 1.119c-.108.256-.162.53-.162.821v2.106h2.106zm-2.106 5.532v2.106a2.097 2.097 0 0 0 .607 1.49c.19.189.412.339.669.45.256.11.533.166.83.166.285 0 .555-.056.808-.166.253-.111.475-.261.664-.45a2.097 2.097 0 0 0 .607-1.49 2.12 2.12 0 0 0-.161-.83 2.068 2.068 0 0 0-1.918-1.276h-2.106zm-1.023-4.51H6.257v3.487h3.486V6.257z\"></path></svg>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M5.595 14L0 8.25 5.595 2.5H16V14H5.595zM1.58 8.25l4.484 4.6h8.817v-9.2H6.064L1.58 8.25zm7.773.808L6.851 11.63l-.787-.816L8.56 8.25 6.064 5.678l.787-.808 2.502 2.564L11.85 4.87l.794.808-2.496 2.572 2.496 2.564-.794.816-2.496-2.572z\"></path></svg>"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M.043 14.5v-3.014h15.914V14.5H.043zM0 9.554L7.995 1.5 16 9.554H0z\"></path></svg>"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M0 1.5h5.562l6.135 11.922H16V15h-5.562L4.294 3.069H0V1.5zm9.499 0H16v1.569H9.499V1.5z\"></path></svg>"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 8.35c0 .692-.25 1.3-.749 1.825-.499.525-1.103.788-1.813.788H7.419V13.5L0 9.963l7.419-3.567v2.537h5.155c.347 0 .645-.11.893-.329.249-.218.373-.502.373-.85V2.5H16v5.85z\"></path></svg>"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M0 8.458L7.995.5 16 8.458h-4.002V15.5H4.002V8.458H0zm7.995-6.321L2.687 7.42h2.471v6.93h5.684V7.42h2.462L7.995 2.137z\"></path></svg>"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 10.5L16 16 0 16 0 10.5 1.167 10.5 1.167 13.904 14.833 13.904 14.833 10.5z\"></path></svg>"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M16 12h-1.39V4H16v8zm-2.781-4L9.16 12V8.685H0v-1.37h9.16V4l4.059 4z\"></path></svg>"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M10.786 7.2H5.214V4c0-1.323 1.25-2.4 2.786-2.4s2.786 1.077 2.786 2.4v3.2zM8 12.8c-.769 0-1.393-.537-1.393-1.2 0-.662.624-1.2 1.393-1.2s1.393.538 1.393 1.2c0 .663-.624 1.2-1.393 1.2zm4.643-5.6V4c0-2.206-2.084-4-4.643-4-2.561 0-4.643 1.794-4.643 4v3.2C2.333 7.2 1.5 7.917 1.5 8.8v5.6c0 .882.833 1.6 1.857 1.6h9.286c1.024 0 1.857-.718 1.857-1.6V8.8c0-.883-.833-1.6-1.857-1.6z\"></path></svg>"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.059 10.353h-3.765a.94.94 0 0 0-.941.941v.941c-3.765 0-6.529-2.882-6.588-6.588h.94a.94.94 0 0 0 .942-.941V.94A.94.94 0 0 0 4.706 0H.94A.94.94 0 0 0 0 .941v4.706C0 11.365 4.635 16 10.353 16h4.706a.94.94 0 0 0 .941-.941v-3.765a.94.94 0 0 0-.941-.941\"></path></svg>"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M7.152 12.615V7.37H2V5.194h5.152V0h2.196v5.194H14.5V7.37H9.348v5.246H7.152zM14.5 16H2v-2.187h12.5V16z\"></path></svg>"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M15.531 13.269c.303.302.469.704.469 1.131 0 .428-.166.829-.469 1.131A1.588 1.588 0 0 1 14.4 16c-.427 0-.83-.166-1.132-.47l-3.62-3.62a6.36 6.36 0 0 1-3.248.89 6.352 6.352 0 0 1-4.525-1.875A6.352 6.352 0 0 1 0 6.4c0-1.71.666-3.316 1.875-4.525A6.352 6.352 0 0 1 6.4 0c1.71 0 3.316.666 4.525 1.875A6.357 6.357 0 0 1 12.8 6.4a6.36 6.36 0 0 1-.89 3.247l3.621 3.622zm-9.02-3.036c2.261 0 4.094-1.75 4.094-3.907 0-2.158-1.833-3.907-4.093-3.907S2.419 4.168 2.419 6.326c0 2.157 1.832 3.907 4.093 3.907z\"></path></svg>"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8.873 8L8.873 3.808 11.233 6.089 12.688 4.682 7.844 0 3 4.682 4.455 6.089 6.815 3.808 6.815 8 6.815 12.192 4.455 9.911 3 11.318 7.844 16 12.688 11.318 11.233 9.911 8.873 12.192z\"></path></svg>"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M6.815 0L6.815 12.026 4.455 9.646 3 11.114 7.844 16 12.688 11.114 11.233 9.646 8.873 12.026 8.873 0z\"></path></svg>"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.844 0L3 4.886 4.455 6.354 6.815 3.974 6.815 16 8.873 16 8.873 3.974 11.233 6.354 12.688 4.886z\"></path></svg>"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M7.297.002c5.13-.08 7.82 2.083 7.97 7.057.754.447.731 1.065.731 2.264 0 .431.023.872-.104 1.171-.368.866-1.132.89-2.352.88-.136.567-.474 1.083-.758 1.517-.803 1.23-1.769 2.136-3.188 2.743-.635.272-1.613.506-2.456.266a6.808 6.808 0 0 1-2.248-1.118c-.714-.534-1.355-1.301-1.829-2.077-.165-.27-.32-.59-.444-.879l-.157-.453H1.338c-.104-.065-.272-.035-.391-.08-.233-.087-.518-.288-.654-.479-.321-.452-.287-1.17-.287-1.97 0-.33-.032-.702.052-.96.085-.261.266-.493.444-.665l.235-.16v-.186l.105-1.278c.187-.796.312-1.614.68-2.237C2.342 1.96 3.401.955 5.048.402c.454-.153.948-.205 1.437-.32.208-.049.66.016.81-.08zm-2.95 7.72c-.325.235-.72.501-1.235.535-.06.84.009 1.709.21 2.353l.079.374c.101.19.328.33.499.455.688.506 1.64.875 2.81.882.048-.143.174-.215.288-.294.626-.434 1.573-.378 2.075.134.13.133.353.385.262.722-.199.74-1.34 1.073-2.153.695-.21-.098-.441-.459-.63-.481l-1.05-.134c-.462-.12-.895-.31-1.313-.428v.027c.206.205.377.487.551.722.114.153.295.284.447.4.146.113.269.292.42.402a6.1 6.1 0 0 0 1.68.882c1.183.388 2.305-.228 2.994-.695 1.904-1.291 2.998-3.184 2.783-6.47-.196-.126-.377-.304-.578-.429-.558-.347-1.776-.726-2.625-.748v.026c.2.145.38.532.42.83h-.026c-.328-.406-1.542-.594-2.101-.83-.933-.392-1.817-1.036-2.258-1.925h-.053c-.043 1.428-.648 2.38-1.497 2.995zm5.556.097c.428-.013.71.092.873.337.343.519-.036 1.144-.487 1.271-.573.162-1.18-.42-.976-1.037.111-.337.34-.378.59-.57zm-4.182 0c.427-.013.71.092.873.337.344.522-.035 1.144-.488 1.271-.572.162-1.178-.424-.975-1.037.111-.337.34-.378.59-.57zm-.968-6.487c-1.943.856-3.037 2.64-3.117 5.395h.546c.21-2.082 1.362-3.816 2.857-4.601.417-.22.845-.315 1.35-.45.67-.18 2.03-.29 2.806-.106.498.119.994.205 1.428.397 1.764.777 2.92 2.479 3.195 4.76h.546c-.027-2.52-1.12-4.466-2.832-5.263a9.407 9.407 0 0 0-1.428-.502l-.572-.08C8.937.744 7.802.658 7.142.804c-.164.01-.328.018-.493.027-.68.159-1.322.25-1.896.502z\"></path></svg>"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M16 13.597L13.597 16 8.001 10.404 2.405 16 0.002 13.597 5.596 7.999 0 2.402 2.403 0 7.999 5.597 13.595 0 15.998 2.402 10.404 7.999z\"></path></svg>"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path d=\"M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.766 10.634l-1.132 1.132L8 9.132l-2.634 2.634-1.132-1.132L6.868 8 4.234 5.366l1.13-1.13L8 6.87l2.635-2.635 1.13 1.13L9.132 8l2.635 2.634z\"></path></svg>"

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.addEventListener('WebComponentsReady', function () {
    var template = document.createElement('template');

    template.innerHTML = '\n      <style>\n        :host {\n          display: block;\n        }\n\n        :host([open]) #content {\n          display: block;\n        }\n    \n        #content {\n          display: none;\n        }\n\n        #toggle {\n          background-color: transparent;\n          border: none;\n          color: inherit;\n          font-size: 1em;\n          margin: 0px;\n          padding: 0px;\n          text-align: left;\n          width: 100%;\n        }\n\n        #toggle:empty {\n          display: none;\n        }\n\n        #toggle:hover {\n          cursor: pointer;\n        }\n      </style>\n\n      <button id="toggle" aria-expanded="false">\n        <slot name="summary"></slot>\n      </button>\n      <div id="content">\n        <slot></slot>\n      </div>\n    ';

    var HxReveal = function (_HTMLElement) {
        _inherits(HxReveal, _HTMLElement);

        _createClass(HxReveal, null, [{
            key: 'is',
            get: function get() {
                return 'hx-reveal';
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
                ShadyCSS.prepareTemplate(template, 'hx-reveal');
                ShadyCSS.styleElement(_this);
            }
            _this.shadowRoot.appendChild(template.content.cloneNode(true));
            _this._btnToggle = _this.shadowRoot.querySelector('#toggle');
            _this.toggle = _this.toggle.bind(_this);
            return _this;
        }

        _createClass(HxReveal, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                this._btnToggle.addEventListener('click', this.toggle);
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                this._btnToggle.removeEventListener('click', this.toggle);
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(attr, oldValue, newValue) {
                if (attr === 'open') {
                    this._btnToggle.setAttribute('aria-expanded', newValue === '');
                }
            }
        }, {
            key: 'toggle',
            value: function toggle() {
                if (this.getAttribute('open') === '') {
                    this.close();
                } else {
                    this.open();
                }
            }
        }, {
            key: 'open',
            value: function open() {
                this.setAttribute('open', '');
            }
        }, {
            key: 'close',
            value: function close() {
                this.removeAttribute('open');
            }
        }]);

        return HxReveal;
    }(HTMLElement);

    customElements.define(HxReveal.is, HxReveal);
});

/***/ })
/******/ ]);