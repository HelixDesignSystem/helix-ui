import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-menu> component tests
 *
 * @type HXMenuElement
 *
 */
describe('<hx-menu> component tests', () => {
    const template = '<hx-menu>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('verify onCreate method', () => {
        it('test for default position', async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const defaultPosition = 'bottom-start';
            const attr = component.hasAttribute('position');
            const bottomStart = component.getAttribute('position');

            expect(attr).to.be.true;
            expect(bottomStart).to.equal(defaultPosition);
        });
    });

    describe('test $onConnect method', () => {
        it('should have aria-expanded attribute', async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-expanded');

            expect(attr).to.be.true;
        });

        it('should have aria-expanded attribute default to false', async () => {
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const attr = component.getAttribute('aria-expanded');

            expect(attr).to.be.equal(String(false));
        });

        it('should have role attribute default to menu', async () => {
            const roleAttr = 'menu';
            const component = /** @type {HXMenuElement} */ await fixture(template);
            const attr = component.hasAttribute('role');
            const role = component.getAttribute('role');

            expect(attr).to.be.true;
            expect(role).to.equal(roleAttr);
        });
    });
});
