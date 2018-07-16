(function () {
    const POSITIONS = [
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top', value: 'top' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Right Top', value: 'right-top' },
        { label: 'Right', value: 'right' },
        { label: 'Right Bottom', value: 'right-bottom' },
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Left Bottom', value: 'left-bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Left Top', value: 'left-top' },
    ];

    if (document.getElementById('vue-tooltipHoverDemo')) {
        new Vue({
            el: '#vue-tooltipHoverDemo',
            data: {
                position: POSITIONS[1], // Top
                positions: POSITIONS,
            },
        });
    }

    if (document.getElementById('vue-tooltipClickDemo')) {
        new Vue({
            el: '#vue-tooltipClickDemo',
            data: {
                position: POSITIONS[1], // Top
                positions: POSITIONS,
            },
        });
    }
})();
