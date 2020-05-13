import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-progress> component tests
 *
 * @type HXProgressElement
 *
 */
describe('<hx-progress> component tests', () => {
    const template = '<hx-progress>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test $onConnect method', () => {
        
        it('should have aria-valuemin attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemin');

            expect(attr).to.be.true;
        });

        it('should have aria-valuemax attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemax');

            expect(attr).to.be.true;
        });
    });

    describe('test <hx-progress> getter and setter methods', () => {
        it('should be able to pause element', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            component.paused = true;
            const attr = component.hasAttribute('value');

            expect(attr).to.be.true;
        });
    });

});