// Add [data-mock-invalid] to elements in test pages to force :invalid state.
// Only works on elements with the `setCustomValidity(msg)` method.
(function () {
    let allMockInvalid = document.querySelectorAll('[data-mock-invalid]');
    let mockInvalidElements = Array.from(allMockInvalid);

    mockInvalidElements.forEach(function (el) {
        if (el.setCustomValidity) {
            el.setCustomValidity('invalid for testing');
        }
    });
})();

// Add [data-mock-indeterminate] to elements in test pagest ot force :indeterminate state
(function () {
    let allMockIndeterminate = document.querySelectorAll('[data-mock-indeterminate]');
    let mockIndeterminateElements = Array.from(allMockIndeterminate);

    mockIndeterminateElements.forEach(function (el) {
        el.indeterminate = true;
    });
})();
