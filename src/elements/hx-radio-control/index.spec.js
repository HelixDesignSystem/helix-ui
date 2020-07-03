import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-radio-control> component tests
 *
 * @type HXRadioControlElement
 *
 */
describe('<hx-radio-control> component tests', () => {
    const template = '<hx-radio-control>';
    const mockup = `
            <hx-radio-control>
                <input
                    type="radio"
                    id="radBasicDemo"
                />
                <label for="radBasicDemo">
                <hx-radio></hx-radio>
                    Radio Label
                </label>
            <hx-radio-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXRadioControlElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXRadioControlElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXRadioControlElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXRadioControlElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test control element for input type is radio', async () => {
            const fragment = /** @type { HXRadioControlElement } */ await fixture(mockup);
            const id = 'radBasicDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});
