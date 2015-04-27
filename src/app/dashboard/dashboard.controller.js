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

(function () {
    'use strict';

    /**
    * @name DashboardCtrl
    * @desc Main dashboard Controller
    */
    function DashboardCtrl($document, $rootScope, $log, $route, $routeParams, widgetDefinitions, widgets, DashboardService) {
        var vm = this;
        var path = $route.current.$$route.originalPath;


        /**
        * @name visibilityChanged
        * @desc Pauses/resumes interval updates if window/tab is out of focus.
        */
        function visibilityChanged() {
            if ($document[0].hidden || $document[0].webkitHidden ||
                $document[0].mozHidden || $document[0].msHidden) {
                DashboardService.cancelInterval();
            } else {
                DashboardService.updateInterval();
            }
        }

        /**
        * @name activate
        * @desc Initiliazes DashboardController
        */
        function activate() {
            DashboardService.initializeProperties();

            if ($routeParams.host) {
                $rootScope.properties.host = $routeParams.host;
                $log.info('Host: ' + $routeParams.host);
                if ($routeParams.hostspec) {
                    $rootScope.properties.hostspec = $routeParams.hostspec;
                    $log.info('Hostspec: ' + $routeParams.hostspec);
                }
                DashboardService.updateHost();
            }

            // hack to deal with window/tab out of focus
            $document[0]
                .addEventListener('visibilitychange', visibilityChanged, false);
            $document[0]
                .addEventListener('webkitvisibilitychange', visibilityChanged, false);
            $document[0]
                .addEventListener('msvisibilitychange', visibilityChanged, false);
            $document[0]
                .addEventListener('mozvisibilitychange', visibilityChanged, false);

            $log.info('Dashboard controller initialized with ' + path + ' view.');
        }

         vm.dashboardOptions = {
            hideToolbar: true,
            widgetButtons: false,
            hideWidgetName: true,
            hideWidgetSettings: true,
            widgetDefinitions: widgetDefinitions,
            defaultWidgets: widgets
        };

        // Export controller public functions
        vm.updateInterval = DashboardService.updateInterval;
        vm.updateHost = DashboardService.updateHost;
        vm.updateWindow = DashboardService.updateWindow;
        vm.isHostnameExpanded = false;
        activate();
    }

    DashboardCtrl.$inject = [
        '$document',
        '$rootScope',
        '$log',
        '$route',
        '$routeParams',
        'widgetDefinitions',
        'widgets',
        'DashboardService'
    ];

    angular
        .module('app.controllers', [])
        .controller('DashboardController', DashboardCtrl);
})();
