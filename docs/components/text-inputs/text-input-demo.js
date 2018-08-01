import Util from '../../_util';

if (document.getElementById('vue-textInputDemo')) {
    new Vue({
        el: '#vue-textInputDemo',
        data: {
            isDisabled: false,
            isInvalid: false,
            placeholder: '',
            value: '',
        },
        computed: {
            attrPlaceholder: function () {
                if (this.placeholder !== '') {
                    return `placeholder="${this.placeholder}"`;
                }
                return '';
            },
            attrValue: function () {
                if (this.value !== '') {
                    return `value="${this.value}"`;
                }
                return '';
            },
            snippet: function () {
                return Util.snippet(`
                    <input
                      class="hxTextCtrl"
                      ${this.isDisabled ? 'disabled' : ''}
                      ${this.isInvalid ? 'invalid' : ''}
                      ${this.attrPlaceholder}
                      type="text"
                      ${this.attrValue}
                    />
                `);
            },
        },
    });
}

if (document.getElementById('vue-textAreaDemo')) {
    new Vue({
        el: '#vue-textAreaDemo',
        data: {
            isDisabled: false,
            isInvalid: false,
            placeholder: '',
            value: '',
        },
        computed: {
            attrPlaceholder: function () {
                if (this.placeholder !== '') {
                    return `placeholder="${this.placeholder}"`;
                }
                return '';
            },
            snippet: function () {
                return Util.snippet(`
                    <textarea
                      class="hxTextCtrl"
                      ${this.isDisabled ? 'disabled' : ''}
                      ${this.isInvalid ? 'invalid' : ''}
                      ${this.attrPlaceholder}
                    >${this.value}</textarea>
                `);
            },
        },
    });
}
