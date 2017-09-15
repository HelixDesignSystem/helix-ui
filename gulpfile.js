const bump = require('gulp-bump');
const gulp = require('gulp');

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
            .pipe(bump({ type: ilk }))
            .pipe(gulp.dest('./'));
    });
});
gulp.task('bump', [ 'bump:patch' ]);
