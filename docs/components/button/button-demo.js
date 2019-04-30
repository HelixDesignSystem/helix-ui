(function () {
    const SIZES = [
        { label: 'Small', val: 'hxSm' },
        { label: 'Medium', val: '', default: true },
        { label: 'Large', val: 'hxLg' },
    ];

    const VARIANTS = [
        { label: 'Primary', val: 'hxPrimary' },
        { label: 'Secondary', val: '', default: true },
        { label: 'Tertiary', val: 'hxTertiary' },
    ];

    if (document.getElementById('vue-basicButtonDemo')) {
        new Vue({
            el: '#vue-basicButtonDemo',
            data: {
                size: SIZES[1],
                sizes: SIZES,
                variant: VARIANTS[1],
                variants: VARIANTS,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxBtn' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.variant.val !== '') {
                        out.push(this.variant.val);
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-basicButtonDemo

    if (document.getElementById('vue-buttonGroupDemo')) {
        new Vue({
            el: '#vue-buttonGroupDemo',
            data: {
                size: SIZES[1],
                sizes: SIZES,
                variant: VARIANTS[1],
                variants: VARIANTS,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxBtnGroup' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.variant.val !== '') {
                        out.push(this.variant.val);
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-buttonGroupDemo
})();
