import Util from '../../_util';

const SIZES = [
    { value: 'hxSm', label: 'Small' },
    { value: '', label: 'Medium (Default)' },
    { value: 'hxLg', label: 'Large' },
];

if (document.getElementById('vue-drawerDemo')) {
    new Vue({
        el: '#vue-drawerDemo',
        data: {
            hasPadding: true,
            hasLengthyContent: false,
            size: SIZES[1], // Medium
            sizes: SIZES,
            title: 'Drawer Title',
        },
        computed: {
            attrBodyClass: function () {
                if (this.bodyClasses !== '') {
                    return `class="${this.bodyClasses}`;
                }
                return '';
            },
            attrDrawerClass: function () {
                if (this.drawerClasses !== '') {
                    return `class="${this.drawerClasses}`;
                }
                return '';
            },
            bodyClasses: function () {
                return this.hasPadding ? 'hxMd' : '';
            },
            drawerClasses: function () {
                return this.size.value;
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-disclosure
                      aria-controls="demo-drawer"
                      class="hxBtn"
                    >
                      Toggle Drawer
                    </hx-disclosure>

                    <hx-drawer
                      id="demo-drawer"
                      ${this.attrDrawerClass}
                    >
                      <header></header>

                      <hx-div ${this.attrBodyClass}>
                        ...
                      </hx-div>

                      <footer>
                        ...
                      </footer>
                    </hx-drawer>
                `);
            },
        },
    });
}
