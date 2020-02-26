'use strict';
import 'whatwg-fetch';

HelixUI.initialize();

import './_config';
import './components/accordion/accordion-demo';
import './components/alert/alert-demo';
import './components/box/box-demo';
import './components/button/button-demo';
import './components/checkbox/checkbox-demo';
import './components/choice-tile/choice-tile-demo';
import './components/drawer/drawer-demo';
import './components/dropdown-select/select-demo';
import './components/file/drop-zone-demo';
import './components/file/file-input-demo';
import './components/file/file-tile-demo';
import './components/icon/icon-demo';
import './components/list/list-demo';
import './components/loader/loader-demo';
import './components/modal/modal-demo';
import './components/panel/panel-demo';
import './components/password/password-demo';
import './components/pill/pill-demo';
import './components/popover/popover-demo';
import './components/radio/radio-basic-demo';
import './components/radio/radio-demo';
import './components/reveal/reveal-demo';
import './components/search/search-demo';
import './components/stepper/stepper-demo';
import './components/table/table-demo';
import './components/tabset/tabset-demo';
import './components/text-input/text-input-demo';
import './components/textarea/textarea-demo';
import './components/toast/toast-demo';
import './components/tooltip/tooltip-demo';

(function () {
    let hashAnchors = document.querySelectorAll('[href^="#"]');

    [].forEach.call(hashAnchors, function (anchor) {
        anchor.addEventListener('click', function (evt) {
            evt.preventDefault();
            document.location.hash = evt.target.getAttribute('href');
        });
    });
})();

// TODO: update pipeline to load only on test pages
import './scripts/test-helpers';
