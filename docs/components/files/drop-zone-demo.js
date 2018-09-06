if (document.getElementById('vue-dropZoneDemo')) {
    new Vue({
        el: '#vue-dropZoneDemo',
        methods: {
            onDrop: function (evt) {
                // Prevent default behavior (Prevent file from being opened)
                evt.preventDefault();
                if (evt.dataTransfer.items) {
                    // Use DataTransferItemList interface to access the file(s)
                    for (var i = 0; i < evt.dataTransfer.items.length; i++) {
                        // If dropped items aren't files, reject them
                        if (evt.dataTransfer.items[i].kind === 'file') {
                            var file = evt.dataTransfer.items[i].getAsFile();
                            alert('File Drop Successful! ' + file.name);
                        }
                    }
                } else {
                // Use DataTransfer interface to access the file(s)
                    for (var i = 0; i < evt.dataTransfer.files.length; i++) {
                        //alert('file drop successful! ' + evt.dataTransfer.files[i].name);
                    }
                }
            },
        },
    });
}
