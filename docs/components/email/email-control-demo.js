import Util from '../../_util';

if (document.getElementById('vue-emailInputDemo')) {
    new Vue({
        el: '#vue-emailInputDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            isDisabled: false,
            isRequired: false,
            label: 'Email',
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
                    <hx-email-control>
                      <input
                        id="emailDemo"
                        type="email"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      />
                      <label
                        for="emailDemo"
                        ${this.lblClasses}
                      >
                        ${this.label}
                      </label>
                    </hx-email-control>
                `);
            },
        },
    });
}
