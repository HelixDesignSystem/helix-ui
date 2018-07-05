(function () {
    'use strict';

    // Modified from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
    [Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(function (proto) {
        if (!proto.hasOwnProperty('remove')) {
            Object.defineProperty(proto, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function value() {
                    if (this.parentNode !== null) {
                        this.parentNode.removeChild(this);
                    }
                }
            });
        }
    });

    // Modified from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill

    /*
     * If browser supports a variation of matches(), (IE9+)
     * normalize to 'matches' on the prototype.
     */
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function (selectors) {
            var el = this;

            // fail fast if element isn't attached to the document
            if (!document.documentElement.contains(el)) {
                return null;
            }

            // Check if any ancestors match selectors
            while (el !== null && el.nodetype === 1) {
                if (el.matches(selectors)) {
                    return el;
                } else {
                    el = el.parentElement || el.parentNode;
                }
            }

            // Return null if no ancestors match
            return null;
        };
    }

}());
