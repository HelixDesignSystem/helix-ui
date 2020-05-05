import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-error> component tests
 *
 * @type HXErrorElement
 *
 */
describe('<hx-error> tests', () => {

    const template = '<hx-error>';

    it('render the Shadow Root mode open', async () => {
        const el = /** @type { HXErrorElement } */ await fixture(template);
        const mode = el.shadowRoot.mode;

        expect(mode).to.equal("open");
    });

    it('should be instantiated with hx-defined attribute', async () => {
        const el = /** @type { HXErrorElement } */ await fixture(template);

        expect(el).to.have.attribute('hx-defined');
    });

    it(`rendered Light DOM should NOT equal simple template ${template}`, async () => {
        const el = /** @type { HXErrorElement } */ await fixture(template);

        expect(el).lightDom.to.not.equal(template);
    });

    it('should have a static Shadow DOM', async function () {
        const el = /** @type { HXErrorElement } */ await fixture(template);
        const sd = el.shadowRoot.innerHTML; 

        expect(el).shadowDom.to.equal(sd);
    });
});
