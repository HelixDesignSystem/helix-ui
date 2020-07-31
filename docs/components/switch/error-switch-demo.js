import Util from '../../_util';

if (document.getElementById('vue-errorSwitchDemo')) {
    new Vue({
        el: '#vue-errorSwitchDemo',
        data: {
            isInValid: false,
            labelState: '',
            option : 'ON',
        },
        computed: {
            attrInValid: function () {
                return (this.isInValid ? 'invalid' : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <hx-switch-control class="switch">
                        <input type="checkbox" id="errorChkDemo" ${this.isInValid ? 'invalid' : '' }/>
                        <label for="errorChkDemo">
                            <hx-switch onlabel="on" offlabel="off" aria-labelledby="switchTest">
                            </hx-switch>
                        </label>
                    </hx-switch-control>
                `);
            },
        },
    });
}
