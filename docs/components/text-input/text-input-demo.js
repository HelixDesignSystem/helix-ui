import Util from '../../_util';

if (document.getElementById('vue-textInputDemo')) {
    new Vue({
        el: '#vue-textInputDemo',
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
                    <hx-text-control>
                      <input
                        id="txtDemo"
                        type="text"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      />
                      <label
                        for="txtDemo"
                        ${this.lblClasses}
                      >
                        ${this.label}
                      </label>
                    </hx-text-control>
                `);
            },
        },
    });
}
