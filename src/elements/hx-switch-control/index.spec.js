import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-switch-control> component tests
 *
 * @type HXSwitchControlElement
 *
 */
describe('<hx-switch-control> component tests', () => {
    const template = '<hx-switch-control>';
    const mockup = `<hx-switch-control>
                        <input type="checkbox" id="switchOnOffTest" />
                        <label for="switchOnOffTest">
                            <hx-switch
                                onlabel="on"
                                offlabel="off"
                                aria-labelledby="switchOnOffTest">
                            </hx-switch>
                        </label>
                    </hx-switch-control>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const fragment = /** @type {HXSwitchControlElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const fragment = /** @type {HXSwitchControlElement} */ await fixture(mockup);
            const prop = fragment.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const fragment = /** @type {HXSwitchControlElement} */ await fixture(mockup);

            expect(fragment).lightDom.to.not.equal(mockup);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const fragment = /** @type {HXSwitchControlElement} */ await fixture(mockup);
            const shadow = fragment.shadowRoot;

            expect(shadow).to.be.null;
        });

    });
    describe('test for click event listener', () => {
        it('should fire a click event', async () => {
            const fragment = /** @type { HXSwitchControlElement } */ await fixture(mockup);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });

    describe('test <hx-switch-control> getters', () => {
        it('should get the control element"]', async () => {
            const fragment = /** @type { HXSwitchControlElement } */ await fixture(mockup);
            const id = 'switchOnOffTest';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });

        it('should get the <hx-switch> element', async () => {
            const template = '<hx-switch>';
            const fragment = /** @type { HXSwitchControlElement } */ await fixture(mockup);
            const switchFra = /** @type { HXSwitchElement } */ await fixture(template);
            const switchEl = fragment.switchElement;

            expect(switchEl.tagName).to.equal(switchFra.tagName);
        });

        it('should get the <hx-switch> toggled state', async () => {
            const fragment = /** @type { HXSwitchControlElement } */ await fixture(mockup);
            const switchElementState = fragment.switchElement.toggled;

            expect(switchElementState).to.be.false;
        });
    });
});
