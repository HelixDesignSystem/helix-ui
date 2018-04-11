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
        },
        computed: {
            hasFilter: function () {
                return this.filter !== '';
            },
            filteredIcons: function () {
                let filtered = this.icons;
                if (this.hasFilter) {
                    filtered = this.icons.filter((icon) => {
                        return icon.name.indexOf(this.filter) >= 0;
                    });
                }
                return filtered;
            },
        },
    });
}
