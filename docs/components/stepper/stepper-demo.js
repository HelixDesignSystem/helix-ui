if (document.getElementById('vue-stepperDemo')) {
    new Vue({
        el: '#vue-stepperDemo',
        data: {},
        methods: {
            nextStep: function () {
                this.$refs.accordion.nextPanel();
            },
            prevStep: function () {
                this.$refs.accordion.previousPanel();
            },
        },
    });
}
