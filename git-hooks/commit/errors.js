const TYPES = require('./types');
const { format } = require('../util/formatting');

/* STYLES */
const h1 = format({ bold: true, underline: true });
const h2 = format({ bold: true });


/* SNIPPETS  */
const SYNTAX = '<type>[(<scope>)][!]: <summary>';
const SYNTAX_NO_SCOPE = '<type>[!]: <summary>';
const TYPES_INLINE = Object.keys(TYPES).join(', ');


/* ERROR FUNCTIONS */

const incorrectFormat = (txtMsg) => console.error(`
    ${h1('ERROR: Submitted commit message header does not match expected format!')}

    ${h2('Submitted')}
        ${txtMsg}

    ${h2('Syntax')}
        ${SYNTAX}
`);

const unknownType = (header, type) => console.error(`
    ${h1('ERROR: Submitted commit message header has unknown commit type!')}

    ${h2('Submitted Header')}
        ${header}

    ${h2('Parsed Type')}
        ${type}

    ${h2('Valid Types')}
        ${TYPES_INLINE}

    ${h2('Syntax')}
        ${SYNTAX}
`);

const unusableContent = (msgContent) => console.error(`
    ${h1('ERROR: Submitted commit message contains no useful content!')}

    Please make sure that your commit message has at least one
    line of non-comment text.

    ${h2('Syntax')}
        ${SYNTAX}

        [<body>]

        [<footer>]

    ${h2('Submitted Message Content')}
// ---------- BEGIN ---------- //
${msgContent}
// ----------- END ----------- //
`);

const emptyScope = (header) => console.error(`
    ${h1('ERROR: Submitted commit message header has empty scope!')}

    ${h2('Submitted Header')}
        ${header}

    ${h2('Syntax')}
        If you do not need a scope, consider using the scope-less syntax:

            ${SYNTAX_NO_SCOPE}

        Otherwise, please make sure that the scope is not blank.

            ${SYNTAX}
`);


/* EXPORTS */
module.exports = {
    emptyScope,
    incorrectFormat,
    unknownType,
    unusableContent,
};
