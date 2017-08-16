'use strict';

/*
 * Entrypoint to build HelixUI web components
 */

/* Left Nav Toggle Behavior */
(function () {
    var _headers = document.querySelectorAll('.hx-app-nav header');

    _headers.forEach(function (header) {
        header.addEventListener('click', function (evt) {
            evt.target.parentElement.classList.toggle('open');
        });
    });
})();
