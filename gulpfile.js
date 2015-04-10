var gulp = require('gulp'),
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    tar = require('gulp-tar'),
    bower = require('gulp-bower');

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

gulp.task('bower', function() {
  return bower()
});

gulp.task('dist', ['bower'], function () {
    return gulp.src('app/**/*')
        .pipe(tar('app.tar'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['webserver']);
