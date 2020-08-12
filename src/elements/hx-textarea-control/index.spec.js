import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-textarea-control> component tests
 *
 * @type HXTextareaControlElement
 *
 */
describe('<hx-textarea-control> component tests', () => {
    const template = '<hx-textarea-control>';
    const mockup = `
            <hx-textarea-control>
                <textarea id="txtAreaDemo"></textarea>
                <label
                    for="txtAreaDemo">
                    Comments
                </label>
            <hx-textarea-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXTextareaControlElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXTextareaControlElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXTextareaControlElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXTextareaControlElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test control element textarea', async () => {
            const fragment = /** @type { HXTextareaControlElement } */ await fixture(mockup);
            const id = 'txtAreaDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});