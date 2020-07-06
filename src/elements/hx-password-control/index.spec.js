import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-password-control> component tests
 *
 * @type HXPasswordElement
 *
 */
describe('<hx-password-control> component tests', () => {
    const template = '<hx-password-control>';
    const mockup = `
        <hx-password-control>
            <input
                id="pwdDemo"
                type="password"
            />
            <label
                for="pwdDemo">
                Password
            </label>
            <p class="hxHelpText" hidden>
                At least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
            </p>
            <p class="hxErrorText" hidden>
                <hx-error>
                    Please enter a valid password
                </hx-error>
            </p>
        </hx-password-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXPasswordElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXPasswordElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXPasswordElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXPasswordElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test Control Element', () => {
        it('to test input[type="password"]', async () => {
            const fragment = /** @type { HXPasswordElement } */ await fixture(mockup);
            const id = 'pwdDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });
});
