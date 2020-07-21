import { fixture, expect} from '@open-wc/testing';

/**
 * <hx-email-control> component tests
 *
 * @type HXEmailControl
 *
 */
describe('<hx-email-control> component tests', () => {
    const template = '<hx-email-control>';
    const mockup = `
            <hx-email-control>
                <input
                    id="emailInputDemo"
                    type="email"
                />
                <label
                    for="emailInputDemo">
                    Email
                </label>
                <p class="hxHelpText" hidden>
                    abc@abc.com
                </p>
                <p class="hxErrorText" hidden>
                    <hx-error>
                    Please enter a valid email
                    </hx-error>
                </p>
            </hx-email-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXEmailControl} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXEmailControl} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXEmailControl} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXEmailControl} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test for control element', () => {
        it('test for control element for input type email', async ()=> {
            const fragment = /** @type {HXEmailControl} */ await fixture(mockup);
            const id = 'emailInputDemo';
            const ctrl = fragment.controlElement;
            const ctrlID = ctrl.id;

            expect(ctrlID).to.equal(id);
        });
    });
});
