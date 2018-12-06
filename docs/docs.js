'use strict';
import 'whatwg-fetch';

import './_config';
import './components/accordions/accordion-demo';
import './components/alerts/alert-demo';
import './components/box/box-demo';
import './components/buttons/button-demo';
import './components/checkboxes/checkbox-demo';
import './components/choice-tiles/choice-tile-demo';
import './components/files/drop-zone-demo';
import './components/files/file-input-demo';
import './components/files/file-tile-demo';
import './components/icons/icon-demo';
import './components/lists/list-demo';
import './components/loaders/loader-demo';
import './components/modals/modal-demo';
import './components/panels/panel-demo';
import './components/pills/pill-demo';
import './components/popovers/popover-demo';
import './components/reveals/reveal-demo';
import './components/search/search-demo';
import './components/stepper/stepper-demo';
import './components/tables/table-demo';
import './components/text-inputs/text-input-demo';
import './components/toasts/toast-demo';
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
