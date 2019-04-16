import Util from '../../_util';

if (document.getElementById('vue-selectDemo')) {
    new Vue({
        el: '#vue-selectDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            isDisabled: false,
            isRequired: false,
            label: 'Choose an Option',
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
                    <hx-select-control>
                      <select
                        id="selDemo"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      >
                        <!-- ... -->
                      </select>
                      <hx-select></hx-select>
                      <label
                        for="selDemo"
                        ${this.lblClasses}
                      >
                        ${this.label}
                      </label>
                    </hx-select-control>
                `);
            },
        },
    });
}
