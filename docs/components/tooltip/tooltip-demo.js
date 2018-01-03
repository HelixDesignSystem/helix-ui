if (document.getElementById('vue-tooltipDemo')) {
    new Vue({
        el: '#vue-tooltipDemo',
        data: {
            position: {
                label: 'Top', 
                value: 'top',
            },
            positions:[ 
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
            ],
        },
    });
}
