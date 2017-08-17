var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');


gulp.task('default', ['styles', 'serve']);

gulp.task('images', function() {
  return gulp.src('src/images/*.+(png|jpg|jpeg|gif|svg)')
      .pipe(cache(imagemin()))
      .pipe(gulp.dest('build/images'))
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });

    gulp.watch('./src/stylesheets/sass/*.scss', ['styles']);
    gulp.watch('./src/js/*.js').on('change', browserSync.reload);
    gulp.watch('./src/*.html').on('change', browserSync.reload);

});

gulp.task('styles', function() {
    gulp.src('./src/stylesheets/sass/master.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/stylesheets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(useref())

        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))

        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))

        .pipe(gulp.dest('build'))
});
