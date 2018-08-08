import Util from '../../_util';

(function () {
    const TYPES = [ 
        '',
        'key',
        'mime-archive', 
        'mime-audio',
        'mime-code',
        'mime-data',
        'mime-image',
        'mime-system', 
        'mime-text',
        'mime-video',
        'paperclip',
    ];

    if (document.getElementById('vue-fileIconDemo')) {
        new Vue({
            el: '#vue-fileIconDemo',
            data: {
                ext: 'pub',
                type: TYPES[1],
                types: TYPES,
            },
            computed: {
                attrType: function () {
                    if (this.type.trim() !== '') {
                        return `type="${this.type}"`;
                    }
                    return '';
                },
                snippet: function () {
                    return Util.snippet(`
                        <hx-file-icon ${this.attrType}>
                          ${this.ext}
                        </hx-file-icon>
                    `);
                },
            },
        });
    }
})();

if (document.getElementById('vue-availableIcons')) {
    const Icons = {
        fetch: function () {
            return fetch('data/icons.json');
        },
        fetchJSON: function () {
            return this.fetch().then(res => res.json());
        },
    };//Icons

    new Vue({
        el: '#vue-availableIcons',
        data: {
            icons: [],
            filter: '',
        },
        beforeMount: function () {
            Icons.fetchJSON()
                .then(json => this.icons = json);
        },
        methods: {
            onFilterUpdate: function (evt) {
                this.filter = evt.currentTarget.value || '';
            },
            matchesName: function (icon) {
                let _name = icon.name.toLowerCase();
                return _name.indexOf(this.downcaseFilter) >= 0;
            },
            matchesAlias: function (icon) {
                if (!icon.alias) {
                    return false;
                }
                let _alias = icon.alias.toLowerCase();
                return _alias.indexOf(this.downcaseFilter) >= 0;
            },
            matchesKeyword: function (icon) {
                if (!icon.keywords) {
                    return false;
                }

                return icon.keywords.some(keyword => {
                    return keyword.indexOf(this.downcaseFilter) >= 0;
                });
            },
        },
        computed: {
            searchPlaceholder: function () {
                return `Search ${this.icons.length} icons for...`;
            },
            downcaseFilter: function () {
                return this.filter.toLowerCase();
            },
            hasFilter: function () {
                return this.filter !== '';
            },
            filterConditions: function () {
                return [
                    this.matchesName,
                    this.matchesAlias,
                    this.matchesKeyword,
                ];
            },
            filteredIcons: function () {
                let filtered = this.icons;
                if (this.hasFilter) {
                    filtered = this.icons.filter(icon => {
                        return this.filterConditions.some(fn => fn(icon));
                    });
                }
                return filtered;
            },
        },
    });
}
