'use strict';

// Inspiration from https://github.com/ryanwild/nunjucks-highlight.js

const hljs = require('highlight.js');
const nunjucks = require('nunjucks');

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

        // I found Nunjucks to be incredibly convoluted on how to just get some data into the BlockTag function,
        // this finally worked by faking another template node.
        var tabStart = new nodes.NodeList(0, 0, [
            new nodes.Output(0, 0, [
                new nodes.TemplateData(0, 0, (tok.colno - 1))
            ])
        ]);

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'render', args, [body, tabStart]);
    };//parse()

    // code rendering for the block. Pretty simple, just get the body text and pass
    // it through the code renderer.
    this.render = function (context, blockBody, blockTabStart) {
        let body = blockBody();
        let spacesRegex = /^[\s]+/;
        let tabStart = blockTabStart(); // The column postion of the {% code %} tag.

        // TODO: Update to automatically normalize indentation to least indentation needed.
        //   - This still adds unnecessary indentation to beginning of output.
        if (tabStart > 0) { // If the {% code %} tag is tabbed in, normalize the content to the same depth.
            body = body.split(/\r?\n/); // Split into lines.
            body = body.map( line => {
                let startSpaces = line.match(spacesRegex);
                // If the content is not at the same or greater tab depth, do nothing..
                if (startSpaces && startSpaces[0].length >= tabStart) {
                    return line.slice(tabStart); // Subtract the column position from the start of the string.
                } else {
                    return line;
                }
            });

            // Remove blank start line
            if (body[0] === '') {
                body = body.slice(1);
            }
            // Remove blank end line
            if (body[body.length - 1] === '') {
                body = body.slice(0, body.length - 1);
            }

            body = body.join('\n'); // Rejoin into one string.
        }

        // remove line break from start and end of string
        // <http://stackoverflow.com/a/14572494>
        body = body.replace(/^\s+|\s+$/, '');

        // get the first line of the body to see if we have a file type specified
        var value = hljs.highlightAuto(body).value;
        if (body.split('\n').length > 1) {
            var lang = hljs.getLanguage(body.split("\n")[0]);
            if (lang) {
                lang = body.split('\n')[0];
                body = body.split('\n').slice(1).join('\n');
                value = hljs.highlight(lang, body).value;
            }
        }

        let template = `<pre class="highlight"><code class="hljs">${value}</code></pre>`;

        return new nunjucks.runtime.SafeString(template);
    };//render();
}//CodeTag

module.exports = new CodeTag();
