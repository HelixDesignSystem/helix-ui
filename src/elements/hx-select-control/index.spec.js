import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-select-control> component tests
 *
 * @type HXSelectControlElement
 *
 */
describe('<hx-select-control> component tests', () => {
    const template = '<hx-select-control>';
    const mockup = `
        <hx-select-control>
            <select
            id="selDemo"
            >
                <!-- ... -->
            </select>
            <hx-select></hx-select>
            <label
                for="selDemo"
            >
                Choose an Option
            </label>
        </hx-select-control>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXSelectControlElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXSelectControlElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXSelectControlElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXSelectControlElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test control element for select', async () => {
            const fragment = /** @type { HXSelectControlElement } */ await fixture(mockup);
            const id = 'selDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});
