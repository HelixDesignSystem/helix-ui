import Util from '../../_util';

if (document.getElementById('vue-fileTileDemo')) {
    new Vue({
        el: '#vue-fileTileDemo',
        data: {
            content: '1.3mb',
            state: 'default',
            icon: 'mime-archive',
            name: 'unicorns.gzip',
            href: 'path/to/unicorns.gzip',
            progressValue: 42,
        },
        computed: {
            isDefault: function () { 
                return this.state === 'default'; 
            },
            isLoading: function () { 
                return this.state === 'loading'; 
            },
            isInvalid: function () { 
                return this.state === 'invalid' ;
            },
            attrIcon: function () {
                if (this.icon !== '') {
                    return `icon="${this.icon}"`;
                } else {
                    return '';
                }
            },
            attrName: function () {
                if (this.status !== '') {
                    return `name="${this.name}"`;
                } else {
                    return '';
                }
            },
            attrHREF: function () {
                if (this.cta !== '') {
                    return `href="${this.href}"`;
                } else {
                    return '';
                }
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-file-tile
                        ${this.attrHREF}
                        ${this.attrName}
                        ${this.attrIcon}
                    >
                        ${this.content}
                    </hx-file-tile>
                `);
            },
        },
    });
}
