'use strict';

import './styleguide/box/box-demo';
import './components/panels/panel-demo';
import './components/tooltip/tooltip-demo';
import './elements/hx-popover/popover-demo';

(function () {
    let hashAnchors = document.querySelectorAll('[href^="#"]');

    [].forEach.call(hashAnchors, function (anchor) {
        anchor.addEventListener('click', function (evt) {
            evt.preventDefault();
            document.location.hash = evt.target.getAttribute('href');
        });
    });
})();
