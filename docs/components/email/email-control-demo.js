import Util from '../../_util';

if (document.getElementById('vue-emailInputDemo')) {
    new Vue({
        el: '#vue-emailInputDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            hasHelpText : false,
            hasErrorText: false,
            isDisabled: false,
            isRequired: false,
            label: 'Email',
            helpText: 'abc@abc.com',
            errorText: 'Please enter valid email',
            errorTextToDisplay: false,
            helpTextToDisplay: false,
            displayTrue :true,
            displayFalse: false,
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

                if (this.hasHelpText) {
                    classes.push('hxOptional1');
                    this.helpTextToDisplay = this.displayTrue;
                } else {
                    this.helpTextToDisplay = this.displayFalse;
                }

                if (this.hasErrorText) {
                    classes.push('hxErrorText');
                    this.errorTextToDisplay = this.displayTrue;
                } else {
                    this.errorTextToDisplay = this.displayFalse;
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
                      <p>${this.helpText}</p>
                      <p>${this.errorText}</p>
                    </hx-email-control>
                `);
            },
        },
    });
}
