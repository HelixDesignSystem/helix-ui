import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-reveal> component tests
 *
 * @type HXRevealElement
 *
 */
describe('<hx-reveal> component tests', () => {
    const template = '<hx-reveal>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test $onConnect method', () => {
        it('should have aria-expanded attribute', async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-expanded');

            expect(attr).to.be.true;
        });
    });

    describe('test <hx-reveal> getter and setter methods', () => {
        it('should be able to open', async () => {
            const component = /** @type {HXRevealElement} */ await fixture(template);
            component.open = true;
            const attr = component.hasAttribute('open');

            expect(attr).to.be.true;
        });
    });

});
