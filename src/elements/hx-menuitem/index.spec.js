import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-menuitem> component tests
 *
 * @type HXMenuitemElement
 *
 */
describe('<hx-menuitem> component tests', () => {
    const template = '<hx-menuitem>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test $onConnect method', () => {
        it('should have role attribute', async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);
            const attr = component.hasAttribute('role');

            expect(attr).to.be.true;
        });

        it('should have role attribute default to menuitem ', async () => {
            const component = /** @type {HXMenuitemElement} */ await fixture(template);
            const variable = 'menuitem';
            const attr = component.getAttribute('role');

            expect(attr).to.be.equal(variable);
        });
    });

});
