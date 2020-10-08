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
            errorTextToDisplay: false,
            helpTextToDisplay: false,
            helpText: 'Please enter username.',
            errorText: 'Username should not be empty',
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
                      <p class="hxHelpText" ${this.isHelpTextHidden}>
                        ${this.helpText}
                      </p>
                      <p class="hxErrorText" ${this.isErrorTextHidden}>
                        <hx-error>
                            ${this.errorText}
                        </hx-error>
                      </p>
                    </hx-text-control>
                `);
            },
        },
    });
}
