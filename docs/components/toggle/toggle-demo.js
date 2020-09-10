import Util from '../../_util';

if (document.getElementById('vue-toggleDemo')) {
    new Vue({
        el: '#vue-toggleDemo',
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-toggle-control>
                      <input type="checkbox" id="toggleDemo" />
                      <label for="toggleDemo">
                        <hx-toggle aria-labelledby="toggleDemo">
                        </hx-toggle>
                      </label>
                    </hx-toggle-control>
                `);
            },
        },
    });
}
