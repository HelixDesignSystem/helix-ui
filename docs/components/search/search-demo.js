import Util from '../../_util';

if (document.getElementById('vue-searchDemo')) {
    new Vue({
        el: '#vue-searchDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            isDisabled: false,
            isRequired: false,
            label: 'Username',
        },
        computed: {
            attrDisabled: function () {
                return (this.isDisabled ? 'disabled' : '');
            },
            attrRequired: function () {
                return (this.isRequired ? 'required' : '');
            },
            lblClasses: function () {
                let classes = [];

                if (this.hasAsterisk) {
                    classes.push('hxRequired');
                }

                if (this.hasOptional) {
                    classes.push('hxOptional');
                }

                let classNames = classes.join(' ');

                return (classNames === '' ? '' : `class="${classNames}"`);
            },
            snippet: function () {
                return Util.snippet(`
                  <hx-search-control>
                    <input
                      id="demoSearch"
                      type="search"
                      ${this.attrDisabled}
                      ${this.attrRequired}
                      ${this.hasValue ? `value="${this.searchValue}"` : ''}
                    />
                    <button type="button" class="hxClear" hidden aria-label="Clear search">
                      <hx-icon type="times"></hx-icon>
                    </button>
                    <hx-search</hx-search>
                    <label
                      for="demoSearch"
                      ${this.lblClasses}
                    >
                      ${this.label}
                    </label>
                  </hx-search-control>
                `);
            },
        },
    });
}//vue-searchDemo

if (document.getElementById('vue-searchAssistanceDemo')) {
    new Vue({
        el: '#vue-searchAssistanceDemo',
        data: {
            searchValue: '',
        },
        methods: {
            // fires on 'input' and 'clear' events
            onUpdate: function (evt) {
                this.searchValue = evt.target.value;
            },
            onFocus: function () {
                this.$refs.search.open = true;
            },
            onBlur: function () {
                this.$refs.search.open = false;
            },
            onReset: function () {
                this.searchValue = '';
            },
        },
        computed: {
            hasValue: function () {
                return (this.searchValue && this.searchValue !== '');
            },
        },
    });
}
