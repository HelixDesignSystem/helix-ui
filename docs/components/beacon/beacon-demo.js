import Util from '../../_util';

(function () {

    if (document.getElementById('vue-beaconDemo')) {
        new Vue({
            el: '#vue-beaconDemo',
            data: {
                title: 'Beacon!',
            },
            methods: {
                onEvent: function () {
                    return true;
                },
            },
            computed: {
                snippet: function () {
                    return Util.snippet(`
                        <hx-beacon></hx-beacon>
                    `);
                },
            },
        });
    }//vue-beaconDemo
})();
