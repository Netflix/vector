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

/*jslint node: true*/
/*global angular*/
/*jslint browser: true*/
/*jslint nomen: true */
/*global $, jQuery, alert, _*/

'use strict';

/* Controllers */


// hack to deal with window/tab out of focus
var hidden,
    visibilityChange;

if (document.hidden !== undefined) { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (document.mozHidden !== undefined) {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (document.msHidden !== undefined) {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (document.webkitHidden !== undefined) {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

var controllers = angular.module('app.controllers', []);

controllers.controller('DashboardCtrl', function ($scope, $rootScope, $log, $route, $routeParams, widgetDefinitions, defaultWidgets, emptyWidgets, DashboardService) {
    var path = $route.current.$$route.originalPath;

    $log.info("Dashboard controller initialized with " + path + " view.");

    $scope.dashboardOptions = {
        hideToolbar: true,
        widgetButtons: false,
        hideWidgetName: true,
        hideWidgetSettings: true,
        widgetDefinitions: widgetDefinitions
    };

    switch (path) {
    case '/empty':
        $log.info("Loading empty dashboard.");
        $scope.dashboardOptions.defaultWidgets = emptyWidgets;
        break;
    default:
        $log.info("Loading default dashboard.");
        $scope.dashboardOptions.defaultWidgets = defaultWidgets;
    }

    $scope.updateInterval = DashboardService.updateInterval;

    $scope.updateHost = DashboardService.updateHost;

    $scope.updateWindow = DashboardService.updateWindow;

    DashboardService.initializeProperties();

    if ($routeParams.host) {
        $log.info("Host: " + $routeParams.host);
        $rootScope.properties.host = $routeParams.host;
        DashboardService.updateHost();
    }

    // hack to deal with window/tab out of focus
    document.addEventListener(visibilityChange, function () {
        if (document[hidden]) {
            DashboardService.cancelInterval();
        } else {
            DashboardService.updateInterval();
        }
    }, false);

});
