import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-checkbox> component tests
 *
 * @type HXCheckboxElement
 *
 */
describe('<hx-checkbox> component tests', () => {
    const template = '<hx-checkbox>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXCheckboxElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXCheckboxElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXCheckboxElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXCheckboxElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXCheckboxElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxCheckbox <div>', async () => {
                const elSelector = 'div#hxCheckbox';
                const id = 'hxCheckbox';
                const component = /** @type { HXCheckboxElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxTick with checkmark type <hx-icon>', async () => {
                const elSelector = 'hx-icon#hxTick';
                const iconType = 'checkmark';
                const component = /** @type { HXCheckboxElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });

            it('markup should contain a #hxMinus with minus type <hx-icon>', async () => {
                const elSelector = 'hx-icon#hxMinus';
                const iconType = 'minus';
                const component = /** @type { HXCheckboxElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });
        });
    });
});
