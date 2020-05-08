import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-busy> component tests
 *
 * @type HXBusyElement
 *
 */
describe('<hx-busy> component tests', () => {
    const template = '<hx-busy>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test $onConnect method', () => {
        it('should not be paused on connect', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const prop = component.hasAttribute('paused');

            expect(prop).to.be.false;
        });

        it('should have aria-hidden attribute', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-hidden');

            expect(attr).to.be.true;
        });

        it('should have aria-hidden attribute set to true', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const attr = component.getAttribute('aria-hidden');

            expect(attr).to.be.equal(String(true));
        });
    });

    describe('test <hx-busy> getter and setter methods', () => {
        it('should be able to pause element', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            component.paused = true;
            const attr = component.hasAttribute('paused');

            expect(attr).to.be.true;
        });

        it('should be able to pause and unpause element', async () => {
            const component = /** @type {HXBusyElement} */ await fixture(template);
            component.paused = true;
            let attr = component.hasAttribute('paused');

            expect(attr).to.be.true;

            component.paused = false;
            attr = component.hasAttribute('paused');

            expect(attr).to.be.false;
        });
    });

});
