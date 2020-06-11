import Util from '../../_util';

if (document.getElementById('vue-switchDemo')) {
    new Vue({
        el: '#vue-switchDemo',
        data: {
            isDisabled: false,
            option : 'ON',
            labelState: '',
        },
        computed: {
            attrDisabled: function () {
                return (this.isDisabled ? 'disabled' : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-switch-control class="switch">
                        <input type="checkbox" id="switchTest" ${this.isDisabled ? 'disabled' : ''} />
                        <label for="switchTest">
                            <hx-switch onlabel="on" offlabel="off" aria-labelledby="switchTest">
                            </hx-switch>
                        </label>
                    </hx-switch-control>
                `);
            },
        },
    });
}
