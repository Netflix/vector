module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/bower_components/jquery/jquery.min.js',
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/bower_components/jquery-ui/jquery-ui.min.js',
      'app/bower_components/angular/angular.min.js',
      'app/bower_components/angular-route/angular-route.min.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
      'app/bower_components/angular-ui-sortable/sortable.js',
      'app/bower_components/angular-ui-dashboard/dist/angular-ui-dashboard.js',
      'app/bower_components/d3/d3.min.js',
      'app/bower_components/nvd3/nv.d3.min.js',
      'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min.js',
      'app/bower_components/angular-flash/dist/angular-flash.min.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
