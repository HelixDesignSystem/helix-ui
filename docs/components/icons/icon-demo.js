if (document.getElementById('vue-iconDemo')) {
    const Icons = {
        fetchAll: function () {
            return $.ajax({
                async: false,
                dataType: 'json',
                url: 'data/icons.json',
            });
        },
    };//Icons

    new Vue({
        el: '#vue-iconDemo',
        data: {
            icons: [],
            filter: '',
        },
        beforeMount: function () {
            Icons.fetchAll().then((data) => {
                this.icons = data;
            });
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
