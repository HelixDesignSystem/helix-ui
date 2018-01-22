if (document.getElementById('vue-statusDemo')) {
    new Vue({
        el: '#vue-statusDemo',
        data: {
            isFilled: false,
            variant: {
                label: 'Default',
                value: '',
            },
            variants: [
                { value: '', label: 'Default' },
                { value: 'hxEmphasisGray', label: 'Emphasis Gray' },
                { value: 'hxEmphasisPurple', label: 'Emphasis Purple' },
                { value: 'hxSubdued', label: 'Subdued' }, 
            ],
        },
        computed: {
            cssClasses: function () {
                var out = [];
                if (this.variant.value !== '') {
                    out.push(this.variant.value);
                }
                if (this.isFilled) {
                    out.push('hxFill');
                }
                return out.join(' ');              
            },
        },
    });
}
