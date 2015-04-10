var gulp = require('gulp'),
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint');
 
gulp.task('webserver', function() {
	connect.server({
		root: 'app',
		livereload: true
	});
});

gulp.task('eslint', function() {
    gulp
        .src(['app/js/**/*.js'])
        .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(eslint.formatEach('stylish', process.stderr))
    ;
});
 
gulp.task('default', ['webserver']);
