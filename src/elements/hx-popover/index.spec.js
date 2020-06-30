import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-popover> component tests
 *
 * @type HXPopoverElement
 *
 */
describe('<hx-popover> component tests', () => {
    const template = '<hx-popover>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXPopoverElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXPopoverElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });

            it('should have a single <slot>', async () => {
                const component = /** @type { HXPopoverElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXPopoverElement } */ await fixture(template);
                const name = component.slot;

                if (name !== null) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });

    });

    describe('verify onCreate method', () => {
        it('test for default position', async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);
            const defaultPosition = 'bottom-right';
            const attr = component.hasAttribute('position');
            const bottomStart = component.getAttribute('position');

            expect(attr).to.be.true;
            expect(bottomStart).to.equal(defaultPosition);
        });
        it('test for position offset', async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);
            const positionOffset = 20;
            const offsetValue = component.POSITION_OFFSET;

            expect(offsetValue).to.equal(positionOffset);
        });
        it('test for checking all positions', async () => {
            const component = /** @type {HXPopoverElement} */ await fixture(template);
            const position = component.getAttribute('position');
            const changePosition = "right-middle";
            component.setShadowPosition(changePosition);
            const newPosition = component.shadowRoot.querySelector('div').getAttribute('position')
             
            expect(newPosition).to.not.equal(position);
            expect(newPosition).to.equal(changePosition);
        });
    });
});
