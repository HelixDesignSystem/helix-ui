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
                // Use evt.currentTarget because evt.target is undefined in Firefox
                this.isChecked = evt.currentTarget.checked;
            },
        },
        computed: {
            snippet: function () {
                var raw = `<hx-checkbox
                    ${this.isChecked ? 'checked' : ''}
                    ${this.isDisabled ? 'disabled' : ''}
                    ${this.isIndeterminate ? 'indeterminate' : ''}
                    ${this.isInvalid ? 'invalid' : ''}
                ></hx-checkbox>`;
                var rawCollapsed = raw.replace(/[\r\n\s]+/gm, ' ');
                var rawNormalized = rawCollapsed.replace(/(\s>)/gm, '>');
                return rawNormalized;
            },
        },
    });
}
