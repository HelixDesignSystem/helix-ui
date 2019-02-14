import Util from '../../_util';

if (document.getElementById('vue-radioDemo')) {
    new Vue({
        el: '#vue-radioDemo',
        data: {
            isChecked: false,
            isDisabled: false,
            isRequired: false,
            label: 'Radio Label',
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-radio-control>
                      <input
                        type="radio"
                        id="radDemo"
                        ${this.isChecked ? 'checked' : ''}
                        ${this.isDisabled ? 'disabled' : ''}
                        ${this.isRequired ? 'required' : ''}
                      />
                      <label for="radDemo">
                        <hx-radio></hx-radio>
                        ${this.label}
                      </label>
                    </hx-radio-control>
                `);
            },
        },
    });
}
