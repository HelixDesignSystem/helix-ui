import Util from '../../_util';

if (document.getElementById('vue-searchDemo')) {
    new Vue({
        el: '#vue-searchDemo',
        data: {
            isDisabled: false,
            isInvalid: false,
            searchValue: '',
            placeholder: '',
        },
        methods: {
            // Used on "input" and "change" events
            onSearchUpdate: function (evt) {
                this.searchValue = evt.target.value;
            },
            onChkChange: function (evt, datum) {
                this[datum] = evt.currentTarget.checked;
            },
        },
        computed: {
            hasPlaceholder: function () {
                return (this.placeholder !== '');
            },
            hasValue: function () {
                return (this.searchValue && this.searchValue !== '');
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-search
                        ${this.isDisabled ? 'disabled' : ''}
                        ${this.isInvalid ? 'invalid' : ''}
                        ${this.hasPlaceholder ? `placeholder="${this.placeholder}"` : ''}
                        ${this.hasValue ? `value="${this.searchValue}"` : ''}>
                        <!-- inner content will be removed -->
                    </hx-search>
                `);
            },
        },
    });
}
