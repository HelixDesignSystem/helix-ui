module.exports = (browser, component, buildIdentifier) => {
    return `import { regressionTest } from "../regression/runSingleTest"; regressionTest("${browser}", "${component}", "${buildIdentifier}");`
}
