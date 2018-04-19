# Compatibility Notes
**Updated:** 2018-04-18

## webcomponentsjs (v1 polyfills)
https://github.com/webcomponents/webcomponentsjs/blob/master/README.md

- Custom Elements registry (`window.customElements`)
- HTML imports
- ShadowDOM (`Element.attachShadow()`)
- HTML Templates (`HTMLTemplateElement`)
- `Promise`
- `Event()`, `CustomEvent()`, `MouseEvent()` constructors
- `Object.assign()`, `Array.from()`


## APIs Consumed

* [Array](#array)
* [ChildNode](#childnode)
* [CustomEvent](#customevent)
* [document](#document)
* [Element](#element)
* [Event](#event)
* [EventTarget](#eventtarget)
* [Function](#function)
* [HTMLElement](#htmlelement)
* [HTMLInputElement](#htmlinputelement)
* [HTMLTemplateElement](#htmltemplateelement)
* [KeyboardEvent](#keyboardevent)
* [Math](#math)
* [Node](#node)
* [Number](#number)
* [Object](#object)
* [ParentNode](#parentnode)
* [Promise](#promise)
* [String](#string)
* [window](#window)

### Array
* `concat()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat#Browser_compatibility)
* `from()`
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`
* `forEach()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Browser_compatibility)
* `indexOf()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Browser_compatibility)
* `length` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length#Browser_compatibility)

### ChildNode
* `remove()`
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Browser_compatibility)
    * [Polyfill](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill)

### CustomEvent
* `CustomEvent()` constructor
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`

### document
* `createElement()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement#Browser_compatibility)

### DocumentFragment
* `querySelector()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/querySelector#Browser_Compatibility)
* `querySelectorAll()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/querySelectorAll#Browser_compatibility)
* `getElementById()` - [OK](https://caniuse.com/#search=getElementById)

### Element
* `attachShadow()`
    * [**legacy browsers need polyfills**](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`
* `closest()`
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Browser_compatibility)
    * [Polyfill](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill)
* `getAttribute()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute#Browser_compatibility)
* `hasAttribute()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute#Browser_compatibility)
* `id` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Element/id#Browser_compatibility)
* `innerHTML` - [OK](https://caniuse.com/#feat=xml-serializer)
* `removeAttribute()` - OK
* `setAttribute()` - OK
* `shadowRoot`
    * [**legacy browsers need polyfills**](https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`

### Event
* `Event()` constructor
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/API/Event#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`
* `preventDefault()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault#Browser_compatibility)
* `stopImmediatePropagation()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation#Browser_compatibility)
* `stopPropagation()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation#Browser_Compatibility)
* `target` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Event/target#Browser_compatibility)

### EventTarget
* `addEventListener()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)
* `dispatchEvent()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#Browser_Compatibility)
* `removeEventListener()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#Browser_compatibility)

### Function
* `bind()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Browser_compatibility)

### HTMLElement
* `blur()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur#Browser_compatibility)
* `focus()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Browser_compatibility)
* `hidden` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/hidden#Browser_compatibility)

### HTMLInputElement
* `checked` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
* `disabled` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
* `indeterminate` - [OK](https://caniuse.com/#feat=indeterminate-checkbox)
* `placeholder` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
* `value` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

### HTMLTemplateElement
* [**IE11 needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement#Browser_compatibility)
* Polyfill provided by `webcomponents/webcomponentsjs`

### KeyboardEvent
* `keyCode` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode#Browser_compatibility)

### Math
* `random()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Browser_compatibility)

### Node
* `appendChild()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild#Browser_compatibility)
* `cloneNode()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode#Browser_compatibility)
* `contains()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains#Browser_compatibility)
* `getRootNode()`
    - **IE and Edge need polyfill**
    - Polyfill provided by `webcomponents/webcomponentsjs`
* `textContent` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#Browser_compatibility)
* `parentNode` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode#Browser_compatibility)
* `removeChild()` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)

### Number
* `Number()` constructor - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#Browser_compatibility)
* `toString()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString#Browser_compatibility)

### Object
* `assign()` 
    * [**IE needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Browser_compatibility)
    * Polyfill provided by `webcomponents/webcomponentsjs`
* `defineProperty()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Browser_compatibility)
* `hasOwnProperty()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty#Browser_compatibility)

### ParentNode
* `firstElementChild` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild#Browser_compatibility)

### Promise
* [**IE11 needs polyfill**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility)
* Polyfill provided by `webcomponents/webcomponentsjs`

### String
* `substr()` - [OK](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr#Browser_compatibility)

### window
* `innerHeight` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight#Browser_compatibility)
* `innerWidth` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#Browser_compatibility)
* `pageXOffset` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageXOffset#Browser_compatibility)
* `pageYOffset` - [OK](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset#Browser_compatibility)
