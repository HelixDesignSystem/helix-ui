import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-div> component tests
 *
 * @type HXDivElement
 *
 */
describe('<hx-div> component tests', () => {
    const template = '<hx-div>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXDivElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXDivElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXDivElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXDivElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXDivElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal("open");
            });

            it('should have a single <slot>', async () => {
                const component = /** @type { HXDivElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXDivElement } */ await fixture(template);
                const name = component.slot;

                if (name !== null) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });
    });

    describe('test <hx-div> getter and setter methods', () => {
        it('should be able to scroll in the vertical direction', async () => {
            const component = /** @type {HXDivElement} */ await fixture(template);
            component.scroll = 'vertical';
            const attr = component.hasAttribute('scroll');
            const scrollDirection = component.getAttribute('scroll');

            expect(attr).to.be.true;
            expect(scrollDirection).to.be.equal(component.scroll);
        });
    });
});