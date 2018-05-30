module.exports = (browserName, component, depth) => {
    const parentDirectories = Array(depth).fill('../').join('');
    return `const util = require("${parentDirectories}common/util"); const regressionTest = require("${parentDirectories}regression/runSingleTest"); regressionTest("${browserName}", "${component}", util);`
}
