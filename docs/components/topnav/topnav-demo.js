import Util from '../../_util';

if (document.getElementById('vue-topNavDemo')) {
    new Vue({
        el: '#vue-topNavDemo',
        data: {
            isDisabled: true,
            notifications: 'Notifications',
            tickets: 'Tickets',
            support: 'Support',
            billing: 'Billing',
            account: 'Account',
            user: 'User',
            currentTab: 0,
        },
        methods: {
            notify () {
                alert('Your notifications...');
            },
        },
        computed: {
            attrDisabled: function () {
                return (this.isDisabled ? 'disabled' : '');
            },
            snippet: function () {
                return Util.snippet(`
                    <nav id="hxTopNav">
                        <a class="hxTopNavLogo" href="#">
                            <img src="images/helix-logo.svg" alt="Brand Logo" />
                        </a>
                        <div class="hxTopNavMenu hxTopNavOptionMenu">
                            <hx-disclosure
                                aria-controls="topnav-product-options"
                                role="button"
                                aria-expanded="true"
                            >
                                <span>Select an option</span>
                                <hx-icon class="hxPrimary" type="angle-down"></hx-icon>
                            </hx-disclosure>
                            <hx-menu id="topnav-product-options">
                                <section>
                                    <hx-menuitem role="menuitem">Option Alpha</hx-menuitem>
                                    <hx-menuitem role="menuitem">Option Beta Services</hx-menuitem>
                                    <hx-menuitem role="menuitem">Option Gamma</hx-menuitem>
                                </section>
                            </hx-menu>
                        </div>
                        <div class="hxTopNavIconMenu">
                            <div>
                                <a href="#" @click="notify()">
                                    <hx-icon type="bell"></hx-icon>
                                    <p>Notifications</p>
                                </a>

                                <a href="#" class="selected">
                                    <hx-icon type="ticketing"></hx-icon>
                                    <p>Tickets</p>
                                </a>

                                <a href="#">
                                    <hx-icon type="support"></hx-icon>
                                    <p>Support</p>
                                </a>

                                <a href="#" class="hxDisabled" id="billing">
                                    <hx-icon type="billing"></hx-icon>
                                    <p>Billing</p>
                                    <hx-tooltip for="billing" position="bottom-center">
                                    You do not have access to this area. Contact an account admin
                                    in your organization to request access to this item.
                                    </hx-tooltip>
                                </a>
                                <a href="#">
                                    <hx-icon type="account"></hx-icon>
                                    <p>Account</p>
                                </a>
                            </div>
                            <div class="hxSpacer"></div>
                            <div class="hxTopNavMenu">
                                <hx-disclosure
                                    aria-controls="demo-user-menu"
                                    role="button"
                                    aria-expanded="true"
                                >
                                    <span>Jane User</span>
                                    <hx-icon class="hxPrimary" type="angle-down"></hx-icon>
                                </hx-disclosure>
                                <hx-menu id="demo-user-menu" position="bottom-end">
                                    <section>
                                        <header>
                                            <hx-menuitem role="menuitem" class="hxMenuKey">Account Number:</hx-menuitem>
                                            <hx-menuitem role="menuitem" class="hxMenuValue">12345678</hx-menuitem>
                                        </header>
                                        <hr class="hxDivider">
                                        <hx-menuitem role="menuitem" class="hxMenuValue">My Profile & Settings</hx-menuitem>
                                        <hr class="hxDivider">
                                        <footer>
                                            <button class="hxBtn">Log Out</button>
                                        </footer>
                                    </section>
                                </hx-menu>
                            </div>
                        </div>
                    </nav>
            `);
            },
        },
    });
}
