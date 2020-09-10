import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-toggle> component tests
 *
 * @type HXToggleElement
 *
 */
describe('<hx-toggle> component tests', () => {
    const template = '<hx-toggle>';
    const mockup = `<hx-toggle aria-labelledby="toggleDemo"></hx-toggle>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXToggleElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXToggleElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXToggleElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxToggle <div>', async () => {
                const elSelector = 'div#hxToggle';
                const id = 'hxToggle';
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxToggleGrid <div>', async () => {
                const elSelector = 'div#hxToggle > #hxToggleGrid';
                const id = 'hxToggleGrid';
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain grid type <hx-icon>', async () => {
                const elSelector = 'div#hxToggleGrid > hx-icon';
                const selectType = 'grid';
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(selectType);
            });

            it('markup should contain a #hxToggleList <div>', async () => {
                const elSelector = 'div#hxToggle > #hxToggleList';
                const id = 'hxToggleList';
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain list type <hx-icon>', async () => {
                const elSelector = 'div#hxToggleList > hx-icon';
                const selectType = 'list';
                const component = /** @type { HXToggleElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(selectType);
            });
        });
    });

    describe('test <hx-toggle> getter and setter methods', () => {
        it('should be able to add toggled attribute', async () => {
            const fragment = /** @type {HXToggleElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('toggled');
            fragment.toggled = true;
            const toggledAttr = fragment.hasAttribute('toggled');

            expect(attr).to.be.false;
            expect(toggledAttr).to.be.true;
        });
    });
});
