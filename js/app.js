/**!
 *
 *  Copyright 2015 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

/*jslint node: true */
/*global angular*/

'use strict';

/* App Module */

var app = angular.module('app', [
    'ngRoute',
    'ui.dashboard',
    'app.controllers',
    'app.datamodels',
    'app.widgets',
    'app.directives',
    'app.services',
    'app.factories',
    'app.filters',
    'vector.config',
    'nvd3ChartDirectives',
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            title: 'Dashboard - Vector',
            reloadOnSearch: false
        })
        .when('/empty', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            title: 'Dashboard - Vector',
            reloadOnSearch: false
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.config(['flashProvider', function (flashProvider) {
    flashProvider.errorClassnames.push('alert-danger');
}]);
