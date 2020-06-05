import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-modal> component tests
 *
 * @type HXModalElement
 *
 */
describe('<hx-modal> component tests', () => {
    const template = '<hx-modal>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXModalElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXModalElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXModalElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXModalElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });

            it('should have a single <slot>', async () => {
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXModalElement } */ await fixture(template);
                const name = component.slot;

                if ( name !== null ) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;
                }
            });
        });

        describe('verify Shadow DOM markup', () => {

            it('markup should contain a #hxBackdrop <div>', async () => {
                const elSelector = 'div#hxBackdrop';
                const id = 'hxBackdrop';
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxModal <div>', async () => {
                const elSelector = 'div#hxModal';
                const id = 'hxModal';
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxClose button', async () => {
                const elSelector = 'button#hxClose';
                const id = 'hxClose';
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxClose button with a times type <hx-icon>', async () => {
                const elSelector = 'button#hxClose > hx-icon';
                const iconType = 'times';
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });

            it('markup should contain a #hxContent <div>', async () => {
                const elSelector = 'div#hxContent';
                const id = 'hxContent';
                const component = /** @type { HXModalElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('test getters and setters', () => {
        it('should be able to open', async () => {
            const component = /** @type {HXModalElement} */ await fixture(template);
            component.open = true;
            const attr = component.hasAttribute('open');

            expect(attr).to.be.true;
        });     
    });

    describe('test for click event listener', () => {
        it('should fire a click event', async () => {
            const component = /** @type { HXModalElement } */ await fixture(template);
            const detail = { evt: 'clicked!'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
