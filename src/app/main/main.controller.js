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
    * @name MainCtrl
    * @desc Main Controller
    */
    function MainCtrl($document, $rootScope, $log, $route, $routeParams, $location, widgetDefinitions, widgets, embed, version, DashboardService, ContainerMetadataService, ModalService) {

        var vm = this,
            widgetsToLoad = widgets;

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
        * @desc Initiliazes MainCtrl
        */
        function activate() {
            DashboardService.initialize();

            if ($routeParams.protocol) {
                $rootScope.properties.protocol = $routeParams.protocol;
            }

            if ($routeParams.host) {
                vm.inputHost = $routeParams.host;
                if ($routeParams.hostspec) {
                    $rootScope.properties.hostspec = $routeParams.hostspec;
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

            if (angular.isDefined($routeParams.widgets)){
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

            if (angular.isDefined($routeParams.containerFilter)){
                $rootScope.properties.containerFilter =  $routeParams.containerFilter;
            }

            vm.dashboardOptions = {
                hideToolbar: true,
                widgetButtons: false,
                hideWidgetName: true,
                hideWidgetSettings: false,
                widgetDefinitions: widgetDefinitions,
                defaultWidgets: widgetsToLoad
            };
        }

        vm.version = version.id;

        vm.embed = embed;

        // Export controller public functions
        vm.addWidgetToURL = function(widgetObj){
            var newUrl ='';
            if (angular.isUndefined($routeParams.widgets)) {
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
                vm.removeAllWidgetFromURL();
            } else {
                $location.search('widgets', widgetNameArr.toString());
            }
        };

        vm.removeAllWidgetFromURL = function(){
            $location.search('widgets', null);
        };

        vm.resetDashboard = function(){

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Reset Dashboard',
                bodyText: 'Are you sure you want to reset the dashboard?'
            };

            ModalService.showModal({}, modalOptions).then(function() {
                $location.search('container', null);
                $location.search('containerFilter', null);
                $rootScope.flags.disableContainerSelectNone = false;
                $rootScope.properties.selectedContainer = '';
                $rootScope.properties.containerFilter = '';
                vm.dashboardOptions.loadWidgets([]);
                vm.removeAllWidgetFromURL();
            });
        };

        vm.updateHost = function() {
            DashboardService.updateHost(vm.inputHost);
            ContainerMetadataService.clearIdDictionary();
        };

        vm.addWidget = function(event, directive){
            event.preventDefault();
            if ( vm.checkWidgetType(directive) ) {
                vm.dashboardOptions.addWidget(directive);
                vm.addWidgetToURL(directive);
            }
        };

        vm.checkWidgetType = function(widgetObj) {
            if (angular.isDefined(widgetObj.requireContainerFilter) && widgetObj.requireContainerFilter === true && $rootScope.flags.disableContainerSelect === false && !$rootScope.flags.containerSelectOverride) {
              if ($rootScope.properties.selectedContainer === ''){

                  var modalOptions = {
                      closeButtonText: '',
                      actionButtonText: 'Ok',
                      headerText: 'Error: Container selection required.',
                      bodyText: 'This widget requires a container to be selected. Please select a container and try again.'
                  };

                  ModalService.showModal({}, modalOptions).then(function() {
                      $document.getElementById('selectedContainer').focus();
                  });

                  return false;
              }
            }
            return true;
        };

        vm.updateInterval = DashboardService.updateInterval;
        vm.updateContainer = ContainerMetadataService.updateContainer;
        vm.updateContainerFilter = ContainerMetadataService.updateContainerFilter;
        vm.inputHost = '';

        activate();
    }

    angular
        .module('main', [
            'dashboard',
            'widget',
            'containermetadata',
            'modal'
        ])
        .controller('MainController', MainCtrl);
})();
