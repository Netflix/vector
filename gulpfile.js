'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var eslint = require('gulp-eslint');
var git = require('git-rev')
var fs = require('fs');
var p = require('./package.json')

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components'
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('version', function () {
  git.short(function (commit) {
    fs.writeFile('src/app/app.version.js','(function () { \'use strict\'; angular.module(\'vector.version\').constant(\'vectorVersion\', { \'id\': \'{version}\' }); })();'.replace('{version}', p.version + ' # ' + commit));
  })
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('eslint', function() {
    gulp
        .src(['src/app/**/*.js'])
        .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(eslint.formatEach('stylish', process.stderr))
    ;
});
