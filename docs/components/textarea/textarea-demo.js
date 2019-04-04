import Util from '../../_util';

if (document.getElementById('vue-textareaDemo')) {
    new Vue({
        el: '#vue-textareaDemo',
        data: {
            hasAsterisk: false,
            hasOptional: false,
            isDisabled: false,
            isRequired: false,
            label: 'Comments',
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
                    <hx-textarea-control>
                      <textarea
                        id="txtAreaDemo"
                        ${this.attrDisabled}
                        ${this.attrRequired}
                      ></textarea>
                      <label
                        for="txtAreaDemo"
                        ${this.lblClasses}
                      >
                        ${this.label}
                      </label>
                    </hx-textarea-control>
                `);
            },
        },
    });
}
