import { fixture, expect, oneEvent } from '@open-wc/testing';

/**
 * <hx-search-control> component tests
 *
 * @type HXSearchControlElement
 *
 */
describe('<hx-search-control> component tests', () => {
    const template = '<hx-search-control>';
    const mockup = `
            <hx-search-control>
                <input
                    id="demoSearch"
                    type="search"
                />
                <button
                    type="button"
                    class="hxClear"
                    aria-label="Clear search"
                hidden>
                <hx-icon type="times"></hx-icon>
                </button>
                <hx-search></hx-search>
                <label
                    for="demoSearch">
                    Username
                </label>
            </hx-search-control>`;

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const fragment = /** @type {HXSearchControlElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const fragment = /** @type {HXSearchControlElement} */ await fixture(mockup);
            const prop = fragment.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const fragment = /** @type {HXSearchControlElement} */ await fixture(mockup);

            expect(fragment).lightDom.to.not.equal(template);
        });

        it(`should NOT have a Shadow DOM`, async () => {
            const fragment = /** @type {HXSearchControlElement} */ await fixture(mockup);
            const shadow = fragment.shadowRoot;

            expect(shadow).to.be.null;
        });
    });

    describe('test for event listeners', () => {
        it('should fire a input event', async () => {
            const fragment = /** @type { HXSearchControlElement } */ await fixture(mockup);
            const detail = { evt: 'input!' };
            const customEvent = new CustomEvent('input', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'input');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a click event', async () => {
            const fragment = /** @type { HXSearchControlElement } */ await fixture(mockup);
            const detail = { evt: 'click!' };
            const customEvent = new CustomEvent('click', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'click');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a change event', async () => {
            const fragment = /** @type { HXSearchControlElement } */ await fixture(mockup);
            const detail = { evt: 'change!' };
            const customEvent = new CustomEvent('change', { detail });

            setTimeout(() => fragment.dispatchEvent(customEvent));
            const evt = await oneEvent(fragment, 'change');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

    });
});
