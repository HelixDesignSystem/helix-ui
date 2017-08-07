'use strict';

var cheerio;


function helper(str, options) {
    options = options || {};

    if (!cheerio) cheerio = require('cheerio');

    var $ = cheerio.load(str);
    var headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // we only care about h1-6[id] or h1-6[data-id]
    var mappedHeadingSelectors = headingSelectors.map(function (selector) {
        return [
            selector + '[id]',
            selector + '[data-id]'
        ].join(',');
    });

    var headings = $(mappedHeadingSelectors.join(','));

    // STOP, if no TOC headings found
    if (!headings.length) return '';

    var className = options.class || 'toc';

    // begin TOC list
    var items = [];

    headings.each(function() {
        var anchor = $(this).attr('id') || $(this).data()['id'];

        // do not create list item if there is nowhere to anchor
        if (!anchor) {
            return;
        }

        items.push(
            `<li class="${className}-item">
                <a class="${className}-link" href="#${anchor}">
                    <span class="${className}-text">${$(this).text()}</span>
                </a>
            </li>`
        );
    });

    var result = `<ul class="${className}">${items.join('')}</ul>`;

    if (options.topLink === true) {
        result += `
            <a class="${className}-link" href="#top">
                <span class="${className}-text">^ Back to Top</span>
            </a>`;
    }

    return result;
}

hexo.extend.helper.register('flat_toc', helper);
