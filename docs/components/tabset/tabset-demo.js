import Util from '../../_util';

function getDefaultData (force = false) {
    let data = {
        nextID: 4,
        currentTab: 0,
        tabs: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ],
        tabSize: 3,
    };

    if (force === true) {
        data.autoUpdate = false;
    }

    return data;
}

if (document.getElementById('vue-dynamicTabsetDemo')) {
    new Vue({
        el: '#vue-dynamicTabsetDemo',
        data: getDefaultData(true),
        updated: function () {
            // keep currentTab in bounds
            if (this.currentTab >= this.tabs.length) {
                this.currentTab = (this.tabs.length ? this.tabs.length - 1 : 0);
            }

            // keep correct tab/panel pair open when a "tab" is added
            if (this.autoUpdate) {
                this.update();
            }

            this.tabSize = this.tabs.length;
        },
        methods: {
            addTab: function (dir) {
                let id = this.nextID++;

                switch (dir) {
                    case 'start':
                        this.tabs.unshift({ id });
                        break;
                    case 'end':
                        this.tabs.push({ id });
                        break;
                    default:
                        // do nothing
                        break;
                }
            },
            removeTab: function (dir) {
                switch (dir) {
                    case 'start':
                        this.tabs.shift();
                        break;
                    case 'end':
                        this.tabs.pop();
                        break;
                    default:
                        // do nothing
                        break;
                }
            },
            onTabchange: function (evt) {
                this.currentTab = evt.target.currentTab;
            },
            reset: function () {
                Object.assign(this.$data, getDefaultData());

                // defer update to next event loop to avoid
                // conflicting with resetting this.$data
                setTimeout(this.update, 0);
            },
            update: function () {
                this.$refs.tabset.update();
            },
        },
        computed: {
            _tabs: function () {
                return this.tabs.map((tab, idx) => {
                    let html = `<hx-tab id="tab-${tab.id}"`;
                    if (idx === this.currentTab) {
                        html += ' current="true"';
                    }
                    html += '></hx-tab>';
                    return html;
                });
            },
            _tabpanels: function () {
                return this.tabs.map((tab, idx) => {
                    let html = `<hx-tabpanel id="panel-${tab.id}"`;
                    if (idx === this.currentTab) {
                        html += ' open';
                    }
                    html += '></hx-tabpanel>';
                    return html;
                });
            },
            _tablist: function () {
                return this._tabs.reduce((all, tab) => {
                    return `${all}\n    ${tab}`;
                }, '');
            },
            _tabcontent: function () {
                return this._tabpanels.reduce((all, panel) => {
                    return `${all}\n    ${panel}`;
                }, '');
            },
            // Indentation is intentional because `Util.snippet()`
            // isn't smart enough to re-indent HTML tags.
            snippet: function () {
                return Util.snippet(`
<hx-tabset current-tab="${this.currentTab}" tabsize="${this.tabSize}">
  <hx-tablist>
    ${this._tablist}
  </hx-tablist>
  <hx-tabcontent>
    ${this._tabcontent}
  </hx-tabcontent>
</hx-tabset>
                `);
            },
        },
    });
}
