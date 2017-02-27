var gulp = require('gulp');
var less = require('gulp-less');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var path = require('path');
 
gulp.task('less', function () {
  return gulp.src('./public/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('css', function() {
    return gulp.src('./public/css/*.css')
    .pipe(cleanCss())
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./public/dist/css'));
});