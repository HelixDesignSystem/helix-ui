import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-error> component tests
 *
 * @type HXErrorElement
 *
 */
describe('<hx-error> component tests', () => {
    const template = '<hx-error>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXErrorElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXErrorElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXErrorElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal("open");
            });

            it('should have a single <slot>', async () => {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const name = component.slot;

                expect(name).to.be.equal('');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxIcon <span>', async () => {
                const spanId = 'hxIcon';
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.getElementById(spanId);
                const queryId = query.id;

                expect(queryId).to.equal(spanId);
            });
        });
    });
});
