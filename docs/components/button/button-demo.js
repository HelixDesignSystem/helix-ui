(function () {
    const SIZES = [
        { label: 'Small', val: 'hxSm' },
        { label: 'Medium', val: '', default: true },
        { label: 'Large', val: 'hxLg' },
    ];

    const WEIGHTS = [
        { label: 'Primary', val: 'hxPrimary' },
        { label: 'Secondary', val: '', default: true },
        { label: 'Tertiary', val: 'hxTertiary' },
    ];

    if (document.getElementById('vue-basicButtonDemo')) {
        new Vue({
            el: '#vue-basicButtonDemo',
            data: {
                size: SIZES[1],
                sizes: SIZES,
                weight: WEIGHTS[1],
                weights: WEIGHTS,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxBtn' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.weight.val !== '') {
                        out.push(this.weight.val);
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-basicButtonDemo

    if (document.getElementById('vue-buttonBarDemo')) {
        new Vue({
            el: '#vue-buttonBarDemo',
            data: {
                size: SIZES[1],
                sizes: SIZES,
                weight: WEIGHTS[1],
                weights: WEIGHTS,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxButtonBar' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.weight.val !== '') {
                        out.push(this.weight.val);
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-buttonBarDemo

    if (document.getElementById('vue-deprecatedBasicButton')) {
        new Vue({
            el: '#vue-deprecatedBasicButton',
            data: {
                size: SIZES[0],
                sizes: SIZES,
                weight: WEIGHTS[2],
                deprecated: true,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxBtn' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.weight.val !== '') {
                        out.push(this.weight.val);
                    }
                    if (this.deprecated) {
                        out.push('hxDeprecated');
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-deprecatedBasicButton

    if (document.getElementById('vue-deprecatedButtonBar')) {
        new Vue({
            el: '#vue-deprecatedButtonBar',
            data: {
                size: SIZES[0],
                sizes: SIZES,
                weight: WEIGHTS[2],
                deprecated: true,
            },
            computed: {
                classes: function () {
                    let out = [ 'hxButtonBar' ];
                    if (this.size.val !== '') {
                        out.push(this.size.val);
                    }
                    if (this.weight.val !== '') {
                        out.push(this.weight.val);
                    }
                    if (this.deprecated) {
                        out.push('hxDeprecated');
                    }
                    return out.join(' ');
                },
            },
        });
    }//#vue-deprecatedButtonBar
})();
