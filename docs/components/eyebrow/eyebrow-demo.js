import Util from '../../_util';

if (document.getElementById('vue-eyebrowDemo')) {
    new Vue({
        el: '#vue-eyebrowDemo',
        data: {
            isDisabled: false,
            notifications: 'Notifications',
            Tickets: 'Tickets',
            support: 'Support',
            billing: 'billing',
            account: 'Account',
            user: 'User',
        },
        computed: {
            attrDisabled: function () {
                return (this.isDisabled ? 'disabled' : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <div class="eyebrow">
                    <a class="img-left brand-logo" href="#">
                        <img src="images/helix-logo.svg" alt="Logo" />
                    </a>
                    <div class = "right-menu">
                        <a href="#" ${this.attrDisabled}>
                            <hx-icon type="bell"></hx-icon>
                            <p>${this.notifications}</p>
                        </a>

                        <a href="#">
                            <hx-icon type="ticketing"></hx-icon>
                            <p>${this.tickets}</p>
                        </a>

                        <a href="#">
                            <hx-icon type="support"></hx-icon>
                            <p>${this.support}</p>
                        </a>

                        <a href="#">
                            <hx-icon type="billing"></hx-icon>
                            <p>${this.billing}</p>
                        </a>

                        <a href="#">
                            <hx-icon type="account"></hx-icon>
                            <p>${this.account}</p>
                        </a>

                        <hx-disclosure class="eyebrow-menu" aria-controls="eyebrowMenuId" role="button"
                            aria-expanded="true">
                            <span>${this.user}</span>
                            <hx-icon class="hxPrimary" type="angle-down" hx-defined=""></hx-icon>
                        </hx-disclosure>

                        <hx-menu id="eyebrowMenuId"  aria-hidden="false" position="bottom-start"
                            role="menu" aria-expanded="true" open="">
                            <hx-menuitem role="menuitem">Action 1</hx-menuitem>
                            <hx-menuitem role="menuitem">Action 2</hx-menuitem>
                            <hx-menuitem role="menuitem">Action 3</hx-menuitem>
                        </hx-menu>
                    </div>
                </div>
                `);
            },
        },
    });
}
