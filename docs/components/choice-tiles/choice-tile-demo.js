import Util from '../../_util';

if (document.getElementById('vue-choiceDemo')) {
    const SIZES = [
        { value: 'hxSm', label: 'Small' },
        { value: '', label: 'Default' },
        { value: 'hxLg', label: 'Large' },
    ];

    new Vue({
        el: '#vue-choiceDemo',
        data: {
            description: 'A couple of descriptive lines or a small bit of help text.',
            isChecked: false,
            isDisabled: false,
            isInvalid: false,
            isSubdued: false,
            size: SIZES[1],
            sizes: SIZES,
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
            hasClasses: function () {
                return (this.tileClasses !== '');
            },
            snippet: function () {
                return Util.snippet(`
                  <label class="hxOption">
                    <input type="radio"
                        ${this.isChecked ? 'checked' : ''}
                        ${this.isDisabled ? 'disabled' : ''}
                        ${this.isInvalid ? 'invalid' : ''}>
                    <hx-option-tile ${this.hasClasses ? `class="${this.tileClasses}"` : ''}>
                      <hx-icon type="account"></hx-icon>
                      <header>${this.title}</header>
                      <p>${this.description}</p>
                    </hx-tile>
                  </label>
                `);
            },
        },
    });
}
