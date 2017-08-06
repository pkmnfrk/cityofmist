var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var uglify = require('uglify-es');
var pump = require('pump');
var composer = require('gulp-uglify/composer');
var sourcemaps = require('gulp-sourcemaps');

var minify = composer(uglify, console);


gulp.task('views', function(cb) {
	pump([
		gulp.src('./static/views/*.js'),
		concat('views.js'),
		gulp.dest('./build/')
	], cb)
  
});

gulp.task('css', function(){
	gulp.src('./static/*.css')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('html', function(){
	gulp.src('./static/*.html')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('images', function(){
	gulp.src(['./static/**/*.png', './static/**/*.jpg', './static/**/*.gif'])
		.pipe(gulp.dest('./dist/'));
});

gulp.task('index', ['views'], function(cb){
	pump([
		gulp.src(['./static/common.js', './build/views.js', './static/index.js']),
		sourcemaps.init(),
		concat('index.js'),
		minify(),
		sourcemaps.write('./maps'),
		gulp.dest('./dist/')
	], cb)
});

gulp.task('gm', ['views'], function(cb){
	pump([
		gulp.src(['./static/common.js', './build/views.js', './static/gm.js']),
		sourcemaps.init(),
		concat('index.js'),
		minify(),
		sourcemaps.write('./maps'),
		gulp.dest('./dist/')
	], cb)
});

gulp.task('default', ['css', 'html', 'images', 'index', 'gm'], function() {
	
});

gulp.task('watch', function() {
	gulp.watch('./static/**/*', ['default']);
});