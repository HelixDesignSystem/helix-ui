import Util from '../../_util';

(function () {
    if (document.getElementById('vue-switchNoneDemo')) {
        new Vue({
            el: '#vue-switchNoneDemo',
            computed: {
                attrDisabled: function () {
                    return (this.isDisabled ? 'disabled' : '');
                },
                snippet :function (){
                    return Util.snippet(`
                        <hx-switch-control>
                          <input type="checkbox" id="switchNoneTest" />
                          <label for="switchNoneTest">
                            <hx-switch aria-labelledby="switchNoneTest"></hx-switch>
                          </label>
                        </hx-switch-control>
                    `);
                },
            },
        });
    }
    if (document.getElementById('vue-switchOnOffDemo')) {
        new Vue({
            el: '#vue-switchOnOffDemo',
            computed: {
                attrDisabled: function () {
                    return (this.isDisabled ? 'disabled' : '');
                },
                snippet :function (){
                    return Util.snippet(`
                        <hx-switch-control>
                          <input type="checkbox" id="switchOnOffTest" />
                          <label for="switchOnOffTest">
                            <hx-switch
                              onlabel="on"
                              offlabel="off"
                              aria-labelledby="switchOnOffTest">
                            </hx-switch>
                          </label>
                        </hx-switch-control>
                    `);
                },
            },
        });
    }
    if (document.getElementById('vue-switchYesNoDemo')) {
        new Vue({
            el: '#vue-switchYesNoDemo',
            computed: {
                attrDisabled: function () {
                    return (this.isDisabled ? 'disabled' : '');
                },
                snippet :function (){
                    return Util.snippet(`
                        <hx-switch-control>
                          <input type="checkbox" id="switchYesNoTest" />
                          <label for="switchYesNoTest">
                            <hx-switch
                              onlabel="yes"
                              offlabel="no"
                              aria-labelledby="switchYesNoTest">
                            </hx-switch>
                          </label>
                        </hx-switch-control>
                    `);
                },
            },
        });
    }
    if (document.getElementById('vue-switchDisabledDemo')) {
        new Vue({
            el: '#vue-switchDisabledDemo',
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
                        <hx-switch-control>
                          <input
                            type="checkbox"
                            id="switchDisabledTest" ${this.isDisabled ? 'disabled' : ''} />
                          <label for="switchDisabledTest">
                            <hx-switch
                              onlabel="on"
                              offlabel="off"
                              aria-labelledby="switchDisabledTest">
                            </hx-switch>
                          </label>
                        </hx-switch-control>
                    `);
                },
            },
        });
    }
})();
