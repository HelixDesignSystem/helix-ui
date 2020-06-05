import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-disclosure> component tests
 *
 * @type HXDisclosureElement
 *
 */
describe('<hx-disclosure> component tests', () => {
    const template = '<hx-disclosure>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const shadow = component.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test $onConnect method', () => {
        it('should have aria-expanded attribute', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-expanded');

            expect(attr).to.be.true;
        });

        it('should have aria-expanded attribute default to false', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.getAttribute('aria-expanded');

            expect(attr).to.be.equal(String(false));
        });

        it('should default to null target', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const targetProp = component.target;

            expect(targetProp).to.be.null;
        });

        it('should have role attribute default to button', async () => {
            const roleAttr = 'button';
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.hasAttribute('role');
            const role = component.getAttribute('role');

            expect(attr).to.be.true;
            expect(role).to.equal(roleAttr);
        });

        it('should have tabindex attribute', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.hasAttribute('tabindex');

            expect(attr).to.be.true;
        });

        it('should have tabindex attribute default to 0', async () => {
            const tabDefault = "0";
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const attr = component.hasAttribute('tabindex');
            const attrValue = component.getAttribute('tabindex');

            expect(attr).to.be.true;
            expect(attrValue).to.be.equal(tabDefault);
        });
    });

    describe('test <hx-disclosure> getter and setter methods', () => {
        it('should have a default null target', async () => {
            const component = /** @type {HXDisclosureElement} */ await fixture(template);
            const target = component.target;

            expect(target).to.be.null;
        });
    });

    describe('test adding event listeners', () => {
        describe('test click event listeners', () => {
            it('should fire a click event', async () => {
                const component = /** @type {HXDisclosureElement} */ await fixture(template);
                const detail = { evt: 'clicked!'};
                const customEvent = new CustomEvent('click', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'click');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });

            it('should add a keydown event listener', async () => {
                const component = /** @type {HXDisclosureElement} */ await fixture(template);
                const detail = { evt: 'key down!'};
                const customEvent = new CustomEvent('keydown', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'keydown');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });

            it('should add a keyup event listener', async () => {
                const component = /** @type {HXDisclosureElement} */ await fixture(template);
                const detail = { evt: 'key up!'};
                const customEvent = new CustomEvent('keyup', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'keyup');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });
        });

        describe('test target event listeners', () => {
            it('should be able to open target', async () => {
                const component = /** @type {HXDisclosureElement} */ await fixture(template);
                const detail = { evt: 'open target!'};
                const customEvent = new CustomEvent('open', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'open');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });

            it('should be able to close target', async () => {
                const component = /** @type {HXDisclosureElement} */ await fixture(template);
                const detail = { evt: 'close target!'};
                const customEvent = new CustomEvent('close', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'close');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });
        });
    });
});
