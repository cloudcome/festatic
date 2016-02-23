var gulp = require('gulp');
var cssmin = require('gulp-minify-css');
var imgmin = require('gulp-imagemin');
var jsmin = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var livereload = require('gulp-livereload');



gulp.task('default', function(){
	var server = livereload();

	gulp.watch('./webroot/**/*.*', function(file){
		server.changed(file.path);
	});
});







