import Util from '../../_util';

if (document.getElementById('vue-passwordInputDemo')) {
    new Vue({
        el: '#vue-passwordInputDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            hasError : false,
            hasHelpText : false,
            isDisabled: false,
            isRequired: false,
            Password: 'Pas$w0rd',
            label : 'Password',
            errorTextToDisplay: false,
            helpTextToDisplay: false,
            helpText: 'At least 8 characters with 1 uppercase, 1 lowercase, and 1 number.',
            errorText: 'Please enter a valid password',
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
            isHelpTextHidden: function () {
                return (this.helpTextToDisplay ? '' : 'hidden');
            },
            isErrorTextHidden: function () {
                return (this.errorTextToDisplay ? '' : 'hidden');
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
                      <p class="hxHelpText" ${this.isHelpTextHidden}>
                        ${this.helpText}
                      </p>
                      <p class="hxErrorText" ${this.isErrorTextHidden}>
                        <hx-error>
                            ${this.errorText}
                        </hx-error>
                      </p>
                    </hx-password-control>
                `);
            },
        },
    });
}
