if (document.getElementById('vue-listDemo')) {
    new Vue({
        el: '#vue-listDemo',
        data: {
            isVertical: false,
        },
        computed: {
            hxDlClasses: function () {
                return (this.isVertical ? 'hxVertical' : '');
            },
        },
    });
}
