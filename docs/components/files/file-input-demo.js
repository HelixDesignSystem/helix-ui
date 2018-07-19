import Util from '../../_util';

(function () {
    const ICONS = [ 'upload', 'paperclip' ];
    
    const VARIANTS = [
        { label: 'Primary', val: 'hxPrimary' },
        { label: 'Secondary', val: '', default: true },
        { label: 'Tertiary', val: 'hxTertiary' },
    ];

    if (document.getElementById('vue-fileInputDemo')) {
        new Vue({
            el: '#vue-fileInputDemo',
            data: {
                icon: ICONS[0],
                icons: ICONS,
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
                attrLabel: function () {
                    if (this.label !== '') {
                        return `label="${this.label}"`;
                    } else {
                        return '';
                    }
                },
                snippet: function () {
                    return Util.snippet(`
                        <hx-file-input
                          ${this.attrClass}
                          ${this.attrIcon}  
                          ${this.attrLabel}
                        >
                          <input ${this.isMultiple ? 'multiple ' : ''}type="file" />
                        </hx-file-input>
                    `);
                },
            },
        });
    }
})();
