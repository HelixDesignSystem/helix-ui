import Util from '../../_util';

if (document.getElementById('vue-emailInputDemo')) {
    new Vue({
        el: '#vue-emailInputDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            hasHelpText: false,
            hasErrorText: false,
            isDisabled: false,
            isRequired: false,
            label: 'Email',
            helpText: 'abc@abc.com',
            errorText: 'Please enter valid email',
            errorTextToDisplay: false,
            helpTextToDisplay: false,
            displayTrue: true,
            displayFalse: false,
            isHelpText : '',
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
            helpTextClass: function () {
                let textClasses = [];

                if (this.hasHelpText) {
                    textClasses.push('hxHelpText');
                    this.helpTextToDisplay = this.displayTrue;
                    this.isHelpText = '<p ${this.helpTextClass}  >${this.helpText}</p>';
                } else {
                    this.helpTextToDisplay = this.displayFalse;
                }

                let textClassNames = textClasses.join(' ');

                return (textClassNames === '' ? '' : `class="${textClassNames}"`);
            },
            errorTextClass: function () {
                let errorTextClasses = [];
                if (this.hasErrorText) {
                    errorTextClasses.push('hxErrorText');
                    this.errorTextToDisplay = this.displayTrue;
                } else {
                    this.errorTextToDisplay = this.displayFalse;
                }
                let errorTextClassNames = errorTextClasses.join(' ');

                return (errorTextClassNames === '' ? '' : `class="${errorTextClassNames}"`);
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
                      <p ${this.helpTextClass}  >${this.helpText}</p>
                      <p ${this.errorTextClass} >${this.errorText}</p>
                    </hx-email-control>
                `);
            },
        },
    });
}
