import Util from '../../_util';

if (document.getElementById('vue-checkboxDemo')) {
    new Vue({
        el: '#vue-checkboxDemo',
        data: {
            isChecked: true,
            isDisabled: false,
            isIndeterminate: false,
            isInvalid: false,
        },
        methods: {
            onChange: function (evt) {
                this.isChecked = evt.currentTarget.checked;
            },
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-checkbox
                      ${this.isChecked ? 'checked' : ''}
                      ${this.isDisabled ? 'disabled' : ''}
                      ${this.isIndeterminate ? 'indeterminate' : ''}
                      ${this.isInvalid ? 'invalid' : ''}
                    >
                    </hx-checkbox>
                `);
            },
        },
    });
}
