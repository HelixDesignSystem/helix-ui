import { WITH_ARROW as POSITIONS } from '../../_positions.js';

if (document.getElementById('vue-popoverDemo')) {
    new Vue({
        el: '#vue-popoverDemo',
        data: {
            position: POSITIONS[6], // "bottom-right"
            positions: POSITIONS,
        },
    });
}

if (document.getElementById('vue-scrollingPopoverDemo')) {
    new Vue({
        el: '#vue-scrollingPopoverDemo',
        data: {
            position: POSITIONS[6], // "bottom-right"
            positions: POSITIONS,
        },
    });
}
