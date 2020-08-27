import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-drop-zone> component tests
 *
 * @type HXDropZoneElement
 *
 */
describe('<hx-drop-zone> component tests', () => {
    const template = '<hx-drop-zone>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test <hx-drop-zone> getters and setters', () => {
        it('should be able to drag', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const msg = 'away ';

            component.setAttribute('drag', msg);
            const dragMsg = component.drag;

            expect(dragMsg).to.be.equal(msg);
        });
    });

    describe('test for event listeners', () => {
        it('should fire a dragleave event', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const detail = { evt: 'dragleave!'};
            const customEvent = new CustomEvent('dragleave', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'dragleave');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a drop event', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const detail = { evt: 'drop'};
            const customEvent = new CustomEvent('drop', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'drop');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a dragover event', async () => {
            const component = /** @type {HXDropZoneElement} */ await fixture(template);
            const detail = { evt: 'onDrop'};
            const customEvent = new CustomEvent('onDrop', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'onDrop');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
