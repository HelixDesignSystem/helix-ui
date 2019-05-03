import Util from '../../_util';

if (document.getElementById('vue-radioDemo')) {
    new Vue({
        el: '#vue-radioDemo',
        data: {
            isChecked: false,
            isDisabled: false,
            isRequired: false,
        },
        computed: {
            snippet: function () {
                return Util.snippet(`
                    <hx-radio-set>
                      <hx-radio-control>
                        <input
                          type="radio"
                          id="rad1Demo"
                          name="radioSetDemo"
                          ${this.isChecked ? 'checked' : ''}
                          ${this.isDisabled ? 'disabled' : ''}
                          ${this.isRequired ? 'required' : ''}
                        />
                        <label for="rad1Demo">
                          <hx-radio></hx-radio>
                          Option 1
                        </label>
                      </hx-radio-control>
                      <hx-radio-control>
                        <input
                          type="radio"
                          id="rad2Demo"
                          name="radioSetDemo"
                          ${this.isDisabled ? 'disabled' : ''}
                          ${this.isRequired ? 'required' : ''}
                        />
                        <label for="rad2Demo">
                          <hx-radio></hx-radio>
                          Option 2
                        </label>
                      </hx-radio-control>
                    </hx-radio-set>
                `);
            },
        },
    });
}
