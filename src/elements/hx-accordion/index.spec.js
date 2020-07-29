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

});
