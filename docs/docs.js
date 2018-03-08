'use strict';

import './components/box/box-demo';
import './components/busy/busy-demo';
import './components/buttons/button-demo';
import './components/checkboxes/checkbox-demo';
import './components/lists/list-demo';
import './components/panels/panel-demo';
import './components/popovers/popover-demo';
import './components/reveals/reveal-demo';
import './components/status-pills/status-demo';
import './components/tables/table-demo';
import './components/tooltips/tooltip-demo';

(function () {
    let hashAnchors = document.querySelectorAll('[href^="#"]');

    [].forEach.call(hashAnchors, function (anchor) {
        anchor.addEventListener('click', function (evt) {
            evt.preventDefault();
            document.location.hash = evt.target.getAttribute('href');
        });
    });
})();
