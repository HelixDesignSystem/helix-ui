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
            // fires on 'input' and 'clear' events
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
}//vue-searchDemo

if (document.getElementById('vue-searchAssistanceDemo')) {
    new Vue({
        el: '#vue-searchAssistanceDemo',
        data: {
            searchValue: '',
        },
        methods: {
            // fires on 'input' and 'clear' events
            onUpdate: function (evt) {
                this.searchValue = evt.target.value;
            },
            onFocus: function () {
                this.$refs.search.open = true;
            },
            onBlur: function () {
                this.$refs.search.open = false;
            },
        },
        computed: {
            hasValue: function () {
                return (this.searchValue && this.searchValue !== '');
            },
        },
    });
}
