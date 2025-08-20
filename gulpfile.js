var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
// var babel = require('gulp-babel');

var paths = {
  styles: {
    src: 'sass/**/*.scss',
    dest: './dist'
  },
  scripts: {
    src: 'js/**/*.js',
    dest: './dist'
  }
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename('main1.css'))
    .pipe(gulp.dest('./dist'));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    // .pipe(babel())
    .pipe(rename('main.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.styles.src, styles);
}

var build = gulp.parallel(styles);

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

exports.default = build;