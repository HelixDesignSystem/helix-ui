import Util from '../../_util';

if (document.getElementById('vue-selectDemo')) {
    new Vue({
        el: '#vue-selectDemo',
        data: {
            isDisabled: false,
            isRequired: false,
        },
        computed: {
            attrDisabled: function () {
                return (this.isDisabled ? 'disabled' : '');
            },
            attrRequired: function () {
                return (this.isRequired ? 'required' : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-select-control>
                      <select
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      >
                        ...
                      </select>

                      <hx-select></hx-select>
                    </hx-select-control>
                `);
            },
        },
    });
}
