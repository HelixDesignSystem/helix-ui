import Util from '../../_util';

if (document.getElementById('vue-passwordInputDemo')) {
    new Vue({
        el: '#vue-passwordInputDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            isDisabled: false,
            isRequired: false,
            label: 'Password',
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
                    <hx-password-control>
                      <input
                        id="pwdDemo"
                        type="password"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      />
                      <label
                        for="pwdDemo"
                        ${this.lblClasses}
                      >
                        ${this.label}
                      </label>
                    </hx-password-control>
                `);
            },
        },
    });
}
