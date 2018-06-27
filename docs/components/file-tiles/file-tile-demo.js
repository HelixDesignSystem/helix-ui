if (document.getElementById('vue-fileTileDemo')) {
    new Vue({
        el: '#vue-fileTileDemo',
        data: {
            content: '1.3mb',
            state: 'default',
            icon: 'mime-archive',
            name: 'unicorns.gzip',
            href: 'path/to/unicorns.gzip',
            progressValue: 42,
        },
        methods: {
            onEvent: function (evt) {
                alert(`emitted ${evt.type} event`);
            },
        },
        computed: {
            isDefault: function () { 
                return this.state === 'default'; 
            },
            isLoading: function () { 
                return this.state === 'loading'; 
            },
            isInvalid: function () { 
                return this.state === 'invalid' ;
            },
        },
    });
}
