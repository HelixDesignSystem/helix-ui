module.exports = (browser, component, depth) => {
    const parentDirectories = Array(depth).fill('../').join('');
    return `import { regressionTest } from "${parentDirectories}regression/runSingleTest"; regressionTest("${browser}", "${component}");`
}
