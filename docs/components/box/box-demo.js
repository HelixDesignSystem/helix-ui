import Util from '../../_util';
import _ from 'lodash';

(function () {
    let SPACINGS = [
        { value: '', label: 'Default' },
        { value: 'hxFlush', label: 'Flush' },
        { value: 'hxXs', label: 'Extra Small (XS)' },
        { value: 'hxSm', label: 'Small (SM)' },
        { value: 'hxMd', label: 'Medium (MD)' },
        { value: 'hxLg', label: 'Large (LG)' },
        { value: 'hxXl', label: 'Extra Large (XL)' },
        { value: 'hx2x', label: 'Extra Extra Large (2X)' },
    ];

    if (document.getElementById('vue-boxDemo')) {
        new Vue({
            el: '#vue-boxDemo',
            data: {
                spacing: SPACINGS[0],
                spacings: SPACINGS,
            },
            computed: {
                attrClass: function () {
                    if (this.spacing.value !== '') {
                        return `class="${this.spacing.value}"`;
                    } else {
                        return '';
                    }
                },
                snippet: function () {
                    return Util.snippet(`
                        <hx-div ${this.attrClass}></hx-div>
                    `);
                },
            },
        });
    }

    let SCROLL_DIRECTIONS = [
        'vertical',
        'horizontal',
        'both',
    ];

    if (document.getElementById('vue-scrollBoxDemo')) {
        new Vue({
            el: '#vue-scrollBoxDemo',
            data: {
                direction: SCROLL_DIRECTIONS[0],
                directions: SCROLL_DIRECTIONS,
                isListening: false,
            },
            methods: {
                onScroll: _.debounce(function (evt) {
                    let d = new Date();
                    /* eslint-disable no-console */
                    console.log(`Scrolled at ${d.toLocaleTimeString()}`);
                    console.log(evt);
                    /* eslint-enable no-console */
                }, 500),
            },
            watch: {
                isListening: function (val) {
                    if (val) {
                        document.addEventListener('scroll', this.onScroll);
                    } else {
                        document.removeEventListener('scroll', this.onScroll);
                    }
                },
            },
        });
    }
})();
