import Util from '../../_util';

if (document.getElementById('vue-busyDemo')) {
    new Vue({
        el: '#vue-busyDemo',
        data: {
            isPaused: false,
        },
    });
}

if (document.getElementById('vue-progressDemo')) {
    new Vue({
        el: '#vue-progressDemo',
        data: {
            pct: 42,
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-progress value="${this.pct}"></hx-progress>
                `);
            },
        },
    });
}
