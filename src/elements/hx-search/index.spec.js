import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-search> component tests
 *
 * @type HXSearchElement
 *
 */
describe('<hx-search> component tests', () => {
    const template = '<hx-search>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXSearchElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXSearchElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXSearchElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXSearchElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXSearchElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxSearch <div>', async () => {
                const elSelector = 'div#hxSearch';
                const id = 'hxSearch';
                const component = /** @type { HXSearchElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxIcon with search type <hx-icon>', async () => {
                const elSelector = 'div#hxSearch > hx-icon';
                const searchType = 'search';
                const component = /** @type { HXSearchElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(searchType);
            });
        });
    });
});
