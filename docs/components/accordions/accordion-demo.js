import Util from '../../_util';

if (document.getElementById('vue-singlePanelAccordionDemo')) {
    new Vue({
        el: '#vue-singlePanelAccordionDemo',
        data: {
            currentPanel: 0,
        },
        methods: {
            onPanelChange: function (evt) {
                let newIdx = evt.currentTarget.getAttribute('current-panel');
                this.currentPanel = Number(newIdx);
            },
            nextPanel: function () {
                this.$refs.accordion.selectNext();
            },
            prevPanel: function () {
                this.$refs.accordion.selectPrevious();
            },
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                  <hx-accordion current-panel="${this.currentPanel}">
                    <hx-accordion-panel ${this.currentPanel === 0 ? 'open' : ''}>
                      <header slot="header">Cupcake Ipsum</header>
                      <div class="hxBox hxMd">
                        <!-- body content goes here -->
                      </div>
                    </hx-accordion-panel>
                    <hx-accordion-panel ${this.currentPanel === 1 ? 'open' : ''}>...</hx-accordion-panel>
                    <hx-accordion-panel ${this.currentPanel === 2 ? 'open' : ''}>...</hx-accordion-panel>
                  </hx-accordion>
                `);
            },
        },
    });
}
