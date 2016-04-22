'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var lintspaces = require('gulp-lintspaces');
var git = require('gulp-git');
var fs = require('fs');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();


gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('version', function () {
  git.exec({args : 'describe'}, function (err, stdout) {
    if (err) throw err;
    fs.writeFile('src/app/index.version.js','(function () { \'use strict\'; angular.module(\'vector\').constant(\'version\', { \'id\': \'{version}\' }); })();'.replace('{version}', stdout.substring(0, stdout.length - 1)));
  });
});

gulp.task('lintspaces', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(lintspaces({
            editorconfig: '.editorconfig',
            ignores: [
                'js-comments'
            ]
        }))
        .pipe(lintspaces.reporter());
});

gulp.task('scripts', ['version'], function() {
  return buildScripts();
});

function buildScripts() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size())
};
