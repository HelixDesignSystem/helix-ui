import Util from '../../_util';

if (document.getElementById('vue-radioBasicDemo')) {
    new Vue({
        el: '#vue-radioBasicDemo',
        data: {
            isChecked: false,
            isDisabled: false,
            isRequired: false,
            radioLabel: 'Radio Label',
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-radio-control>
                      <input
                        type="radio"
                        id="radBasicDemo"
                        ${this.isChecked ? 'checked' : ''}
                        ${this.isDisabled ? 'disabled' : ''}
                        ${this.isRequired ? 'required' : ''}
                      />
                      <label for="radBasicDemo">
                        <hx-radio></hx-radio>
                        ${this.radioLabel}
                      </label>
                    <hx-radio-control>
                `);
            },
        },
    });
}
