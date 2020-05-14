import { fixture, expect } from '@open-wc/testing';

/**
 * <hx-progress> component tests
 *
 * @type HXProgressElement
 *
 */
describe('<hx-progress> component tests', () => {
    const template = '<hx-progress>';

    describe('instantiate element', () => {
        it('should be instantiated with hx-defined attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('hx-defined');

            expect(attr).to.be.true;
        });

        it('should not be hidden', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const prop = component.hidden;

            expect(prop).to.be.false;
        });

        it(`the rendered light DOM should NOT equal simple template ${template}`, async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);

            expect(component).lightDom.to.not.equal(template);
        });
    });

    describe('test $onConnect method', () => {
        
        it('should have aria-valuemin attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemin');

            expect(attr).to.be.true;
        });

        it('aria-valuemin should have a default value of 0', async () => {
            const defaultValue = 0;
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemin');
            const value = component.getAttribute('aria-valuemin');
  
            expect(attr).to.be.true;
            expect(value).to.equal(String(defaultValue));
        });

        it('should have aria-valuemax attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemax');

            expect(attr).to.be.true;
        });

        it('aria-valuemax should have a default value of 100', async () => {
            const defaultValue = 100;
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('aria-valuemax');
            const value = component.getAttribute('aria-valuemax');
  
            expect(attr).to.be.true;
            expect(value).to.equal(String(defaultValue));
        });

        it('should have role attribute', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            const attr = component.hasAttribute('role');

            expect(attr).to.be.true;
        });

        it('should have role attribute set to progressbar', async () => {
            const defaultValue = 'progressbar';
            const component = /** @type {HXBusyElement} */ await fixture(template);
            const attr = component.getAttribute('role');

            expect(attr).to.be.equal(String(defaultValue));
        });

    });

    describe('test <hx-progress> getter and setter methods', () => {
        it('should be able to pause element', async () => {
            const component = /** @type {HXProgressElement} */ await fixture(template);
            component.paused = true;
            const attr = component.hasAttribute('value');

            expect(attr).to.be.true;
        });
        it('should be able to pause and unpause element', async () => {
            const attributeValue = 50;
            const component = /** @type {HXProgressElement} */ await fixture(template);
            component.value = attributeValue;
            const attr = component.hasAttribute('value');
            const value = component.getAttribute('value');
  
            expect(attr).to.be.true;
            expect(value).to.equal(String(attributeValue));
        });

    });

    describe('test Shadow DOM', () => {
        describe('verify render', () => {
            it('should have a static Shadow DOM', async function () {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const shadow = component.shadowRoot.innerHTML;

                expect(component).shadowDom.to.equal(shadow);
            });

            it('should render the Shadow Root mode open', async () => {
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const mode = component.shadowRoot.mode;

                expect(mode).to.equal("open");
            });

        });

        describe('verify Shadow DOM markup', () => {
            it('markup should contain a #hxFill <span>', async () => {
                const spanId = 'hxFill';
                const component = /** @type { HXErrorElement } */ await fixture(template);
                const shadow = component.shadowRoot;
                const query = shadow.getElementById(spanId);
                const queryId = query.id;

                expect(queryId).to.equal(spanId);
            });
        });
    });

});
