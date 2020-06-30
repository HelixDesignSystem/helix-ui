import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-icon> component tests
 *
 * @type HXIconElement
 *
 */
describe('<hx-icon> component tests', () => {
    const template = '<hx-icon>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXIconElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXIconElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXIconElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXIconElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXIconElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxIcon <span>', async () => {
                const elSelector = 'span#hxIcon';
                const id = 'hxIcon';
                const component = /** @type { HXIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxPath <path>', async () => {
                const elSelector = 'path#hxPath';
                const id = 'hxPath';
                const component = /** @type { HXIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('test getters and setters', () => {
        it('should be able to set bell [type="bell"]', async () => {
            const component = /** @type {HXIconElement} */ await fixture(template);
            const attrType = 'bell';

            component.type = attrType;
            const attr = component.hasAttribute('type');
            const fileType = component.getAttribute('type');

            expect(attr).to.be.true;
            expect(fileType).to.equal(attrType);
        });
    });

});
