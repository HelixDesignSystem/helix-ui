'use strict';

import './components/box/box-demo';

/* ====================================== *\
 * DO NOT INCLUDE IN DISTRIBUTED ASSETS!! *
\* ====================================== */

// Demonstrate BS3 Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
    });
});
