import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-file-tile> component tests
 *
 * @type HXFileTileElement
 *
 */
describe('<hx-file-tile> component tests', () => {
    const template = '<hx-file-tile>';

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxFileTile <div>', async () => {
                const elSelector = 'div#hxFileTile';
                const id = 'hxFileTile';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxLink <a>', async () => {
                const elSelector = 'div > #hxLink';
                const id = 'hxLink';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxIconWrapper <div>', async () => {
                const elSelector = 'div > a > #hxIconWrapper';
                const id = 'hxIconWrapper';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxIcon type <hx-file-icon>', async () => {
                const elSelector = 'div > a > div > hx-file-icon';
                const id = 'hxIcon';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a type <hx-icon>', async () => {
                const elSelector = 'div > a > div > hx-icon';
                const iconType = 'download';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });

            it('markup should contain a #hxContentWrapper <div>', async () => {
                const elSelector = 'div > a > #hxContentWrapper';
                const id = 'hxContentWrapper';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxName <div>', async () => {
                const elSelector = 'div > a > div#hxContentWrapper > #hxName';
                const id = 'hxName';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxState--downloadable <div>', async () => {
                const elSelector = 'div > a > div#hxContentWrapper > div#hxState--downloadable';
                const id = 'hxState--downloadable';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxDetails <div>', async () => {
                const elSelector = 'div > a > div > div > div#hxDetails';
                const id = 'hxDetails';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxState--loading <div>', async () => {
                const elSelector = 'div > a > div#hxContentWrapper > div#hxState--loading';
                const id = 'hxState--loading';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxProgress type <hx-progress>', async () => {
                const elSelector = 'div > a > div > div#hxState--loading > hx-progress ';
                const id = 'hxProgress';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxState--invalid <div>', async () => {
                const elSelector = 'div > a > div#hxContentWrapper > div#hxState--invalid';
                const id = 'hxState--invalid';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });

            it('markup should contain a #hxRetry button with a times type <button>', async () => {
                const elSelector = 'div > a > div#hxContentWrapper > div#hxState--invalid > button';
                const buttonType = 'button';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(buttonType);
            });

            it('markup should contain a type <hx-icon>', async () => {
                const elSelector = 'div > a > div > div > button > hx-icon';
                const iconType = 'redo';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });

            it('markup should contain a #hxDismiss button with a times type <button>', async () => {
                const elSelector = 'div#hxFileTile > button';
                const buttonType = 'button';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(buttonType);
            });

            it('markup should contain a type <hx-icon>', async () => {
                const elSelector = 'div#hxFileTile > button > hx-icon';
                const iconType = 'times';
                const component = /** @type { HXFileTileElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryType = query.type;

                expect(queryType).to.equal(iconType);
            });
        });
    });

    describe('test getters and setters', () => {
        it('should be able to set a name message', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const msg = 'id_rsa.pub';

            component.name = msg;
            const attr = component.hasAttribute('name');
            const statusMsg = component.getAttribute('name');

            expect(attr).to.be.true;
            expect(statusMsg).to.equal(msg);
        });

        it('should be able to set a href', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const msg = 'path/to/id_rsa.pub';

            component.href = msg;
            const attr = component.hasAttribute('href');
            const statusMsg = component.getAttribute('href');

            expect(attr).to.be.true;
            expect(statusMsg).to.equal(msg);
        });

        it('should be able to set a progress message', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const msg = '50';

            component.progress = msg;
            const attr = component.hasAttribute('progress');
            const statusMsg = component.getAttribute('progress');

            expect(attr).to.be.true;
            expect(statusMsg).to.equal(msg);
        });

        it('should be able to set icon [type="key"]', async () => {
            const component = /** @type {HXFileTileElement} */ await fixture(template);
            const iconType = 'key';

            component.icon = iconType;
            const attr = component.hasAttribute('icon');
            const extensionType = component.getAttribute('icon');

            expect(attr).to.be.true;
            expect(extensionType).to.equal(iconType);
        });
    });
});
