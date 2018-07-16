if (document.getElementById('vue-boxDemo')) {
    let SIZES = [
        { value: 'hxBox-xs', label: 'Extra Small' },
        { value: 'hxBox-sm', label: 'Small' },
        { value: 'hxBox-md', label: 'Medium', default: true },
        { value: 'hxBox-lg', label: 'Large' },
        { value: 'hxBox-xl', label: 'Extra Large' },
    ];

    new Vue({
        el: '#vue-boxDemo',
        data: {
            size: SIZES[2],
            sizes: SIZES,
        },
    });
}
