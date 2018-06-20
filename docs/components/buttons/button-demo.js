if (document.getElementById('vue-buttonDemo')) {
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

    new Vue({
        el: '#vue-buttonDemo',
        data: {
            size: SIZES[1],
            sizes: SIZES,
            variant: VARIANTS[1],
            variants: VARIANTS,
        },
        computed: {
            loneClasses: function () {
                let out = [ 'hxBtn' ];
                if (this.size.val !== '') {
                    out.push(this.size.val);
                }
                if (this.variant.val !== '') {
                    out.push(this.variant.val);
                }
                return out.join(' ');
            },//loneClasses()

            groupClasses: function () {
                let out = [ 'hxBtnGroup' ];
                if (this.size.val !== '') {
                    out.push(this.size.val);
                }
                if (this.variant.val !== '') {
                    out.push(this.variant.val);
                }
                return out.join(' ');
            },//groupClasses()
        },
    });
}
