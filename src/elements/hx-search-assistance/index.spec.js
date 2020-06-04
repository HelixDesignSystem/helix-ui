import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-search-assistance> component tests
 *
 * @type HXSearchAssistanceElement
 *
 */
describe('<hx-search-assistance> component tests', () => {
    const template = '<hx-search-assistance>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXSearchAssistanceElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXSearchAssistanceElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXSearchAssistanceElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXSearchAssistanceElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('verify onCreate method', () => {
        it('test for default position', async () => {
            const component = /** @type {HXSearchAssistanceElement} */ await fixture(template);
            const defaultPosition = 'bottom-start';
            const attr = component.hasAttribute('position');
            const bottomStart = component.getAttribute('position');

            expect(attr).to.be.true;
            expect(bottomStart).to.equal(defaultPosition);
        });
    });
});
