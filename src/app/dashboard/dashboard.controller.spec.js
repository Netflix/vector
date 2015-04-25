'use strict';

/* Controller Tests */

describe('DashboardCtrl', function() {

  beforeEach(module('app', function($provide) {
    // Output messages
    $provide.value('$log', console);
  }));

  var $controller, $rootScope, $log, DashboardService;

  beforeEach(inject(function(_$controller_, _$rootScope_, _$log_, _DashboardService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $log = _$log_;
    DashboardService = _DashboardService_;
  }));

  it('should not be null' , function () {
    var $scope, route, routeParams, widgetDefinitions, widgets, controller;

    $scope = $rootScope.$new();
    route = {
      current: {
        $$route: {
          originalPath: "/empty"
        }
      }
    };
    routeParams = {
      host: null
    };
    widgetDefinitions = [];
    widgets = [];
    controller = $controller('DashboardCtrl', { $scope: $scope, $rootScope: $rootScope, $log: $log, $route: route, $routeParams: routeParams, widgetDefinitions: widgetDefinitions, defaultWidgets: widgets, emptyWidgets: widgets, DashboardService: DashboardService });

    expect(controller).toNotBe(null);
  });

  it('should initialize properties', function() {
    var $scope, route, routeParams, widgetDefinitions, widgets, controller;

    $scope = $rootScope.$new();
    route = {
      current: {
        $$route: {
          originalPath: "/empty"
        }
      }
    };
    routeParams = {
      host: null
    };
    widgetDefinitions = [];
    widgets = [];
    controller = $controller('DashboardCtrl', { $scope: $scope, $rootScope: $rootScope, $log: $log, $route: route, $routeParams: routeParams, widgetDefinitions: widgetDefinitions, defaultWidgets: widgets, emptyWidgets: widgets, DashboardService: DashboardService });

    expect($scope.properties.host).toEqual('');
  });

});
