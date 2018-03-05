let gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    bs           = require('browser-sync').create(),
    autoprefixer = require('autoprefixer'),
    cssnano      = require('cssnano');

gulp.task('sync', function() {
    bs.init({
        server: {
            baseDir: "./src"
        }
    })
})

gulp.task('css', function() {
    let processors = [
        autoprefixer,
        cssnano
    ];

    return gulp.src('./src/styles/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./src/styles'))
        .pipe(bs.stream());
})

gulp.task('reload', function() {
    bs.reload;
})

gulp.task('watch', ['sync'], function() {
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('src/**/*.html').on('change', bs.reload);
})