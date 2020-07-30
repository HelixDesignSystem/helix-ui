import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-accordion-panel> component tests
 *
 * @type HXAccordionPanelElement
 *
 */
describe('<hx-accordion-panel> component tests', () => {
    const template = '<hx-accordion-panel>';
    const mockup = `
        <hx-accordion>
            <hx-accordion-panel open>
            <header slot="header">Cupcake Ipsum</header>
            <div class="hxBox hxMd">
                <p>
                Sweet toffee pie icing croissant halvah chupa chups. Cotton candy pie
                sesame snaps. Muffin sesame snaps cake toffee liquorice apple pie
                apple pie chupa chups. Lemon drops caramels sugar plum.
                </p>
            </div>
            </hx-accordion-panel>
        </hx-accordion>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXAccordionPanelElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXAccordionPanelElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXAccordionPanelElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });

            it('should have two <slot>s', async () => {
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(2);
            });

            it('should have an named <slot name="header">', async () => {
                const fragment = /** @type { HXAccordionPanelElement } */ await fixture(mockup);
                const slot= fragment.querySelector('header');
                const name = slot.getAttribute('slot');

                expect(name).to.equal('header');
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const name = component.slot;

                if ( name !== null ) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxToggle button', async () => {
                const elSelector = 'button#hxToggle';
                const id = 'hxToggle';
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a <hx-icon> with an angle-down type <hx-icon>', async () => {
                const elSelector = 'button#hxToggle > div > hx-icon';
                const iconType = 'angle-down';
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });

            it('markup should contain a #hxBody <div>', async () => {
                const elSelector = 'div#hxBody';
                const id = 'hxBody';
                const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('test $onConnect method', () => {
        it('should default without an aria-expanded attribute', async () => {
            const component = /** @type {HXAccordionPanelElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-expanded');

            expect(attr).to.be.false;
        });
    });

    describe('test <hx-accordion-panel> getters and setters', () => {
        it('should be able to open', async () => {
            const component = /** @type {HXAccordionPanelElement} */ await fixture(template);
            component.open = true;
            const attr = component.hasAttribute('open');

            expect(attr).to.be.true;
        });
    });

    describe('test for click event listener', () => {
        it('should fire a click event', async () => {
            const component = /** @type { HXAccordionPanelElement } */ await fixture(template);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
