var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var uglify = require('uglify-es');
var pump = require('pump');
var composer = require('gulp-uglify/composer');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');
var hash_src = require('gulp-hash-src');

var minify = composer(uglify, console);


gulp.task('views', function(cb) {
	pump([
		gulp.src('./static/views/*.js'),
		sourcemaps.init(),
		concat('views.js'),
		sourcemaps.write(),
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

gulp.task('index', function(cb){
	pump([
		gulp.src(['./static/common.js', './static/views/*.js', './static/index.js']),
		sourcemaps.init(),
		concat('index.js'),
		minify(),
		sourcemaps.write('./srcmaps'),
		gulp.dest('./dist/')
	], cb)
});

gulp.task('gm', function(cb){
	pump([
		gulp.src(['./static/common.js', './static/views/*.js', './static/gm.js']),
		sourcemaps.init({ loadMaps: true }),
		concat('gm.js'),
		minify(),
		sourcemaps.write('./srcmaps'),
		gulp.dest('./dist/')
	], cb)
});

gulp.task('cache', ['index', 'gm'], function(cb) {
	pump([
		gulp.src(['./dist/**/*.html']),
		hash_src({
			build_dir: './dist',
			src_path: './static'
		}),
		gulp.dest('./dist/')
	], cb)
})

gulp.task('zip', ['index', 'gm', 'cache'], function(cb) {
	pump([
		gulp.src(['./dist/**/*.js', './dist/**/*.css', './dist/**/*.html']),
		gzip({
			append: true,
			threshold: '1kb',
			deleteMode: 'dist',
			skipGrowingFiles: true
		}),
		gulp.dest('./dist/')
	], cb)
})

gulp.task('default', ['css', 'html', 'images', 'index', 'gm', 'cache', 'zip'], function() {
	
});

gulp.task('watch', function() {
	gulp.watch('./static/**/*', ['default']);
});