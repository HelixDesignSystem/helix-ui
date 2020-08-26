import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-drawer> component tests
 *
 * @type HXDrawerElement
 *
 */
describe('<hx-drawer> component tests', () => {
    const template = '<hx-drawer>';
    const mockup = `
        <hx-drawer
            id="drawer-with-slotted-positionable-element">
            <header></header>

            <hx-div class="hxMd">
                ...
            </hx-div>
            <hx-tooltip slot="fixed" for="info1" position="left-middle">
                <header>Tooltip #1</header>
                <p>
                    <code>hx-drawer &gt; hx-tooltip[slot="fixed"]</code>
                </p>
            </hx-tooltip>
        </hx-drawer>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });

            it('should have two <slot>s', async () => {
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(2);
            });

            it('should have an named <slot name="fixed">', async () => {
                const fragment = /** @type { HXDrawerElement } */ await fixture(mockup);
                const slot= fragment.querySelector('hx-tooltip');
                const name = slot.getAttribute('slot');

                expect(name).to.equal('fixed');
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const name = component.slot;

                if ( name !== null ) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxDrawer div', async () => {
                const elSelector = 'div#hxDrawer';
                const id = 'hxDrawer';
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxClose button', async () => {
                const elSelector = 'button#hxClose';
                const id = 'hxClose';
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxClose button with a times type <hx-icon>', async () => {
                const elSelector = 'button#hxClose > hx-icon';
                const iconType = 'times';
                const component = /** @type { HXDrawerElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });
        });
    });

    describe('test $onConnect method', () => {
        it('should have aria-expanded attribute', async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-expanded');

            expect(attr).to.be.true;
        });
    });

    describe('test <hx-drawer> getters and setters', () => {
        it('should be able to open', async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);
            component.open = true;
            const attr = component.hasAttribute('open');

            expect(attr).to.be.true;
        });
    });

    describe('test for click event listener', () => {
        it('should fire a click event', async () => {
            const component = /** @type { HXDrawerElement } */ await fixture(template);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should be able to scroll', async () => {
            const component = /** @type {HXDrawerElement} */ await fixture(template);
            const detail = { evt: 'scroll'};
            const customEvent = new CustomEvent('scroll', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'scroll');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
