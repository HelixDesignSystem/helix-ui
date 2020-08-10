import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-text-control> component tests
 *
 * @type HXTextControlElement
 *
 */
describe('<hx-text-control> component tests', () => {
    const template = '<hx-text-control>';
    const mockup = `
            <hx-text-control>
                <input
                    id="txtDemo"
                    type="text"
                />
                <label
                    for="txtDemo">
                    Username
                </label>
            <hx-text-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXTextControlElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXTextControlElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXTextControlElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXTextControlElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test control element for input type is text', async () => {
            const fragment = /** @type { HXTextControlElement } */ await fixture(mockup);
            const id = 'txtDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});
