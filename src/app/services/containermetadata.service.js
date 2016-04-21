/**!
 *
 *  Copyright 2016 Netflix, Inc.
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

/*global _*/

 (function () {
     'use strict';

     /**
     * @name ContainerMetadataService
     */
     function ContainerMetadataService($http, $rootScope, $q, $interval, $routeParams, $location, vectorConfig, MetricListService) {

        var containerParsedFromQuerystring = false;

        /**
        * @name idDictionary
        * @desc
        */
        var idMap = {};
        function idDictionary(key) {
            return idMap[parseId(key)];
        }

        /**
        * @name parseId
        * @desc parses different types of docker ID
        */
        function parseId(id) {
            //handle regular docker
            if (id === null){
                return false;
            }
            if (id.indexOf('docker/') !==-1){
                id = id.split('/')[2];
            //handle systemd
            } else if (id.indexOf('/docker-') !==-1){
                id = id.split('-')[1].split('.')[0];
            }
            return id;
        }

        /**
        * @name clearIdDictionary
        * @desc
        */
        function clearIdDictionary() {
            idMap = {};
        }

        /**
        * @name containerIdExist
        * @desc returns true if id exists in the idMap
        */
        function containerIdExist(id) {
            return (idMap[parseId(id)] !== undefined && idMap[parseId(id)] !== '');
        }

        /**
        * @name updateMetrics
        * @desc
        */
        function updateMetrics() {
            updateIdDictionary();
            $rootScope.properties.containerList = getContainerList();

            //TODO: find a better way for parsing the container name from the query string just once.
            if (containerParsedFromQuerystring) {
                if($rootScope.properties.containerList.indexOf($routeParams.container) === -1) { // can't find the selected container in the list
                    $rootScope.properties.selectedContainer = '';
                }
            } else {
                if ($routeParams.container !== undefined) {
                    if ($rootScope.properties.containerList.indexOf($routeParams.container) !== -1) {
                        $rootScope.properties.selectedContainer = $routeParams.container;
                        $rootScope.flags.disableContainerSelectNone = true;
                        containerParsedFromQuerystring = true;
                    }
                } else {
                    containerParsedFromQuerystring = true;
                }
            }
        }

        /**;
        * @name initialize
        * @desc
        */
        var containerCgroups,
            containerNames;
        function initialize() {
            containerCgroups = MetricListService.getOrCreateMetric('containers.cgroup');
            containerNames = MetricListService.getOrCreateMetric('containers.name');
            $rootScope.$on('updateMetrics', updateMetrics);
        }

        /**
        * @name resolveId
        * @desc
        */
        function resolveId(instanceKey) {
            if (!vectorConfig.useCgroupId) {
                var instanceName = _.find(containerNames.data, function (el) {
                    return el.key === instanceKey;
                });
                if (instanceName) {
                    return instanceName.values[instanceName.values.length - 1].y;
                }
            }
            return instanceKey.substring(0,12);
        }

        /**;
        * @name updateIdDictionary
        * @desc
        */
        function updateIdDictionary(){
            //TODO: implement better logic to add and remove items from idMap. Always creating a new object and resolving all names is expensive.
            idMap = containerCgroups.data.reduce(function(obj, item) {
                obj[item.key] = resolveId(item.key);
                return obj;
            },{});
        }

        /**
        * @name getContainerList
        * @desc
        */
        function getContainerList() {
          return containerCgroups.data.reduce(function(obj, item) {
              obj.push(resolveId(item.key));
              return obj;
          },[]);
        }

        /**
        * @name checkContainerFilter
        * @desc
        */
        function checkContainerFilter(name){
            return ($rootScope.properties.containerFilter === '' || name.indexOf($rootScope.properties.containerFilter) !==-1);
        }

        /**
        * @name checkContainerName
        * @desc
        */
        function checkContainerName(name){
            return ($rootScope.properties.selectedContainer === '' || name.indexOf($rootScope.properties.selectedContainer) !== -1);
        }

        /**
        * @name updateContainer
        * @desc
        */
        function updateContainer(){
            $location.search('container', $rootScope.properties.selectedContainer);
        }

        /**
        * @name updateContainerFilter
        * @desc
        */
        function updateContainerFilter() {
            $location.search('containerFilter', $rootScope.properties.containerFilter);
        }

        return {
            idDictionary: idDictionary,
            getContainerList: getContainerList,
            updateIdDictionary: updateIdDictionary,
            clearIdDictionary: clearIdDictionary,
            checkContainerFilter: checkContainerFilter,
            containerIdExist: containerIdExist,
            checkContainerName: checkContainerName,
            updateContainer: updateContainer,
            updateContainerFilter: updateContainerFilter,
            initialize: initialize
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
