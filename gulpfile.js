var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var concatJs = require('gulp-concat');
var rev = require('gulp-rev'); // add md5 suffix to the file
var revCollector = require('gulp-rev-collector');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('less', function() {
  return watch('./public/less/*.less', function() {
    //watch less file,conver to css when less content change
    gulp
      .src('./public/less/*.less')
      .pipe(less())
      .pipe(gulp.dest('./public/css'));
  });
});

gulp.task('clean', function(cb) {
  return del(['./public/dist/css', './public/dist/js', './public/dist/admin'], cb);
});

gulp.task('css', function() {
  return (
    gulp
      .src('./public/css/*.css')
      .pipe(cleanCss())
      .pipe(concatCss('index.css'))
      .pipe(postcss([autoprefixer()]))
      .pipe(minifyCss())
      // .pipe(rename({suffix: '.min'}))
      .pipe(rev())
      .pipe(gulp.dest('./public/dist/css'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./public/rev/css'))
  );
});

gulp.task('js', function() {
  return (
    gulp
      .src('./public/js/*.js')
      .pipe(uglify())
      // .pipe(rename({suffix: '.min'}))
      .pipe(rev())
      .pipe(gulp.dest('./public/dist/js'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./public/rev/js'))
  );
});

gulp.task('admin', function() {
  return browserify({
    entries: './public/admin/index', //entries file name
    debug: true, // set true so the bundle file can generate sourcemap
  })
    .transform(babelify, {
      // same as the .babelrc
      plugins: ['transform-runtime'],
      presets: [
        'es2015', //convert to es5
        'stage-0', //es7
        'react', //the jsx of react
      ],
    })
    .bundle() //merge
    .pipe(source('index.js'))
    .pipe(rename({ suffix: '.bundle' })) // rename the file
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true })) //External sourcemap file
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/dist/admin/')); //distination file
});

gulp.task('rev', ['css', 'js', 'admin'], function() {
  return gulp
    .src(['./public/rev/**/*.json', './views/**/*.html']) //add md5 suffix to js and css file, replace the link of html as well
    .pipe(
      revCollector({
        replaceReved: true,
        dirReplacements: {
          '/css': '/dist/css',
          '/js': '/dist/js',
          '/admin': '/dist/admin',
        },
      }),
    )
    .pipe(gulp.dest('./dist_views'));
});

gulp.task('default', ['rev']);
