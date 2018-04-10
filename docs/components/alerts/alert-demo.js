import Util from '../../_util';

if (document.getElementById('vue-alertDemo')) {
    const TYPES = [
        { label: 'Default', value: '' },
        { label: 'Info', value: 'info' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
    ];

    new Vue({
        el: '#vue-alertDemo',
        data: {
            content: 'Nope! Nope! Nope! Nope! Nope!',
            cta: 'burn it',
            isStatic: false,
            status: 'spider',
            type: TYPES[0],
            types: TYPES,
        },
        methods: {
            onSubmit: function () {
                alert('The spider didn\'t see that coming!');
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
            attrStatus: function () {
                if (this.status !== '') {
                    return `status="${this.status}"`;
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
                    <hx-alert
                        ${this.attrCta}
                        ${this.attrStatus}
                        ${this.isStatic ? 'static' : ''}
                        ${this.attrType}
                    >
                        ${this.content}
                    </hx-alert>
                `);
            },
        },
    });
}
