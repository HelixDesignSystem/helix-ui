import Util from '../../_util';

if (document.getElementById('vue-slottedDrawerDemo')) {
    new Vue({
        el: '#vue-slottedDrawerDemo',
        data: {
            hasSlottedPadding: true,
            hasSlottedLengthyContent: false,
            drawerTitle: 'Drawer with Slotted Positionable Element',
        },
        computed: {
            attrBodyClass: function () {
                if (this.bodyClasses !== '') {
                    return `class="${this.bodyClasses}"`;
                }
                return '';
            },
            bodyClasses: function () {
                return this.hasSlottedPadding ? 'hxMd' : '';
            },  
            snippet: function () {
                return Util.snippet(`
                    <hx-disclosure
                      aria-controls="drawer-with-slotted-positionable-element"
                      class="hxBtn"
                    >
                    Drawer with Slotted Positionable Element
                    </hx-disclosure>

                    <hx-drawer
                      id="drawer-with-slotted-positionable-element"
                    >
                      <header></header>

                      <hx-div ${this.attrBodyClass}>
                        ...
                      </hx-div>
                      <hx-tooltip slot="fixed" for="info1" position="left-middle">
                        <header>Tooltip #1</header>
                        <p>
                          <code>hx-drawer &gt; hx-tooltip[slot="fixed"]</code>
                        </p>
                      </hx-tooltip>
            
                      <hx-popover slot="fixed" id="popover1" position="left-middle">
                        <header>
                          Popover #1
                        </header>
            
                        <hx-div>
                          <p>This popover is a slotted child of hx-drawer.</p>
                          <p><code>hx-drawer &gt; hx-popover[slot="fixed"]</code></p>
                        </hx-div>
                      </hx-popover>
                      <footer>
                        ...
                      </footer>
                    </hx-drawer>
                `);
            },
        },
    });
}
