import Util from '../../_util';

if (document.getElementById('vue-switchErrorDemo')) {
    new Vue({
        el: '#vue-switchErrorDemo',
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
                    <hx-switch-control>
                      <input
                        type="checkbox"
                        id="switchErrorTest" ${this.isInValid ? 'invalid' : '' } />
                      <label for="switchErrorTest">
                        <hx-switch
                          onlabel="on"
                          offlabel="off"
                          aria-labelledby="switchErrorTest">
                        </hx-switch>
                      </label>
                    </hx-switch-control>
                `);
            },
        },
    });
}
