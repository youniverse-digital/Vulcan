let gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    bs           = require('browser-sync').create(),
    autoprefixer = require('autoprefixer'),
    cssnano      = require('cssnano'),
    browserify   = require('browserify'),
    babelify     = require('babelify'),
    buffer       = require('vinyl-buffer'),
    watchify     = require('watchify'),
    rename       = require('gulp-rename'),
    source       = require('vinyl-source-stream');

let bundleConfig = {
    js: {
        src: './src/js/app.js',
        outputDir: './src/js/',
        outputFile: 'bundle.js'
    }
}

gulp.task('sync', function() {
    bs.init({
        server: {
            baseDir: "./src"
        }
    })
})

let bundler = watchify(browserify(bundleConfig.js.src))
    .transform(babelify, { plugins: ["transform-es2015-modules-commonjs"], presets : ['es2015'] });

gulp.task('bundle', function() {
    bundle(bundler);
})

bundler.on('update', bundle);

function bundle() {
    console.log('Recompiling JS...');
    bundler
        .bundle()
        .pipe(source(bundleConfig.js.src))
        .pipe(buffer())
        .pipe(rename(bundleConfig.js.outputFile))
        .pipe(gulp.dest(bundleConfig.js.outputDir))
        .on('error', function(err) {
            console.log("An error occured during transpilation. Error - ");
            console.log(err.toString());
        })
}

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

gulp.task('watch', ['sync', 'bundle'], function() {
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('src/**/*.html').on('change', bs.reload);
    gulp.watch('src/js/bundle.js').on('change', bs.reload);
})