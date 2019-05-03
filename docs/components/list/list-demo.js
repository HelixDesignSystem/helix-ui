if (document.getElementById('vue-listDemo')) {
    new Vue({
        el: '#vue-listDemo',
        data: {
            isVertical: false,
        },
        computed: {
            classes: function () {
                let out = [ 'hxList' ];
                if (this.isVertical) {
                    out.push('hxVertical');
                }
                return out.join(' ');
            },
        },
    });
}
