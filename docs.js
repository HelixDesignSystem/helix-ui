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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_box_demo__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_box_demo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_box_box_demo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_panels_panel_demo__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_panels_panel_demo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_panels_panel_demo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_popovers_popover_demo__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_popovers_popover_demo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_popovers_popover_demo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_status_pills_status_demo__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_status_pills_status_demo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_status_pills_status_demo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_tooltips_tooltip_demo__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_tooltips_tooltip_demo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_tooltips_tooltip_demo__);








(function () {
    var hashAnchors = document.querySelectorAll('[href^="#"]');

    [].forEach.call(hashAnchors, function (anchor) {
        anchor.addEventListener('click', function (evt) {
            evt.preventDefault();
            document.location.hash = evt.target.getAttribute('href');
        });
    });
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

if (document.getElementById('vue-boxDemo')) {
    new Vue({
        el: '#vue-boxDemo',
        data: {
            size: {
                label: 'Medium',
                value: 'hxBox-md'
            },
            sizes: [{ value: 'hxBox-xs', label: 'Extra Small' }, { value: 'hxBox-sm', label: 'Small' }, { value: 'hxBox-md', label: 'Medium' }, { value: 'hxBox-lg', label: 'Large' }, { value: 'hxBox-xl', label: 'Extra Large' }]
        }
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

if (document.getElementById('vue-panelDemo')) {
    new Vue({
        el: '#vue-panelDemo',
        data: {
            hasHead: true,
            hasFoot: true
        }
    });
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

if (document.getElementById('vue-popoverDemo')) {
    new Vue({
        el: '#vue-popoverDemo',
        data: {
            position: {
                label: 'Bottom Right',
                value: 'bottom-right'
            },
            positions: [{ label: 'Top Left', value: 'top-left' }, { label: 'Top', value: 'top' }, { label: 'Top Right', value: 'top-right' }, { label: 'Right Top', value: 'right-top' }, { label: 'Right', value: 'right' }, { label: 'Right Bottom', value: 'right-bottom' }, { label: 'Bottom Right', value: 'bottom-right' }, { label: 'Bottom', value: 'bottom' }, { label: 'Bottom Left', value: 'bottom-left' }, { label: 'Left Bottom', value: 'left-bottom' }, { label: 'Left', value: 'left' }, { label: 'Left Top', value: 'left-top' }]
        }
    });
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

if (document.getElementById('vue-statusDemo')) {
    new Vue({
        el: '#vue-statusDemo',
        data: {
            isFilled: false,
            variant: {
                label: 'Default',
                value: ''
            },
            variants: [{ value: '', label: 'Default' }, { value: 'hxEmphasisGray', label: 'Emphasis Gray' }, { value: 'hxEmphasisPurple', label: 'Emphasis Purple' }, { value: 'hxSubdued', label: 'Subdued' }]
        },
        computed: {
            cssClasses: function cssClasses() {
                var out = [];
                if (this.variant.value !== '') {
                    out.push(this.variant.value);
                }
                if (this.isFilled) {
                    out.push('hxFill');
                }
                return out.join(' ');
            }
        }
    });
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

if (document.getElementById('vue-tooltipDemo')) {
    new Vue({
        el: '#vue-tooltipDemo',
        data: {
            position: {
                label: 'Top',
                value: 'top'
            },
            positions: [{ label: 'Top Left', value: 'top-left' }, { label: 'Top', value: 'top' }, { label: 'Top Right', value: 'top-right' }, { label: 'Right Top', value: 'right-top' }, { label: 'Right', value: 'right' }, { label: 'Right Bottom', value: 'right-bottom' }, { label: 'Bottom Right', value: 'bottom-right' }, { label: 'Bottom', value: 'bottom' }, { label: 'Bottom Left', value: 'bottom-left' }, { label: 'Left Bottom', value: 'left-bottom' }, { label: 'Left', value: 'left' }, { label: 'Left Top', value: 'left-top' }]
        }
    });
}

/***/ })
/******/ ]);