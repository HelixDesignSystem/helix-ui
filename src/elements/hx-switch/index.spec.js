import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-switch> component tests
 *
 * @type HXSwitchElement
 *
 */
describe('<hx-switch> component tests', () => {
    const template = '<hx-switch>';
    const mockup = `<hx-switch onlabel="on" offlabel="off" aria-labelledby="switchTest"></hx-switch>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXSwitchElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXSwitchElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXSwitchElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test <hx-switch> getter and setter methods', () => {
        it('should have onLabel attribute', async () => {
            const fragment = /** @type {HXSwitchElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('onLabel');

            expect(attr).to.be.true;
        });

        it('should have offLabel attribute', async () => {
            const fragment = /** @type {HXSwitchElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('offLabel');

            expect(attr).to.be.true;
        });
    });

    describe('test for Sync Labels', () => {
        it('to test sync label for switch', async () => {
            const fragment = /** @type { HXSwitchElement } */ await fixture(mockup);
            fragment.setAttribute('offlabel', 'NO');
            const expectedOnLabel = "YES";
            const getOnLabel = fragment.onlabel;

            expect(getOnLabel).to.equal(expectedOnLabel);
        });
    });
});
