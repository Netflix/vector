/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

/**
 * Most straightforward way to load dependencies in order with gulp
 * Need to move to webpack
 */
exports.vendorCss = [
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "node_modules/angular-toastr/dist/angular-toastr.css",
  "node_modules/animate.css/animate.css",
  "node_modules/malhar-angular-dashboard/dist/malhar-angular-dashboard.css",
  "node_modules/nvd3/build/nv.d3.css",
  "node_modules/font-awesome/css/font-awesome.css"
]

exports.vendorJs = [
  "node_modules/jquery/dist/jquery.js",
  "node_modules/angular/angular.js",
  "node_modules/angular-route/angular-route.js",
  "node_modules/bootstrap/dist/js/bootstrap.js",
  "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
  "node_modules/lodash/lodash.js",
  "node_modules/angular-toastr/dist/angular-toastr.tpls.js",
  "node_modules/moment/moment.js",
  "node_modules/jquery-ui-dist/jquery-ui.js",
  "node_modules/angular-ui-sortable/dist/sortable.js",
  "node_modules/malhar-angular-dashboard/dist/malhar-angular-dashboard.js",
  "node_modules/d3/d3.js",
  "node_modules/nvd3/build/nv.d3.js",
  "node_modules/angular-sanitize/angular-sanitize.js"
]

exports.vendorFonts = [
  "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
  "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
  "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
  "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
  "node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
  "node_modules/font-awesome/fonts/fontawesome-webfont.eot",
  "node_modules/font-awesome/fonts/fontawesome-webfont.svg",
  "node_modules/font-awesome/fonts/fontawesome-webfont.ttf",
  "node_modules/font-awesome/fonts/fontawesome-webfont.woff",
  "node_modules/font-awesome/fonts/fontawesome-webfont.woff2",
  "node_modules/font-awesome/fonts/FontAwesome.otf"
]
