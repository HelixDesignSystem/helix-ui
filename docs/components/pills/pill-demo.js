import Util from '../../_util';

if (document.getElementById('vue-pillDemo')) {
    new Vue({
        el: '#vue-pillDemo',
        data: {
            content: 'status: unicorns!',
            isDismissable: false,
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-pill
                        ${this.isDismissable ? 'dismissable' : ''}
                    >
                        ${this.content}
                    </hx-pill>
                `);
            },
        },
    });
}
