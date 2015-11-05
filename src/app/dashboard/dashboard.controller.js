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
    function DashboardCtrl($document, $rootScope, $log, $route, $routeParams, $location, widgetDefinitions, widgets, embed, DashboardService, vectorVersion) {
        var vm = this;
        var path = $route.current.$$route.originalPath;
        var widgetsToLoad = widgets;

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

            if ($routeParams.protocol) {
                $rootScope.properties.protocol = $routeParams.protocol;
                $log.info('Protocol: ' + $routeParams.protocol);
            }

            if ($routeParams.host) {
                vm.inputHost = $routeParams.host;
                $log.info('Host: ' + $routeParams.host);
                if ($routeParams.hostspec) {
                    $rootScope.properties.hostspec = $routeParams.hostspec;
                    $log.info('Hostspec: ' + $routeParams.hostspec);
                }
                DashboardService.updateHost(vm.inputHost);
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

        if ($routeParams.widgets !== undefined ){
            var widgetNameArr = $routeParams.widgets.split(',') || [];
            widgetsToLoad = widgetNameArr.reduce(function(all, name){
                return all.concat(widgetDefinitions.filter(function(def){
                    return def.name === name;
                }));
            },[]);
        } else {
            var urlArr = widgets.reduce(function(all,item){
                all.push(item.name);
                return all;
            },[]).join();
            $location.search('widgets', urlArr);
        }

         vm.dashboardOptions = {
            hideToolbar: true,
            widgetButtons: false,
            hideWidgetName: true,
            hideWidgetSettings: true,
            widgetDefinitions: widgetDefinitions,
            defaultWidgets: widgetsToLoad
        };

        vm.version = vectorVersion.id;

        vm.embed = embed;

        // Export controller public functions
        vm.addWidgetToURL = function(widgetObj){
            var newUrl ='';
            if ($routeParams.widgets === undefined) {
                $routeParams.widgets = '';
            } else {
                newUrl = ',';
            }

            if (widgetObj.length){
                $routeParams.widgets = '';
                newUrl = widgetObj.reduce(function(all,item){
                    all.push(item.name);
                    return all;
                },[]).join();
            } else {
                newUrl = newUrl + widgetObj.name;
            }
            $location.search('widgets', $routeParams.widgets + newUrl);
        };
        vm.removeWidgetFromURL = function(widgetObj){
            var widgetNameArr = $routeParams.widgets.split(',') || [];
            for (var d=0; d< widgetNameArr.length; d++){
                if (widgetNameArr[d] === widgetObj.name){
                    widgetNameArr.splice(d,1);
                    break;
                }
            }
            if (widgetNameArr.length < 1){
                $location.search('widgets', null);
            } else {
                $location.search('widgets', widgetNameArr.toString());
            }
        };
        vm.removeAllWidgetFromURL = function(){
            $location.search('widgets', null);
        };
        vm.updateGlobalFilter = function(){
            DashboardService.updateGlobalFilter(vm.globalFilter);
        };
        vm.updateInterval = DashboardService.updateInterval;
        vm.updateHost = function() {
            DashboardService.updateHost(vm.inputHost);
        };
        vm.updateWindow = DashboardService.updateWindow;
        vm.globalFilter ='';
        vm.isHostnameExpanded = false;
        vm.inputHost = '';
        activate();
    }

    DashboardCtrl.$inject = [
        '$document',
        '$rootScope',
        '$log',
        '$route',
        '$routeParams',
        '$location',
        'widgetDefinitions',
        'widgets',
        'embed',
        'DashboardService',
        'vectorVersion'
    ];

    angular
        .module('app.controllers', [])
        .controller('DashboardController', DashboardCtrl);
})();
