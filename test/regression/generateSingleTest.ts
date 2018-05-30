export default function (browser: string, component: string, depth: number) {
    const parentDirectories = Array(depth).fill('../').join('');
    return `import { regressionTest } from "${parentDirectories}built/regression/runSingleTest"; regressionTest("${browser}", "${component}");`
}
