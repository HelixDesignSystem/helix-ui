import { fixture, expect } from '@open-wc/testing';

import HelixUI from '../../../dist/js/helix-ui.module.js';

/**
 * <hx-alert> component tests
 *
 * @type HXAlertElement
 *
 */
describe('<hx-alert> tests', () => {

    const template = '<hx-alert>';

    it('should initialize HelixUI', async () => {
        await HelixUI.initialize(); // get hook

        expect(HelixUI.Elements).to.not.be.undefined;
    });

    it('render the Shadow Root mode open', async () => {
        const el = /** @type { HXAlertElement } */ await fixture(template);
        const mode = el.shadowRoot.mode;

        expect(mode).to.equal("open");
    });

    it('should be instantiated with hx-defined attribute', async () => {
        const el = /** @type { HXAlertElement } */ await fixture(template);

        expect(el).to.have.attribute('hx-defined');
    });

    it(`rendered Light DOM should NOT equal simple template ${template}`, async () => {
        const el = /** @type { HXAlertElement } */ await fixture(template);

        expect(el).lightDom.to.not.equal(template);
    });

    it('should have a static Shadow DOM', async function () {
        const el = /** @type { HXAlertElement } */ await fixture(template);
        const sd = el.shadowRoot.innerHTML; // FIXME: temp fix issue submitted https://github.com/open-wc/open-wc/issues/1540

        expect(el).shadowDom.to.equal(sd);
    });
});
