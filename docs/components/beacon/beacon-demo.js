import Util from '../../_util';

(function () {

    if (document.getElementById('vue-beaconDemo')) {
        new Vue({
            el: '#vue-beaconDemo',
            data: {
                beaconEl: '<hx-beacon></hx-beacon>',
            },
            methods: {
                onEvent: function (evt) {
                    alert(`Beacon clicked! Event: ${evt.type}`);
                    this.beaconEl = '';
                },
            },
            computed: {
                snippet: function () {
                    return Util.snippet(`
                        <div>
                          ${this.beaconEl}
                        </div>
                    `);
                },
            },
        });
    }//vue-beaconDemo

    if (document.getElementById('vue-beacon-inline-styles')) {
        new Vue({
            el: '#vue-beacon-inline-styles',
            data: {
                beaconInlineStyles: 'top: 42%; left: 24px;',
                isOpen: false,
                isDismissed: false,
            },
            methods: {
                onEvent: function () {
                    this.isOpen = true;
                    this.isDismissed = true;
                },

            },
            computed: {
                beaconSnippet: function () {
                    if (this.isDismissed) {
                        return '';
                    } else {
                        return `<hx-beacon style="${this.beaconInlineStyles}"></hx-beacon>`;
                    }
                },
                snippetInlineStyles: function () {
                    return Util.snippet(`
                        <!-- Providing a border around the <div> for illustration -->
                        <div style="position: relative;">
                          ${this.beaconSnippet}
                          <hx-disclosure class="hxBtn" aria-controls="basicMenuId">
                            <hx-icon type="cog"></hx-icon>
                            <span>Actions</span>
                            <hx-icon class="hxPrimary" type="angle-down"></hx-icon>
                          </hx-disclosure>
                          <hx-menu id="basicMenuId">
                            <hx-menuitem>Action 1</hx-menuitem>
                            <hx-menuitem>Action 2</hx-menuitem>
                            <hx-menuitem>Action 3</hx-menuitem>
                          </hx-menu>
                        </div>
                    `);
                },
            },
        });
    }//vue-beacon-inline-styles

    if (document.getElementById('vue-beacon-Override-styles')) {
        new Vue({
            el: '#vue-beacon-Override-styles',
            data: {
                beaconOverrideStyles: 'top: 42%; left: 24px; --hxBeacon: #d32f2f;',
                isOpen: false,
                isDismissed: false,
            },
            methods: {
                onEvent: function () {
                    this.isOpen = true;
                    this.isDismissed = true;
                },

            },
            computed: {
                beaconOverrideSnippet: function () {
                    if (this.isDismissed) {
                        return '';
                    } else {
                        return `<hx-beacon style="${this.beaconOverrideStyles}"></hx-beacon>`;
                    }
                },
                snippetOverrideStyles: function () {
                    return Util.snippet(`
                        <!-- Providing a border around the <div> for illustration -->
                        <div style="position: relative;">
                          ${this.beaconOverrideSnippet}
                          <hx-disclosure class="hxBtn" aria-controls="overrideMenuId">
                            <hx-icon type="cog"></hx-icon>
                            <span>Actions</span>
                            <hx-icon class="hxPrimary" type="angle-down"></hx-icon>
                          </hx-disclosure>
                          <hx-menu id="overrideMenuId">
                            <hx-menuitem>Action 1</hx-menuitem>
                            <hx-menuitem>Action 2</hx-menuitem>
                            <hx-menuitem>Action 3</hx-menuitem>
                          </hx-menu>
                        </div>
                    `);
                },
            },
        });
    }//vue-beacon-Override-styles
})();
