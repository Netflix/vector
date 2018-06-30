'use strict';

var path = require('path');

module.exports = function(config) {
  var configuration = {
    files: [
      // required dependencies
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      // core service dependencies
      'src/app/components/**/*.service.js',
      'src/app/components/**/*.module.js',
      'src/app/components/**/*.model.js',
      // tests
      'src/app/**/*.spec.js'
    ],

    singleRun: true,

    autoWatch: false,

    logLevel: 'INFO',

    frameworks: ['phantomjs-shim', 'jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join('src', '/**/!(*.html|*.spec|*.mock).js')]
    },

    browsers : ['PhantomJS'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    reporters: ['progress'],

    proxies: {
      '/assets/': path.join('/base/', 'src', '/assets/')
    }
  };

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
