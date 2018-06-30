'use strict';

var path = require('path');

var conf = {
  paths: { src: 'src' },
  vendorJs: [
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
}

var _ = require('lodash');

var pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

function listFiles() {
  var patterns = conf.vendorJs.concat([
      'node_modules/angular-mocks/angular-mocks.js',
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
    ]).concat(pathSrcHtml);

  var files = patterns.map(function(pattern) {
    return {
      pattern: pattern
    };
  });
  files.push({
    pattern: path.join(conf.paths.src, '/assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    ngHtml2JsPreprocessor: {
      stripPrefix: conf.paths.src + '/',
      moduleName: 'vector'
    },

    logLevel: 'WARN',

    frameworks: ['phantomjs-shim', 'jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-phantomjs-shim',
      'karma-coverage',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    reporters: ['progress'],

    proxies: {
      '/assets/': path.join('/base/', conf.paths.src, '/assets/')
    }
  };

  // This is the default preprocessors configuration for a usage with Karma cli
  // The coverage preprocessor is added in gulp/unit-test.js only for single tests
  // It was not possible to do it there because karma doesn't let us now if we are
  // running a single test or not
  configuration.preprocessors = {};
  pathSrcHtml.forEach(function(path) {
    configuration.preprocessors[path] = ['ng-html2js'];
  });

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
