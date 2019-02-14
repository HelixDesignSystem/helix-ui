import Util from '../../_util';

if (document.getElementById('vue-selectDemo')) {
    new Vue({
        el: '#vue-selectDemo',
        data: {
            isDisabled: false,
            isRequired: false,
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <div class="hxSelect">
                      <select
                        ${this.isDisabled ? 'disabled' : ''}
                        id="demoSelect"
                        ${this.isRequired ? 'required' : ''}
                      >
                        ...
                      </select>

                      <hx-select></hx-select>

                      <label for="demoSelect">...</label>
                    </div>
                `);
            },
        },
    });
}
