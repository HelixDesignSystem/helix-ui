import Util from '../../_util';

const SIZES = [
    { label: 'Small', className: 'hxSm' },
    { label: 'Medium', className: '', default: true },
    { label: 'Large', className: 'hxLg' },
];

if (document.getElementById('vue-basicModalDemo')) {
    new Vue({
        el: '#vue-basicModalDemo',
        data: {
            size: SIZES[1],
            sizes: SIZES,
            isScrollable: false,
        },
        computed: {
            attrScroll: function () {
                return (this.isScrollable ? 'scroll="vertical"' : '');
            },
            attrClass: function () {
                let { className } = this.size;
                return (className ? `class="${className}"` : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-disclosure
                      aria-controls="demo-modal"
                      class="hxBtn"
                    >
                      Open Modal
                    </hx-disclosure>
                    <hx-modal
                      id="demo-modal"
                      ${this.attrClass}
                    >
                      <header>
                        ...
                      </header>

                      <hx-div ${this.attrScroll}>
                        ...
                      </hx-div>

                      <footer>
                        <button class="hxBtn hxPrimary">Confirm</button>
                        <button class="hxBtn">Cancel</button>
                      </footer>
                    </hx-modal>
                `);
            },
        },
    });
}
