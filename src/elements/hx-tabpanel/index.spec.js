import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-tabpanel> component tests
 *
 * @type HXTabpanelElement
 *
 */
describe('<hx-tabpanel> component tests', () => {
    const template = '<hx-tabpanel>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXTabpanelElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXTabpanelElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXTabpanelElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test $onConnect method', () => {
        it('should have role attribute default to tablist', async () => {
            const roleAttr = 'tabpanel';
            const component = /** @type {HXTabpanelElement} */ await fixture(template);
            const attr = component.hasAttribute('role');
            const role = component.getAttribute('role');

            expect(attr).to.be.true;
            expect(role).to.equal(roleAttr);
        });

        it('should set the aria-expanded attribute to true', async () => {
            const mockup = `
                <hx-tabset id="tabpanelTest" current-tab="0">
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

            const elSelector = 'hx-tabpanel';
            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const tabpanel = fragment.querySelector(elSelector);
            const attr = tabpanel.hasAttribute('aria-expanded');
            const ariaAttr = tabpanel.getAttribute('aria-expanded');

            expect(attr).to.be.true;
            expect(ariaAttr).to.equal(String(true));
        });

        it('should have first tabpanel with open attribute', async () => {
            const mockup = `
                <hx-tabset id="tabpanelTest" current-tab="0">
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

            const elSelector = 'hx-tabpanel';
            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const tabpanel = fragment.querySelector(elSelector);
            const attr = tabpanel.hasAttribute('open');

            expect(attr).to.be.true;
        });
    });

    describe('test scroll event listeners', () => {
        it('should be able to scroll', async () => {
            const component = /** @type {HXTabpanelElement} */ await fixture(template);
            const detail = { evt: 'scroll'};
            const customEvent = new CustomEvent('scroll', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'scroll');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });

    /**
     * The following block of tests apply to all HelixUI Tab component custom
     * elements.  These tests will be skipped until we implement a solution
     * for dynamically adding tabs (HelixUI Issue#516).
     */
    describe.skip('tests should FAIL until fix applied to HelixUI Issue#516', () => {
        it('should FAIL on render with NO ID on <hx-tabset>', async () => {
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

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const queryId = fragment.querySelector(elSelector).id;

            expect(queryId).to.not.be.null;
        });

        it('should FAIL on render with NO initial <hx-tab>', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset id="tab-component-tests">
                        <hx-tablist id="tablist">
                        </hx-tablist>
                        <hx-tabcontent id="tabcontent">
                          <hx-tabpanel></hx-tabpanel>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const currentTabId = fragment.querySelector('hx-tab').id;

            expect(currentTabId).to.be.null;
        });

        it('should FAIL on render with NO initial <hx-tabpanel>', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset id="tab-component-tests">
                        <hx-tablist id="tablist">
                            <hx-tab id="tab-1" current="true"></hx-tab>
                        </hx-tablist>
                        <hx-tabcontent id="tabcontent">
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const queryId = fragment.querySelector('hx-tabpanel').id;

            expect(queryId).to.be.null;
        });

        it('should FAIL on render with NO tabs or tabpanels', async () => {
            const mockup = `
                <div class="hxPanel hxTabbed">
                    <hx-tabset id="tabTest">
                        <hx-tablist>
                        </hx-tablist>
                        <hx-tabcontent>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const fragment = /** @type {HXTabpanelElement} */ await fixture(mockup);
            const queryTabs = fragment.tabs.length;

            expect(queryTabs).to.equal(0);
        });
    });
});
