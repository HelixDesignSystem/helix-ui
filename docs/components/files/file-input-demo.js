(function () {
    const VARIANTS = [
        { label: 'Primary', val: 'hxPrimary' },
        { label: 'Secondary', val: '', default: true },
        { label: 'Tertiary', val: 'hxTertiary' },
    ];

    if (document.getElementById('vue-fileInputDemo')) {
        new Vue({
            el: '#vue-fileInputDemo',
            data: {
                variant: VARIANTS[1],
                variants: VARIANTS,
                icon: 'upload',
                label: 'Upload File',
            },
            computed: {
                classes: function () {
                    return this.variant.val;
                },
            },
        });
    }
})();
