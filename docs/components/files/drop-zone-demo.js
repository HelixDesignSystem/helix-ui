if (document.getElementById('vue-dropZoneDemo')) {
    new Vue({
        el: '#vue-dropZoneDemo',
        methods: {
            onDrop: function (evt) {
                if (evt.dataTransfer.items) {
                    // Use DataTransferItemList interface to access the file(s)
                    Array.from(evt.dataTransfer.items).forEach(item => {
                        // If dropped items aren't files, reject them
                        if (item.kind === 'file') {
                            let file = item.getAsFile();
                            alert('File Drop Successful! ' + file.name);
                        }
                    });
                } else {
                    // TODO: find solution, unsure how to pull file info in IE11
                    alert('We detected a file drop!');
                }
            },
        },
    });
}
