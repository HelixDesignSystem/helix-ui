function stripIndent (rawString) {
    const match = rawString.match(/^[ \t]*(?=\S)/gm);

    if (!match) {
        return rawString;
    }

    const minIndent = Math.min.apply(Math, match.map(x => x.length));

    const reMinIndent = new RegExp(`^[ \\t]{${minIndent}}`, 'gm');

    let strReindented = rawString;
    if (minIndent > 0) {
        strReindented = rawString.replace(reMinIndent, '');
    }

    return strReindented.trim();
}//stripIndent()

function snippet (raw) {
    // https://regex101.com/r/hKMzZP/4
    let normalized = raw.replace(/(\s+^\s+$|\s+(?=>))/gm, '');
    return stripIndent(normalized);
}

export default {
    snippet,
};
