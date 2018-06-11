if (document.getElementById('vue-fileTileDemo')) {
    new Vue({
        el: '#vue-fileTileDemo',
        data: {
            details: '1.3mb',
            href: 'path/to/unicorns.gzip',
            icon: 'mime-archive',
            name: 'unicorns.gzip',
            progress: 42,
            state: 'downloadable',
        },
        methods: {
            onEvent: function (evt) {
                evt.preventDefault();
                alert(`Event: "${evt.type}"`);
            },
        },
        computed: {
            isDownloadable: function () {
                return this.state === 'downloadable';
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
