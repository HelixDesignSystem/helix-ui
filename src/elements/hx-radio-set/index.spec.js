import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-radio-set> component tests
 *
 * @type HXRadioSetElement
 *
 */
describe('<hx-radio-set> component tests', () => {
    const template = '<hx-radio-set>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test <hx-radio-set> getters and setters', () => {
        it(`should be able to get ${template} isDirty state`, async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const attr = component.isDirty;

            expect(attr).to.be.false;
        });

        it(`should be able to get ${template} wasChanged state`, async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const attr = component.wasChanged;

            expect(attr).to.be.false;
        });

        it(`should be able to get ${template} wasTouched state`, async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const attr = component.wasTouched;

            expect(attr).to.be.false;
        });
    });

    describe('test for event listeners', () => {
        it('should fire a change event', async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const detail = { evt: 'hxchange!'};
            const customEvent = new CustomEvent('hxchange', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'hxchange');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a dirty event', async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const detail = { evt: 'hxdirty'};
            const customEvent = new CustomEvent('hxdirty', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'hxdirty');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a touch event', async () => {
            const component = /** @type {HXRadioSetElement} */ await fixture(template);
            const detail = { evt: 'hxtouch'};
            const customEvent = new CustomEvent('hxtouch', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'hxtouch');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
