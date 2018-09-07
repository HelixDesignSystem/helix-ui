if (document.getElementById('vue-dropZoneDemo')) {
    new Vue({
        el: '#vue-dropZoneDemo',
        methods: {
            onDrop: function (evt) {
                // Prevent default behavior (Prevent file from being opened)
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
                    // TO DO: find solution, alert currently not working in ie11
                    alert('Cannot detect dropped files in this browser.');
                }
            },
        },
    });
}
