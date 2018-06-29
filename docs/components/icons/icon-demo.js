if (document.getElementById('vue-iconDemo')) {
    const Icons = {
        fetch: function () {
            return fetch('data/icons.json');
        },
        fetchJSON: function () {
            return this.fetch().then(res => res.json());
        },
    };//Icons

    new Vue({
        el: '#vue-iconDemo',
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
