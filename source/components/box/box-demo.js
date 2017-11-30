if (document.getElementById('vue-boxDemo')) {
    new Vue({
        el: '#vue-boxDemo',
        data: {
            size: {
                label: 'Medium',
                value: 'hxBox-md',
            },
            sizes: [
                { value: 'hxBox-xs', label: 'Extra Small' },
                { value: 'hxBox-sm', label: 'Small' },
                { value: 'hxBox-md', label: 'Medium' },
                { value: 'hxBox-lg', label: 'Large' },
                { value: 'hxBox-xl', label: 'Extra Large' },
            ],
        },
    });
}
