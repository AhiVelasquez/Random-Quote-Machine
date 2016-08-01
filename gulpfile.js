var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var htmlmin         = require('gulp-htmlmin');
var autoprefixer    = require('gulp-autoprefixer');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var css             = require('gulp-clean-css');
var uglify          = require('gulp-uglify');

// Vaariabili custom
var sourcePath      = {
                        "css" :  "src/css/**/*.css",
                        "js"  : "src/js/**/*.js",
                        "img" : "src/img/*.*",
                        "sass": "src/sass/**/*.scss",
                        "html": "src/*.html"
                      };

var destPath        = {
                        "dev" : "build/dev/",
                        "prod": "build/production/"
                      };

var destinazione, htmlCollapse, scope = process.env.NODE_ENV || "dev";

if ( scope === "dev") {
  destinazione = destPath.dev;
  htmlCollapse = false;
} else {
  destinazione = destPath.prod;
  htmlCollapse = true;
}

// HTML Minify and inject into browser
gulp.task('html', function() {
  return gulp.src(sourcePath.html)
    .pipe(htmlmin({collapseWhitespace: htmlCollapse}))
    .pipe(gulp.dest(destinazione))
    .pipe(browserSync.stream());
});

// CSS Minify, concat and inject into browser
gulp.task('css', function(){
  gulp.src(sourcePath.css)
      .pipe(css())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
      .pipe(concat('style.css'))
      .pipe(gulp.dest(destinazione + 'css'))
      .pipe(browserSync.stream());
});

// SASS compilato & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(sourcePath.sass)
        .pipe(sass())
        .pipe(gulp.dest(destinazione + "css"))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js', function(){
  gulp.src(sourcePath.js)
      .pipe(uglify())
      .pipe(gulp.dest(destinazione + "js"))
      .pipe(browserSync.stream());
});

// Img
gulp.task('img', function(){
  gulp.src(sourcePath.img)

      .pipe(browserSync.stream());
});

// Server + watching
gulp.task('server', ['sass'], function() {

    browserSync.init({
        server: destinazione
    });

    gulp.watch(sourcePath.sass, ['sass']);
    gulp.watch(sourcePath.css, ['css']);
    gulp.watch(sourcePath.js, ['js']);
    gulp.watch(sourcePath.img, ['img']);
    gulp.watch(sourcePath.html, ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['server', 'html', 'css', 'js', 'img']);
gulp.task('prod', ['server', 'html','css']);
