module.exports = (browser, component) => {
    return `import { regressionTest } from "../regression/runSingleTest"; regressionTest("${browser}", "${component}");`
}
