(function () {
    const ICONS = [ 
        '',
        'key',
        'mime-archive', 
        'mime-audio',
        'mime-code',
        'mime-data',
        'mime-image',
        'mime-system', 
        'mime-text',
        'mime-video',
        'paperclip',
    ];
    
    if (document.getElementById('vue-fileTileDemo')) {
        new Vue({
            el: '#vue-fileTileDemo',
            data: {
                details: '1.3mb',
                href: 'path/to/id_rsa.pub',
                icon: ICONS[1],
                icons: ICONS,
                name: 'id_rsa.pub',
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
})();
