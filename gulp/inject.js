'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'vendor-js', 'vendor-css'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });

  var vendorScripts = gulp.src(conf.vendorFiles).pipe($.filter('*.js'))
  var vendorStyles = gulp.src(conf.vendorFiles).pipe($.filter('*.css'))

  var appScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  var vendorOptions = {
      starttag: '<!-- inject:vendor:{{ext}} -->',
      ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve'), conf.paths.dist],
      addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(vendorScripts, vendorOptions))
    .pipe($.inject(vendorStyles, vendorOptions))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(appScripts, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
