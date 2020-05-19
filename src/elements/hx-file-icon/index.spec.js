import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-file-icon> component tests
 *
 * @type HXFileIconElement
 *
 */
describe('<hx-file-icon> component tests', () => {
    const template = '<hx-file-icon>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXFileIconElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXFileIconElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXFileIconElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXFileIconElement } */ await fixture(template);

                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal("open");
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxFileIcon <div>', async () => {
                const elSelector = 'div#hxFileIcon';
                const id = 'hxFileIcon';
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxBase with an file type <hx-icon>', async () => {
                const elSelector = 'div#hxFileIcon > hx-icon';
                const fileType = 'file';
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(fileType);
            });

            it('markup should contain a #hxOverlay <div>', async () => {
                const elSelector = 'div#hxOverlay';
                const id = 'hxOverlay';
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxIcon <hx-icon>', async () => {
                const elSelector = 'div#hxOverlay > #hxIcon';
                const id = 'hxIcon';
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxExt <div>', async () => {
                const elSelector = 'div#hxExt';
                const id = 'hxExt';
                const component = /** @type { HXFileIconElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('test <hx-file-icon> getter and setter methods', () => {
        it('should be able to set bell [type="bell"]', async () => {
            const component = /** @type {HXFileIconElement} */ await fixture(template);
            const attrType = 'bell';

            component.type = attrType;
            const attr = component.hasAttribute('type');
            const fileType = component.getAttribute('type');

            expect(attr).to.be.true;
            expect(fileType).to.equal(attrType);
        });

        it('should be able to set extension [type="key"]', async () => {
            const component = /** @type {HXFileIconElement} */ await fixture(template);
            const attrType = 'key';

            component.extension = attrType;
            const attr = component.hasAttribute('extension');
            const extensionType = component.getAttribute('extension');

            expect(attr).to.be.true;
            expect(extensionType).to.equal(attrType);
        });
    });
});
