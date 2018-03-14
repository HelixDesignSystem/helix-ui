import Util from '../../_util';

if (document.getElementById('vue-accordionDemo')) {
    new Vue({
        el: '#vue-accordionDemo',
        data: {
            isSinglePanel: false,
            currentPanel: 0,
        },
        methods: {
            onOpen: function (evt) {
                if (this.isSinglePanel) {
                    let newIdx = evt.currentTarget.getAttribute('current-panel');
                    this.currentPanel = Number(newIdx);
                }
            },
            nextPanel: function () {
                this.$refs.accordion.nextPanel();
            },
            prevPanel: function () {
                this.$refs.accordion.previousPanel();
            },
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-accordion ${this.isSinglePanel ? `current-panel="${this.currentPanel}"` : ''}>
                      <hx-accordion-panel ${!this.isSinglePanel ? 'open' : ''}>
                        <header slot="header">Cupcake Ipsum</header>
                        <div class="hxBox-md">
                          <!-- body content goes here -->
                        </div>
                      </hx-accordion-panel>
                      <hx-accordion-panel>...</hx-accordion-panel>
                      <hx-accordion-panel ${!this.isSinglePanel ? 'open' : ''}>...</hx-accordion-panel>
                    </hx-accordion>
                `);
            },
        },
    });
}
