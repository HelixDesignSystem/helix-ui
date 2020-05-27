import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-file-input> component tests
 *
 * @type HXFileInputElement
 *
 */
describe('<hx-file-input> component tests', () => {
    const template = '<hx-file-input>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXFileInputElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXFileInputElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXFileInputElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal("open");
            });

            it('should have a single <slot>', async () => {
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const name = component.slot;

                if ( name !== null ) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxFileInput <div>', async () => {
                const elSelector = 'div#hxFileInput';
                const id = 'hxFileInput';
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxIcon', async () => {
                const elSelector = 'div#hxFileInput > #hxIcon';
                const id = 'hxIcon';
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxLabel <span>', async () => {
                const elSelector = 'span#hxLabel';
                const id = 'hxLabel';
                const component = /** @type { HXFileInputElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('test getters and setters', () => {
        it('should be able to set icon [icon="upload"]', async () => {
            const component = /** @type {HXFileInputElement} */ await fixture(template);
            const attrType = 'upload';

            component.icon = attrType;
            const attr = component.hasAttribute('icon');
            const iconType = component.getAttribute('icon');

            expect(attr).to.be.true;
            expect(iconType).to.equal(attrType);
        });
    });
});
