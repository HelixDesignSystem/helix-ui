import Util from '../../_util';

if (document.getElementById('vue-optionDemo')) {
    let SIZES = [
        { value: 'hxSm', label: 'Small' },
        { value: '', label: 'Medium' },
        { value: 'hxLg', label: 'Large' },
    ];

    new Vue({
        el: '#vue-optionDemo',
        data: {
            size: SIZES[1], // Medium
            sizes: SIZES,
            description: 'A couple of descriptive lines or a small bit of help text.',
            isChecked: false,
            isDisabled: false,
            isInvalid: false,
            isSubdued: false,
            title: 'Title Here',
        },
        methods: {
            onClick: function (evt) {
                this.isChecked = evt.target.checked;
            },
        },
        computed: {
            tileClasses: function () {
                let out = [];
                out.push(this.size.value);
                if (this.isSubdued) {
                    out.push('hxSubdued');
                }
                return out.join(' ').trim();
            },
            radAttrs: function () {
                let out = [];
                if (this.isChecked) {
                    out.push('checked');
                }
                if (this.isDisabled) {
                    out.push('disabled');
                }
                if (this.isInvalid) {
                    out.push('invalid');
                }
                return out.join(' ');
            },
            classAttr: function () {
                if (this.tileClasses !== '') {
                    return `class="${this.tileClasses}"`;
                }
                return '';
            },
            snippet: function () {
                return Util.snippet(`
                  <label class="hxOption">
                    <input type="radio" ${this.radAttrs}>
                    <hx-tile ${this.classAttr}>
                      <hx-icon type="checkmark"></hx-icon>
                      <div class="hx-tile-icon">
                        <hx-icon type="account"></hx-icon>
                      </div>
                      <header>${this.title}</header>
                      <p>${this.description}</p>
                    </hx-tile>
                  </label>
                `);
            },
        },
    });
}
