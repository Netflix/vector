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
exports.vendorFiles = [
  "node_modules/jquery/dist/jquery.js",
  "node_modules/angular/angular.js",
  "node_modules/angular-route/angular-route.js",
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "node_modules/bootstrap/dist/js/bootstrap.js",
  "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
  "node_modules/lodash/lodash.js",
  "node_modules/angular-toastr/dist/angular-toastr.css",
  "node_modules/angular-toastr/dist/angular-toastr.tpls.js",
  "node_modules/animate.css/animate.css",
  "node_modules/moment/moment.js",
  "node_modules/jquery-ui-dist/jquery-ui.js",
  "node_modules/angular-ui-sortable/dist/sortable.js",
  "node_modules/malhar-angular-dashboard/dist/malhar-angular-dashboard.css",
  "node_modules/malhar-angular-dashboard/dist/malhar-angular-dashboard.js",
  "node_modules/d3/d3.js",
  "node_modules/nvd3/build/nv.d3.css",
  "node_modules/nvd3/build/nv.d3.js",
  "node_modules/font-awesome/css/font-awesome.css",
  "node_modules/angular-sanitize/angular-sanitize.js"
]

exports.fontNodeFiles = {
  "overrides": {
    "bootstrap": [
      "dist/css/bootstrap.css",
      "dist/js/bootstrap.js",
      "dist/fonts/glyphicons-halflings-regular.eot",
      "dist/fonts/glyphicons-halflings-regular.svg",
      "dist/fonts/glyphicons-halflings-regular.ttf",
      "dist/fonts/glyphicons-halflings-regular.woff",
      "dist/fonts/glyphicons-halflings-regular.woff2"
    ],
    "font-awesome": [
      "css/font-awesome.css",
      "fonts/fontawesome-webfont.eot",
      "fonts/fontawesome-webfont.svg",
      "fonts/fontawesome-webfont.ttf",
      "fonts/fontawesome-webfont.woff",
      "fonts/fontawesome-webfont.woff2",
      "fonts/FontAwesome.otf"
    ]
  }
}
