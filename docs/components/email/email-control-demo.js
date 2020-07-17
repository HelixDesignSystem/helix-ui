import Util from '../../_util';

if (document.getElementById('vue-emailInputDemo')) {
    new Vue({
        el: '#vue-emailInputDemo',
        data: {
            hasHelpText: false,
            hasErrorText: false,
            isDisabled: false,
            isRequired: false,
            label: 'Email',
            labelState: '',
            helpText: 'abc@abc.com',
            errorText: 'Please enter a valid email',
            errorTextToDisplay: false,
            helpTextToDisplay: false,
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

                if (this.labelState === 'hxRequired') {
                    classes.push('hxRequired');
                }

                if (this.labelState === 'hxOptional') {
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
                    <hx-email-control>
                      <input
                        id="emailInputDemo"
                        type="email"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      />
                      <label
                        for="emailInputDemo"
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
                    </hx-email-control>
                `);
            },
        },
    });
}
