var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssimport = require("gulp-cssimport");
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');


gulp.task('default', ['sass', 'serve']);

gulp.task('build', function() {
    runSequence('clean:build', 'sass', 'useref', 'images', 'favicon', 'fonts', 'htmlmin');
});

gulp.task('clean:build', function() {
    return del.sync('build');
})

gulp.task('cache:clear', function() {
    return cache.clearAll()
})

gulp.task('favicon', function() {
  return gulp.src('src/favicon.ico')
      .pipe(gulp.dest('build/'))
})

gulp.task('fonts', function() {
    return gulp.src('src/fonts**/**/**/*')
        .pipe(gulp.dest('build/'))
})

gulp.task('htmlmin', function() {
    return gulp.src('build/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build'));
})

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

    gulp.watch('./src/stylesheets/sass/*.scss', ['sass']);
    gulp.watch('./src/js/*.js').on('change', browserSync.reload);
    gulp.watch('./src/*.html').on('change', browserSync.reload);

});

gulp.task('sass', function() {
    gulp.src('./src/stylesheets/sass/master.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(cssimport())
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

    // Minifies only if it's a CSS file, also fix url paths for background images
    .pipe(gulpIf('*.css', cssnano({
            discardComments: {removeAll: true}
        })).pipe(replace('../../images', '../images')))

    .pipe(gulp.dest('build'))
});
