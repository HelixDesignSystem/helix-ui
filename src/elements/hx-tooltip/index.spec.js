import { fixture, oneEvent, expect } from '@open-wc/testing';

/**
 * <hx-tooltip> component tests
 *
 * @type HXTooltipElement
 *
 */
describe('<hx-tooltip> component tests', () => {
    const template = '<hx-tooltip>';
    const mockup = `
        <hx-tooltip for="icon1"
            position="top-center"
            hx-defined=""
            aria-hidden="true"
            id="tip-1uucxkzw"
            role="tooltip"
        >
            Top Center Tooltip
        </hx-tooltip>`;
    const mockupId = `
        <hx-tooltip for="iconCtrlEl" position="bottom-center">
            Bottom Center Tooltip
        </hx-tooltip>
        <p>
            <hx-icon id="iconCtrlEl" type="help-circle"></hx-icon>
        </p>`;

    describe('test instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered Light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type {HXTooltipElement} */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type {HXTooltipElement} */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal('open');
            });

            it('should have a single <slot>', async () => {
                const component = /** @type {HXTooltipElement} */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelectorAll('slot');
                const len = query.length;

                expect(len).to.be.equal(1);
            });

            it('should have an unnamed <slot>', async () => {
                const component = /** @type {HXTooltipElement} */ await fixture(template);
                const name = component.slot;

                if (name !== null) {
                    expect(name).to.be.equal('');
                } else {
                    expect(name).to.be.null;  // IE11, Legacy Edge, and older browsers
                }
            });
        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxTooltip div', async () => {
                const elSelector = 'div#hxTooltip';
                const id = 'hxTooltip';
                const component = /** @type {HXTooltipElement} */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.querySelector(elSelector);
                const queryId = query.id;

                expect(queryId).to.equal(id);
            });
        });
    });

    describe('verify onCreate method', () => {
        it('test for default position', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const defaultPosition = 'top-center';
            const attr = component.hasAttribute('position');
            const tooltipPosition = component.getAttribute('position');

            expect(attr).to.be.true;
            expect(tooltipPosition).to.equal(defaultPosition);
        });

        it('test for position offset', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const positionOffset = 20;
            const offsetValue = component.POSITION_OFFSET;

            expect(offsetValue).to.equal(positionOffset);
        });

        it('test for checking all positions', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const position = component.getAttribute('position');
            const changePosition = 'right-middle';
            component.setShadowPosition(changePosition);
            const newPosition = component.shadowRoot.querySelector('div').getAttribute('position')

            expect(newPosition).to.not.equal(position);
            expect(newPosition).to.equal(changePosition);
        });
    });

    describe('test $onConnect method', () => {
        it('should have a randomly generated or assigned ID on render', async () => {
            const fragment = /** @type {HXTooltipElement} */ await fixture(mockup);
            const attr = fragment.hasAttribute('id');
            const tooltipId = fragment.getAttribute('id');

            expect(attr).to.be.true;
            expect(tooltipId).to.not.be.null;
        });

        it('should have role attribute default to tooltip', async () => {
            const roleAttr = 'tooltip';
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const attr = component.hasAttribute('role');
            const role = component.getAttribute('role');

            expect(attr).to.be.true;
            expect(role).to.equal(roleAttr);
        });
    });

    describe('test <hx-tooltip> getters and setters', () => {
        it('should get *for* value', async () => {
            const forValue = 'icon1';
            const component = /** @type {HXTooltipElement} */ await fixture(mockup);
            const attr = component.htmlFor;

            expect(attr).to.equal(forValue);
        });

        it('should set *for* attribute value', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const value = 'newIcon';
            const attr = component.hasAttribute('for');

            component.htmlFor = value;
            const forValue = component.getAttribute('for');

            expect(attr).to.be.false;
            expect(forValue).to.equal(value);
        });

        it('should set shadow root to new position', async () => {
            const fragment = /** @type {HXTooltipElement} */ await fixture(mockup);
            const newPosition = 'bottom-center';

            fragment.setShadowPosition(newPosition);

            const tooltipPosition = fragment.shadowRoot.querySelector('div').getAttribute('position');

            expect(tooltipPosition).to.equal(newPosition);
        });

        it('should get control element id of iconCtrlEl', async () => {
            const fragment = /** @type {HXTooltipElement} */ await fixture(mockupId);
            const id = 'iconCtrlEl';
            const ctrlElement = fragment.controlElement;
            const ctrlElementID = ctrlElement.id;

            expect(ctrlElementID).to.equal(id);
        });
    });

    describe('test for event listeners', () => {
        it('should fire a blur event', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const detail = { evt: 'blur!'};
            const customEvent = new CustomEvent('blur', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'blur');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a focus event', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const detail = { evt: 'focus'};
            const customEvent = new CustomEvent('focus', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'focus');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a mouseenter event', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const detail = { evt: 'mouseenter'};
            const customEvent = new CustomEvent('mouseenter', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'mouseenter');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });

        it('should fire a mouseleave event', async () => {
            const component = /** @type {HXTooltipElement} */ await fixture(template);
            const detail = { evt: 'mouseleave'};
            const customEvent = new CustomEvent('mouseleave', { detail });

            setTimeout(() => component.dispatchEvent(customEvent));
            const evt = await oneEvent(component, 'mouseleave');

            expect(evt).to.equal(customEvent);
            expect(evt.detail).to.equal(detail);
        });
    });
});
