import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-checkbox-control> component tests
 *
 * @type HXCheckboxControlElement
 *
 */
describe('<hx-checkbox-control> component tests', () => {
    const template = '<hx-checkbox-control>';
    const mockup = `
        <hx-checkbox-control>
            <input
                type="checkbox"
                id="chkDemo"
            />
            <label for="chkDemo">
            <hx-checkbox></hx-checkbox>
                Check me out
            </label>
        </hx-checkbox-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXCheckboxControlElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXCheckboxControlElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXCheckboxControlElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXCheckboxControlElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test control element for input type is checkbox', async () => {
            const fragment = /** @type { HXCheckboxControlElement } */ await fixture(mockup);
            const id = 'chkDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});
