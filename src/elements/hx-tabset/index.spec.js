import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-tabset> component tests
 *
 * @type HXTabsetElement
 *
 */
describe('<hx-tabset> component tests', () => {
    const template = '<hx-tabset>';
    const mockup = `
        <hx-tabset id="tabsetTest" current-tab="0">
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

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const prop = fragment.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            expect(fragment).lightDom.to.not.equal(template);
        });
    });

    describe('test $onConnect method', () => {
        it('should get current-tab on render', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tab = fragment.hasAttribute('current-tab');
            const tabPosition = fragment.currentTab;

            expect(tab).to.be.true;
            expect(tabPosition).to.equal(0);
        });

        it('should have a randomly generated or assigned ID on render', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('id');
            const tabsetId = fragment.getAttribute('id');

            expect(attr).to.be.true;
            expect(tabsetId).to.not.be.null;
        });

        it('should have first tabpanel with open attribute', async () => {
            const elSelector = 'hx-tabpanel';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabpanel = fragment.querySelector(elSelector);
            const attr = tabpanel.hasAttribute('open');

            expect(attr).to.be.true;
        });

        it('should get tabsize on render', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tab = fragment.hasAttribute('tabsize');
            const tabSize = fragment.tabSize;

            expect(tab).to.be.true;
            expect(tabSize).to.equal(3);
        });
    });

    describe(`test ${template} getters and setters`, () => {
        it('should be able to get the current tab', async () => {
            const elSelector = 'hx-tab[current]';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            const tab = fragment.querySelector(elSelector);
            const current = tab.hasAttribute('current');

            expect(current).to.be.true;
        });

        it('should be able to set the current tab', async () => {
            const elSelector = 'hx-tab:nth-child(2)'; // 1-based index
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            fragment.currentTab = 1; // zero-based index
            const tab = fragment.querySelector(elSelector);

            tab.current; // set another tab as current
            const attr = tab.hasAttribute('current');

            expect(attr).to.be.true;
        });

        it('should be able to get all three(3) tabpanels', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabpanels = fragment.tabpanels;
            const len = tabpanels.length;

            expect(len).to.equal(3);
        });

        it('should be able get all three(3) tabs', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabs = fragment.tabs;
            const len = tabs.length;

            expect(len).to.equal(3);
        });

        it('should be able select the next tab', async () => {
            const elSelector = 'hx-tab#tab-2';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            fragment.selectNext();

            const tab = fragment.querySelector(elSelector);
            const attr = tab.hasAttribute('current');
            const current = tab.getAttribute('current');

            expect(attr).to.be.true;
            expect(current).to.equal(String(true));
        });

        it('should be able select the previous (last) tab', async () => {
            const elSelector = 'hx-tab#tab-3';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            fragment.selectPrevious();

            const tab = fragment.querySelector(elSelector);
            const attr = tab.hasAttribute('current');
            const current = tab.getAttribute('current');

            expect(attr).to.be.true;
            expect(current).to.equal(String(true));
        });
    });

    describe('test event listeners', () => {
        it('should be able add click event listener', async () => {
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const detail = { evt: 'click'};
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
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

            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
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
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
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
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabpanels = fragment.querySelector(elSelector).tabpanels;
            const len = tabpanels.length;

            expect(len).to.be.equal(0);
        });


        it('should render with an odd number of tabs and tabpanel', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset>
                        <hx-tablist>
                            <hx-tab></hx-tab>
                            <hx-tab></hx-tab>
                        </hx-tablist>
                        <hx-tabcontent>
                            <hx-tabpanel></hx-tabpanel>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabpanels = fragment.querySelector(elSelector).tabpanels;
            const panels = tabpanels.length;
            const tabs = fragment.querySelector(elSelector).tabs.length;

            expect(tabs).to.equal(2);
            expect(panels).to.be.equal(1);
        });

        it('should render with an odd number of tabpanels and tab', async () => {
            const mockup =`
                <div class="hxPanel hxTabbed">
                    <hx-tabset>
                        <hx-tablist>
                            <hx-tab></hx-tab>
                        </hx-tablist>
                        <hx-tabcontent>
                            <hx-tabpanel></hx-tabpanel>
                            <hx-tabpanel></hx-tabpanel>
                        </hx-tabcontent>
                    </hx-tabset>
                </div>`;

            const elSelector = 'hx-tabset';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabpanels = fragment.querySelector(elSelector).tabpanels;
            const panels = tabpanels.length;
            const tabs = fragment.querySelector(elSelector).tabs.length;

            expect(tabs).to.equal(1);
            expect(panels).to.be.equal(2);
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
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabs = fragment.querySelector(elSelector).tabs;
            const len = tabs.length;

            expect(len).to.equal(0);
        });

        it(`[FEATURE] should add a dynamic tab with id to empty ${template}`, async () => {
            const mockup = `
                <hx-tabset>
                    <hx-tablist>
                    </hx-tablist>
                    <hx-tabcontent>
                    </hx-tabcontent>
                </hx-tabset>`;

            const elSelector = 'hx-tablist > hx-tab';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabs = fragment.tabs;
            let firstTabCount = tabs.length;

            // add a dyanmic tab
            const tab = document.createElement('hx-tab');
            tab.innerHTML = "dynamic tab";
            fragment.querySelector('hx-tablist').appendChild(tab);

            const tabHasId = fragment.querySelector(elSelector).hasAttribute('id');

            // add panel
            const tabpanel = document.createElement('hx-tabpanel');
            tabpanel.innerHTML = "dynamic tab panel";
            fragment.querySelector('hx-tabcontent').appendChild(tabpanel);
            const secoundTabCount = fragment.tabs.length;

            fragment.update();

            expect(tabHasId).to.be.true;
            expect(firstTabCount).to.equal(0);
            expect(secoundTabCount).to.equal(1);
        });

        it(`[FEATURE] should add a dynamic tab with id to a populated ${template}`, async () => {
            const mockup = `
                <hx-tabset>
                    <hx-tablist>
                        <hx-tab id="dynamicTestTab"></hx-tab>
                    </hx-tablist>
                    <hx-tabcontent>
                        <hx-tabpanel id="dynamicTestTabpanel"></hx-tabpanel>
                    </hx-tabcontent>
                </hx-tabset>`;

            const elSelector = 'hx-tablist > hx-tab';
            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);
            const tabs = fragment.tabs;
            let firstTabCount = tabs.length;

            // add a dyanmic tab
            const tab = document.createElement('hx-tab');
            tab.innerHTML = "dynamic tab";
            fragment.querySelector('hx-tablist').appendChild(tab);

            const tabHasId = fragment.querySelector(elSelector).hasAttribute('id');

            // add panel
            const tabpanel = document.createElement('hx-tabpanel');
            tabpanel.innerHTML = "dynamic tab panel";
            fragment.querySelector('hx-tabcontent').appendChild(tabpanel);
            const secoundTabCount = fragment.tabs.length;

            fragment.update(); // update tab

            expect(tabHasId).to.be.true;
            expect(firstTabCount).to.equal(1);
            expect(secoundTabCount).to.equal(2);
        });

        it(`should be able to navigate between one or more tabs and tab panels`, async () => {
            const mockup = `
                <hx-tabset>
                    <hx-tablist>
                        <hx-tab>First</hx-tab>
                        <hx-tab>Second</hx-tab>
                        <hx-tab>Third</hx-tab>
                    </hx-tablist>
                    <hx-tabcontent>
                        <hx-tabpanel>tabpanel-1</hx-tabpanel>
                        <hx-tabpanel>tabpanel-2</hx-tabpanel>
                        <hx-tabpanel>tabpanel-3</hx-tabpanel>
                    </hx-tabcontent>
                </hx-tabset>`;

            const fragment = /** @type {HXTabsetElement} */ await fixture(mockup);

            // Selected tab
            const selectedTab = fragment.querySelector('hx-tab:nth-child(2)');

            // Data tabpanel
            const selectedContent = fragment.querySelector('hx-tabpanel:nth-child(2)');

            expect(selectedTab).to.not.be.null;
            expect(selectedContent).to.not.be.null;
        });
    });
});
