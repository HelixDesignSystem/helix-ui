import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-tabcontent> component tests
 *
 * @type HXTabcontentElement
 *
 */
describe('<hx-tabcontent> component tests', () => {
    const template = '<hx-tabcontent>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXTabcontentElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXTabcontentElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXTabcontentElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test $onConnect method', () => {
        it('should have role attribute default to presentation', async () => {
            const roleAttr = 'presentation';
            const component = /** @type {HXTabcontentElement} */ await fixture(template);
            const attr = component.hasAttribute('role');
            const role = component.getAttribute('role');

            expect(attr).to.be.true;
            expect(role).to.equal(roleAttr);
        });
    });

    describe('test adding event listeners', () => {
        describe('test scroll event listeners', () => {
            it('should add a scroll event listener', async () => {
                const component = /** @type {HXTabcontentElement} */ await fixture(template);
                const detail = { evt: 'scroll'};
                const customEvent = new CustomEvent('scroll', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'scroll');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });
        });

        describe('test scroll event listeners', () => {
            it('should be able to scroll', async () => {
                const component = /** @type {HXTabcontentElement} */ await fixture(template);
                const detail = { evt: 'scroll'};
                const customEvent = new CustomEvent('scroll', { detail });

                setTimeout(() => component.dispatchEvent(customEvent));
                const evt = await oneEvent(component, 'scroll');

                expect(evt).to.equal(customEvent);
                expect(evt.detail).to.equal(detail);
            });
        });
    });

    /**
     * The following block of tests apply to all HelixUI Tab component custom
     * elements.  These tests will be skipped until we implement a solution
     * for dynamically adding tabs (HelixUI Issue#516).
     */
    describe('test fix applied to HelixUI Issue#516', () => {
        it('should render with NO ID on <hx-tabset>', async () => {
            const mockup = `
                <hx-tabset current-tab="0">
                    <hx-tablist>
                        <hx-tab id="tab-1" current="true"></hx-tab>
                        <hx-tab id="tab-2"></hx-tab>
                        <hx-tab id="tab-3"></hx-tab>
                    </hx-tablist>
                    <hx-tabcontent>
                        <hx-tabpanel id="panel-1" open></hx-tabpanel>
                        <hx-tabpanel id="panel-2"></hx-tabpanel>
                        <hx-tabpanel id="panel-3"></hx-tabpanel>
                    </hx-tabcontent>
                </hx-tabset>`;

            const fragment = /** @type {HXTablistElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('id');
            const id = fragment.getAttribute('id');

            expect(attr).to.be.true;
            expect(id).to.not.be.null;
        });

        it('should render with NO initial <hx-tab>', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset>
                        <hx-tablist>
                        </hx-tablist>
                        <hx-tabcontent>
                          <hx-tabpanel></hx-tabpanel>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTablistElement} */ await fixture(mockup);
            const tabs = fragment.querySelector(elSelector).tabs;
            const len = tabs.length;

            expect(len).to.be.equal(0);
        });

        it('should render with NO tabpanel', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset>
                        <hx-tablist>
                            <hx-tab></hx-tab>
                            <hx-tab></hx-tab>
                        </hx-tablist>
                        <hx-tabcontent>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTablistElement} */ await fixture(mockup);
            const tabpanels = fragment.querySelector(elSelector).tabpanels;
            const len = tabpanels.length;

            expect(len).to.be.equal(0);
        });

        it('should render with NO tabs or tabpanels', async () => {
            const mockup = `
                <div class="hxPanel hxTabbed">
                    <hx-tabset>
                        <hx-tablist>
                        </hx-tablist>
                        <hx-tabcontent>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTablistElement} */ await fixture(mockup);
            const tabs = fragment.querySelector(elSelector).tabs;
            const len = tabs.length;

            expect(len).to.equal(0);
        });
    });
});
