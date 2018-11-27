import { WITH_ARROW as POSITIONS } from '../../_positions.js';

if (document.getElementById('vue-tooltipDemo')) {
    new Vue({
        el: '#vue-tooltipDemo',
        data: {
            position: POSITIONS[1], // "top"
            positions: POSITIONS,
        },
    });
}
