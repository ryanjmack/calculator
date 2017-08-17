var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


gulp.task('styles', function() {
    gulp.src('./src/stylesheets/sass/master.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/stylesheets/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('default', ['styles', 'serve']);

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
