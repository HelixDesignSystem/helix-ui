import Util from '../../_util';

(function () {
    const ICONS = [ 'upload', 'paperclip' ];

    const VARIANTS = [
        { label: 'Primary', val: 'hxBtn hxPrimary' },
        { label: 'Secondary', val: 'hxBtn', default: true },
        { label: 'Tertiary', val: 'hxBtn hxTertiary' },
    ];

    if (document.getElementById('vue-fileInputDemo')) {
        new Vue({
            el: '#vue-fileInputDemo',
            data: {
                icon: ICONS[0],
                icons: ICONS,
                isDisabled: false,
                isMultiple: false,
                label: 'Upload File',
                variant: VARIANTS[1],
                variants: VARIANTS,
            },
            computed: {
                attrClass: function () {
                    if (this.variant.val !== '') {
                        return `class="${this.variant.val}"`;
                    } else {
                        return '';
                    }
                },
                attrIcon: function () {
                    return `icon="${this.icon}"`;
                },
                snippet: function () {
                    return Util.snippet(`
                        <hx-file-control>
                          <input
                            ${this.isDisabled ? 'disabled' : ''}
                            ${this.isMultiple ? 'multiple ' : ''}
                            id="fileInputDemo"
                            type="file"
                          />
                          <label for="fileInputDemo">
                            <hx-file-input
                              ${this.attrClass}
                              ${this.attrIcon}
                            >
                              ${this.label}
                            </hx-file-input>
                          </label>
                        </hx-file-control>
                    `);
                },
            },
        });
    }
})();
