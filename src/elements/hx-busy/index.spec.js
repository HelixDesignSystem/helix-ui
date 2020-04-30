import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-busy> component tests
 *
 * @type HXBusyElement
 *
 */
describe('<hx-busy> tests', () => {
    const template = '<hx-busy>';

    it('should be instantiated with hx-defined attribute', async () => {
        const el = /** @type {HXBusyElement} */ await fixture(template);

        expect(el.getAttribute('hx-defined')).to.exist;
    });

    it('should have aria-hidden attribute set to true', async () => {
        const el = /** @type {HXBusyElement} */ await fixture(template);

        expect(el.getAttribute('aria-hidden')).to.be.equal(String(true));
    });

    it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
        const el = /** @type {HXBusyElement} */ await fixture(template);

        expect(el).lightDom.to.not.equal(template);
    });

    it(`should NOT have a Shadow DOM`, async () => {
        const el = /** @type {HXBusyElement} */ await fixture(template);
        const sd = el.shadowRoot;

        expect(sd).to.be.null;
    });
});
