'use strict';

// Inspiration from https://github.com/ryanwild/nunjucks-highlight.js

const hljs = require('highlight.js');
const nunjucks = require('nunjucks');

function highlight (code, lang) {
    if (hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value;
    } else {
        return hljs.highlightAuto(code).value;
    }
}//highlight()

function stripIndent (str) {
    const match = str.match(/^[ \t]*(?=\S)/gm);

    if (!match) {
        return str;
    }

    const indent = Math.min.apply(Math, match.map(x => x.length));
    const re = new RegExp(`^[ \\t]{${indent}}`, 'gm');

    return indent > 0 ? str.replace(re, '') : str;
}//stripIndent()

function CodeTag () {
    this.tags = ['code'];

    this.parse = function (parser, nodes) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endcode');

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'render', args, [body]);
    };//parse()

    // Code rendering for the block.
    this.render = function (context, lang, blockBody) {
        let body = stripIndent(blockBody());
        let highlightedBody = highlight(body, lang);
        let template = `<pre><code class="${lang}">${highlightedBody}</code></pre>`;
        return new nunjucks.runtime.SafeString(template);
    };//render();
}//CodeTag

module.exports = new CodeTag();
