import { fixture, expect, oneEvent } from '@open-wc/testing';

/**
 * <hx-accordion> component tests
 *
 * @type HXAccordionElement
 *
 */
describe('<hx-accordion> component tests', () => {
    const template = '<hx-accordion>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test $onConnect method', () => {
        it('on connect we should not have current pannel attribute', async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const prop = component.hasAttribute('currentPanel');
            expect(prop).to.be.false;
        });
    });

    describe('test <hx-accordion> getter and setter methods', () => {
        it('should be able to set and get current pannel', async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const setCurrentPannel = 1;
            component.setAttribute('current-panel',setCurrentPannel);
            const getCurrentPannel = component.currentPanel;

            expect(getCurrentPannel).to.equal(setCurrentPannel);
        });
    });

    describe('test event listeners', () => {
        it('should be able to open', async () => {
            const component = /** @type {HXAccordionElement} */ await fixture(template);
            const detail = { evt: 'open!'};
            const customEvent = new CustomEvent('open', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'open');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });

    /**
     * Stepper Component Tests
     *
     * CSS-based derivative of Accordion Component.
     *
     * @type HXAccordionElement
     */
    describe('Stepper Component tests', () => {
        const mockup =`
            <hx-accordion class="hxStepper" current-panel="0">
                <hx-accordion-panel>
                    <header slot="header">
                        <span class="hxStepCounter"></span>
                        <span class="hxStepLabel">Account</span>
                        <span class="hxStepValue">Acme Corp Inc.</span>
                    </header>
                    <div class="hxBox hxMd">
                        <p>
                            <em>Content Goes Here</em>
                        </p>
                        <p class="hxStepButton">
                            <button class="hxBtn hxPrimary">Next Step</button>
                            <button class="hxBtn">Prev Step</button>
                            <button class="hxBtn hxLink">Cancel</button>
                        </p>
                    </div>
                </hx-accordion-panel>
                <hx-accordion-panel>...</hx-accordion-panel>
                <hx-accordion-panel>...</hx-accordion-panel>
            </hx-accordion>`;

        describe('instantiate element', () => {
            it('should be instantiated with hx-defined attribute', async () => {
                const fragment = /** @type {HXAccordionElement} */ await fixture(mockup);
                const attr = fragment.hasAttribute('hx-defined');

                expect(attr).to.be.true;
            });

            it('should not be hidden', async () => {
                const fragment = /** @type {HXAccordionElement} */ await fixture(mockup);
                const prop = fragment.hidden;

                expect(prop).to.be.false;
            });

            it('should contain hxStepper class', async () => {
                const className = 'hxStepper';
                const fragment = /** @type {HXAccordionElement} */ await fixture(mockup);
                const queryClass = fragment.className;

                expect(queryClass).to.equal(className);
            });
        });
    });
});
