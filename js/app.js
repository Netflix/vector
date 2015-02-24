/*jslint node: true */
/*global angular*/

'use strict';

/* App Module */

var app = angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.datamodels',
    'app.widgets',
    'app.directives',
    'app.services',
    'app.factories',
    'app.filters',
    'nvd3ChartDirectives',
    'ui.dashboard',
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/index.html',
            controller: 'IndexCtrl',
            reloadOnSearch: false
        })
        .when('/default', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            reloadOnSearch: false
        })
        .when('/clean', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            reloadOnSearch: false
        })
        .when('/java', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            reloadOnSearch: false
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.config(['flashProvider', function (flashProvider) {
    flashProvider.errorClassnames.push('alert-danger');
}]);