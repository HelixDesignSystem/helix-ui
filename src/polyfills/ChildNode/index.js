// Modified from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
[
    Element.prototype,
    CharacterData.prototype,
    DocumentType.prototype,
].forEach(function (proto) {
    if (!proto.hasOwnProperty('remove')) {
        Object.defineProperty(proto, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                if (this.parentNode !== null) {
                    this.parentNode.removeChild(this);
                }
            },
        });
    }
});
