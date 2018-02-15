if (document.getElementById('vue-searchDemo')) {
    new Vue({
        el: '#vue-searchDemo',
        data: {
            state: 'default',
            states: [
                'default',
                'value',
                'invalid',
            ],
        },
        computed: {
            isInvalid: function () {
                return this.state === 'invalid';
            },
            isValue: function () {
                if (this.state && this.state === 'value') {
                    return 'foo';
                } else {
                    return '';
                }
            },
        },
    });
}
