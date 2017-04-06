var gulp = require('gulp');
var less = require('gulp-less');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var babel = require("gulp-babel");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var uglify =require('gulp-uglify');
var minifyCss =require('gulp-minify-css');
var rename = require('gulp-rename');
var concatJs = require('gulp-concat');
var rev = require('gulp-rev');//对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');  
var watch = require('gulp-watch');
var path = require('path');
 
gulp.task('less', function () {
    return watch('./public/less/*.less', function (){//监控到less内容一旦有变化，马上转换为css
        gulp.src('./public/less/*.less')
    	.pipe(less())
    	.pipe(gulp.dest('./public/css'));
    });
});

gulp.task('css', function() {
    return gulp.src('./public/css/*.css')
    	.pipe(cleanCss())
    	.pipe(concatCss("index.css"))
    	.pipe(postcss([ autoprefixer()]))
        .pipe(minifyCss())
    	// .pipe(rename({suffix: '.min'}))
    	.pipe(rev())
    	.pipe(gulp.dest('./public/dist/css'))
    	.pipe(rev.manifest())
        .pipe(gulp.dest('./public/rev/css'));
});

gulp.task('js',function(){
	return gulp.src('./public/js/*.js')
	    .pipe(babel({presets: ['es2017'] }))
	    // .pipe(uglify())
	    // .pipe(rename({suffix: '.min'})
	    .pipe(rev())
	    .pipe(gulp.dest('./public/dist/js'))
    	.pipe(rev.manifest())
        .pipe(gulp.dest('./public/rev/js'));
});

gulp.task('rev', ["css","js"],function () {
    return gulp.src(['./public/rev/**/*.json', './views/**/*.html'])//为js和css加md5后缀，更新html里面的链接
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/css': '/dist/css',
                '/js': '/dist/js'
            }
        }))
        .pipe( gulp.dest('./dist_views') );
});

gulp.task("default", ["rev"]);