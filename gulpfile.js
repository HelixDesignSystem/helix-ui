const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

/* ===== BUMP ===== */
const bumpFiles = [ './package.json' ];
[
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
].forEach( (ilk) => {
    gulp.task(`bump:${ilk}`, function () {
        gulp.src(bumpFiles)
            .pipe(plugins.bump({ type: ilk }))
            .pipe(gulp.dest('./'));
    });
});
gulp.task('bump', [ 'bump:patch' ]);
