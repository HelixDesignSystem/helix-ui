import Util from '../../_util';

if (document.getElementById('vue-toastDemo')) {
    const TYPES = [
        { label: 'Default', value: '' },
        { label: 'Info', value: 'info' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
    ];

    new Vue({
        el: '#vue-toastDemo',
        data: {
            content: 'The password has been reset for foo@bar.com.',
            cta: 'try again',
            type: TYPES[0],
            types: TYPES,
        },
        methods: {
            onEvent: function (evt) {
                evt.preventDefault();
                alert(`Event: "${evt.type}"`);
            },
        },
        computed: {
            attrType: function () {
                if (this.type.value !== '') {
                    return `type="${this.type.value}"`;
                } else {
                    return '';
                }
            },
            attrCta: function () {
                if (this.cta !== '') {
                    return `cta="${this.cta}"`;
                } else {
                    return '';
                }
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-toast
                      ${this.attrCta}
                      ${this.attrType}
                    >
                      ${this.content}
                    </hx-toast>
                `);
            },
        },
    });
}
