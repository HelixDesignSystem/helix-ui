if (document.getElementById('vue-buttonDemo')) {
    const SIZES = [
        { label: 'Small', val: 'hxSm' },
        { label: 'Medium', val: '' },
        { label: 'Large', val: 'hxLg' },
    ];

    const VARIANTS = [
        { label: 'Default', val: '' },
        { label: 'Primary', val: 'hxPrimary' },
        { label: 'Link', val: 'hxLink' },
    ];

    new Vue({
        el: '#vue-buttonDemo',
        data: {
            size: SIZES[1],
            sizes: SIZES,
            variant: VARIANTS[0],
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
