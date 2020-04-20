import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-beacon> component tests
 *
 * @type HXBeaconElement
 *
 */
describe('<hx-beacon> component tests', () => {
    const template = '<hx-beacon>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXBeaconElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXBeaconElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXBeaconElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test adding content and click event listener', () => {
        it('should be able to add miscellaneous Light DOM content', async () => {
            const component = /** @type {HXBeaconElement} */ await fixture(template);
            const content = 'add misc content to Light DOM';

            expect(component.textContent).to.equal('');

            component.textContent = content;

            expect(component.textContent).to.equal(content);
        });

        it('should fire a click event', async () => {
            const component = /** @type { HXBeaconElement } */ await fixture(template);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
