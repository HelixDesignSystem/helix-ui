window.addEventListener('WebComponentsReady', function () {
    const tagName = 'hx-icon';
    const template = document.createElement('template');
    const icons = {
        'account': require('./_images/account.svg'),
        'angle-down': require('./_images/angle-down.svg'),
        'angle-left': require('./_images/angle-left.svg'),
        'angle-right': require('./_images/angle-right.svg'),
        'angle-up': require('./_images/angle-up.svg'),
        'bell': require('./_images/bell.svg'),
        'billing': require('./_images/billing.svg'),
        'calendar': require('./_images/calendar.svg'),
        'checkmark': require('./_images/checkmark.svg'),
        'checkmark-circle': require('./_images/checkmark-circle.svg'),
        'cog': require('./_images/cog.svg'),
        'copy': require('./_images/copy.svg'),
        'download': require('./_images/download.svg'),
        'envelope': require('./_images/envelope.svg'),
        'exclamation-circle': require('./_images/exclamation-circle.svg'),
        'exclamation-triangle': require('./_images/exclamation-triangle.svg'),
        'export': require('./_images/export.svg'),
        'external-link': require('./_images/external-link.svg'),
        'filter': require('./_images/filter.svg'),
        'help-circle': require('./_images/help-circle.svg'),
        'info-circle': require('./_images/info-circle.svg'),
        'input-file': require('./_images/input-file.svg'),
        'input-time': require('./_images/input-time.svg'),
        'input-url': require('./_images/input-url.svg'),
        'kbd-arrow-down': require('./_images/kbd-arrow-down.svg'),
        'kbd-arrow-left': require('./_images/kbd-arrow-left.svg'),
        'kbd-arrow-right': require('./_images/kbd-arrow-right.svg'),
        'kbd-arrow-up': require('./_images/kbd-arrow-up.svg'),
        'kbd-capslock': require('./_images/kbd-capslock.svg'),
        'kbd-command': require('./_images/kbd-command.svg'),
        'kbd-delete': require('./_images/kbd-delete.svg'),
        'kbd-eject': require('./_images/kbd-eject.svg'),
        'kbd-option': require('./_images/kbd-option.svg'),
        'kbd-return': require('./_images/kbd-return.svg'),
        'kbd-shift': require('./_images/kbd-shift.svg'),
        'kbd-space': require('./_images/kbd-space.svg'),
        'kbd-tab': require('./_images/kbd-tab.svg'),
        'lock': require('./_images/lock.svg'),
        'minus': require('./_images/minus.svg'),
        'minus-circle': require('./_images/minus-circle.svg'),
        'monitoring': require('./_images/monitoring.svg'),
        'pencil': require('./_images/pencil.svg'),
        'phone': require('./_images/phone.svg'),
        'plus': require('./_images/plus.svg'),
        'plus-or-minus': require('./_images/plus-or-minus.svg'),
        'search': require('./_images/search.svg'),
        'server': require('./_images/server.svg'),
        'sort': require('./_images/sort.svg'),
        'sort-down': require('./_images/sort-down.svg'),
        'sort-up': require('./_images/sort-up.svg'),
        'support': require('./_images/support.svg'),
        'tag': require('./_images/tag.svg'),
        'ticketing': require('./_images/ticketing.svg'),
        'times': require('./_images/times.svg'),
        'times-circle': require('./_images/times-circle.svg'),
        'trash': require('./_images/trash.svg'),
        'user': require('./_images/user.svg'),
    };

    template.innerHTML = `
        <style>${require('./HxIcon.less')}</style>
        <slot></slot>
    `;

    class HxIcon extends HTMLElement {
        static get is () {
            return tagName;
        }

        static get observedAttributes () {
            return ['type'];
        }

        static get icons () {
            return icons;
        }

        constructor (type) {
            super();
            this.attachShadow({ mode: 'open' });
            if (window.ShadyCSS) {
                ShadyCSS.prepareTemplate(template, tagName);
                ShadyCSS.styleElement(this);
            }
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (type) {
                this.setAttribute('type', type);
            }
        }

        connectedCallback () {
            this._render();
        }

        attributeChangedCallback (attr) {
            if (attr === 'type') {
                this._render();
            }
        }

        _render () {
            const type = this.getAttribute('type');

            // erase previously injected markup
            this.innerHTML = '';

            if (type in HxIcon.icons) {
                // create surrogate DIV to add raw SVG markup
                const tmpDiv = document.createElement('div');
                tmpDiv.innerHTML = HxIcon.icons[type];
                // grab SVG from surrogate DIV
                const svg = tmpDiv.firstElementChild;

                // inject SVG into Light DOM
                this.appendChild(svg);
            }
        }//_render()
    }//HxIcon

    customElements.define(HxIcon.is, HxIcon);
});
