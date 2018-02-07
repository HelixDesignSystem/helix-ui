if (document.getElementById('vue-tableDemo')) {
    new Vue({
        el: '#vue-tableDemo',
        data: {
            isBound: false,
            isHoverable: false,
            isCondensed: false,
        },
        computed: {
            cssClasses: function () {
                var out = [ 'hxTable' ];
                if (this.isCondensed) {
                    out.push('hxTable--condensed');
                }
                if (this.isBound) {
                    out.push('hxBound');
                }
                if (this.isHoverable) {
                    out.push('hxHoverable');
                }
                return out.join(' ');
            },
        },
    });
}
