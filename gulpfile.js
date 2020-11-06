const gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    minifyjs = require('gulp-js-minify'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    smartgrid = require('smart-grid');


const paths = {
    dev: {
        html: 'src/index.html',
        styles: 'src/scss/**/*.scss',
        script: 'src/script/**/*.js',
        images: 'src/images/**/*'
    },
    build: {
        html: './',
        root: 'dist',
        styles: 'dist/css',
        script: 'dist/script',
        images: 'dist/img'
    }
};

const buildHtml = () => (
    gulp.src(paths.dev.html)
        .pipe(gulp.dest(paths.build.html))
);
const buildStyles = () => (
    gulp.src(paths.dev.styles)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gcmq())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest(paths.build.styles))
);
const buildJS = () => (
    gulp.src(paths.dev.script)
        .pipe(concat('scripts.min.js'))
        .pipe(minifyjs())
        .pipe(gulp.dest(paths.build.script))
);
const buildImages = () => (
    gulp.src(paths.dev.images)
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 50, progressive: true}),
            imagemin.optipng({optimizationLevel: 7})
        ]))
        .pipe(gulp.dest(paths.build.images))
);
const serve = () => {
    gulp.watch(paths.dev.html, buildHtml);
    gulp.watch(paths.dev.styles, buildStyles);
    gulp.watch(paths.dev.script, buildJS);

    return browserSync.init({
        server: {
            baseDir: paths.build.html
        },
        files: [
            {match: paths.build.root, fn: this.reload}
        ]
    })
};

// ********** S M A R T - G R I D ********** //

const grid = (done) => {
    delete require.cache[require.resolve("./gulpfile.js")];
    let settings = require("./smartgrid.js");
    smartgrid("./src/scss", settings);
    done();
};

/************* TASKS ************/

gulp.task('grid', grid);

gulp.task('clean', () => (
    gulp.src(paths.build.root, {allowEmpty: true})
        .pipe(clean())
));

gulp.task('build', gulp.series(
    buildHtml,
    buildStyles,
    buildJS,
    buildImages
));

gulp.task('dev', gulp.series(
    'clean',
    'build',
    serve
));