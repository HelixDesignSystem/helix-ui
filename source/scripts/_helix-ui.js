/*
 * Entrypoint to build HelixUI web components
 */
'use strict';

/* ===== Web Components ===== */
// Each file will be responsible for defining itself
// with the custom element registry
import '../components/icons/_HxIcon';

/* Left Nav Toggle Behavior */
(function () {
    var _headers = document.querySelectorAll('.hx-app-nav header');

    _headers.forEach(function (header) {
        header.addEventListener('click', function (evt) {
            evt.target.parentElement.classList.toggle('open');
        });
    });
})();
