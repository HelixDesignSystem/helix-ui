var proto = Node.prototype;
if (!proto.hasOwnProperty('isConnected')) {
    Object.defineProperty(proto, 'isConnected', {
        enumerable: true,
        get: function () {
            return (this.getRootNode().nodeType === Node.DOCUMENT_NODE);
        },
    });
}
