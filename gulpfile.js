const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const srcPath = 'src';
const compilePath = 'dist';

gulp.task('compile:styles', function () {
    let sources = [
        `${srcPath}/styles/bootstrap.less`,
        `${srcPath}/styles/helix.less`,
    ];
    return gulp.src(sources)
        .pipe(plugins.plumber(function (err) {
            plugins.util.log(err.message);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.concat('helix-ui.css'))
        .pipe(gulp.dest(compilePath))
        .pipe(plugins.csso({ sourceMap: true }))
        .pipe(plugins.rename('helix-ui.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(compilePath));
});

gulp.task('compile', function (cb) {
    runSequence([
        'compile:styles'
    ], cb);
});

gulp.task('watch', function () {
    gulp.watch(`${srcPath}/styles/**/*.less`, ['compile']);
    //TODO: watch `src/components/**/*.js` for changes
});


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
