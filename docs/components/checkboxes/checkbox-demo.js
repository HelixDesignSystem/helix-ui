import Util from '../../_util';

if (document.getElementById('vue-checkboxDemo')) {
    new Vue({
        el: '#vue-checkboxDemo',
        data: {
            isChecked: false,
            isDisabled: false,
            isIndeterminate: false,
            isRequired: false,
            label: 'Check me out',
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-checkbox-control>
                      <input
                        type="checkbox"
                        id="chkDemo"
                        ${this.isChecked ? 'checked' : ''}
                        ${this.isDisabled ? 'disabled' : ''}
                        ${this.isRequired ? 'required' : ''}
                      />
                      <label for="chkDemo">
                        <hx-checkbox></hx-checkbox>
                        ${this.label}
                      </label>
                    </hx-checkbox-control>
                `);
            },
        },
    });
}
