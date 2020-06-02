import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-select> component tests
 *
 * @type HXSelectElement
 *
 */
describe('<hx-select> component tests', () => {
    const template = '<hx-select>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXSelectElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXSelectElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXSelectElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXSelectElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXSelectElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxSelect <div>', async () => {
                const elSelector = 'div#hxSelect';
                const id = 'hxSelect';
                const component = /** @type { HXSelectElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxTrigger <div>', async () => {
                const elSelector = 'div#hxSelect > #hxTrigger';
                const id = 'hxTrigger';
                const component = /** @type { HXSelectElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain select type <hx-icon>', async () => {
                const elSelector = 'div#hxTrigger > hx-icon';
                const selectType = 'angle-down';
                const component = /** @type { HXSelectElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(selectType);
            });
        });
    });
});
