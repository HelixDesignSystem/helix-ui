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
    });
}
