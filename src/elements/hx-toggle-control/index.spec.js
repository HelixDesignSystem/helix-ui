import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-toggle-control> component tests
 *
 * @type HXToggleControlElement
 *
 */
describe('<hx-toggle-control> component tests', () => {
    const template = '<hx-toggle-control>';
    const mockup = `<hx-toggle-control>
                        <input type="checkbox" id="toggleDemo" />
                        <label for="toggleDemo">
                            <hx-toggle aria-labelledby="toggleDemo">
                            </hx-toggle>
                        </label>
                    </hx-toggle-control>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const fragment = /** @type {HXToggleControlElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const fragment = /** @type {HXToggleControlElement} */ await fixture(mockup);
            const prop = fragment.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const fragment = /** @type {HXToggleControlElement} */ await fixture(mockup);

            expect(fragment).lightDom.to.not.equal(mockup);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const fragment = /** @type {HXToggleControlElement} */ await fixture(mockup);
            const shadow = fragment.shadowRoot;

            expect(shadow).to.be.null;
        });

    });
    describe('test for click event listener', () => {
        it('should fire a click event', async () => {
            const fragment = /** @type { HXToggleControlElement } */ await fixture(mockup);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });

    describe('test <hx-toggle-control> getters', () => {
        it('should get the control element', async () => {
            const fragment = /** @type { HXToggleControlElement } */ await fixture(mockup);
            const id = 'toggleDemo';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;
    
            expect(ctrlElementID).to.equal(id);
        });
    
        it('should get the <hx-toggle> element', async () => {
            const template = '<hx-toggle>';
            const fragment = /** @type { HXToggleControlElement } */ await fixture(mockup);
            const toggle = /** @type { HXToggleElement } */ await fixture(template);
            const toggleEl = fragment.toggleElement;
    
            expect(toggleEl.tagName).to.equal(toggle.tagName);
        });
    
        it('should get the <hx-toggle> toggled state', async () => {
            const fragment = /** @type { HXToggleControlElement } */ await fixture(mockup);
            const toggleElState = fragment.toggleElement.toggled;
    
            expect(toggleElState).to.be.false;
        });
    });
});
