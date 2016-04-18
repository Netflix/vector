/**!
 */
 (function () {
     'use strict';

     /**
     * @name ContainerMetadataService
     */
     function ContainerMetadataService($http, $rootScope, $q, $interval, $routeParams, $location, containerConfig, MetricListService) {

        var containerParsedFromQuerystring = false;

        /**
        * @name idDictionary
        * @desc
        */
        var idMap = {};
        function idDictionary(key){
            return idMap[parseId(key)];
        }

        /**
        * @name parseId
        * @desc parses different types of docker ID
        */
        function parseId(id){
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
        * @desc
        */
        function containerIdExist(id) {
            return (idMap[parseId(id)] !== undefined && idMap[parseId(id)] !== '');
        }

        /**
        * @name updateMetrics
        * @desc
        */
        function updateMetrics() {
            $rootScope.properties.containerList = getContainerList();

            //TODO: find a better way for parsing the container name from the query string just once.
            if (containerParsedFromQuerystring) {
                if(!checkContainerName($routeParams.container)) { // can't find the selected container in the list
                    $rootScope.properties.selectedContainer = '';
                }
            } else {
                if ($routeParams.container !== undefined){
                    if (checkContainerName($routeParams.container)) {
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
        var activeContainers;
        function initialize() {
            activeContainers = MetricListService.getOrCreateMetric('containers.cgroup');
            $rootScope.$on('updateMetrics', updateMetrics);
        }

        /**
        * @name resolveId
        * @desc
        */
        function resolveId(instanceKey) {
            //TODO: this should check if a function was defined and call it instead of checking a flag.
            if (containerConfig.externalAPI) {
                //make external api call here to resolve container id
                //need to set containerConfig.externalAPI to true in app.config.js
                return;
            } else {
                return instanceKey.substring(0,12);
            }
        }

        /**;
        * @name updateIdDictionary
        * @desc
        */
        function updateIdDictionary(){
            //TODO: implement better logic to add and remove items from idMap. Always creating a new object and resolving all names is expensive.
            idMap = activeContainers.data.reduce(function(obj, item) {
                obj[item.key] = resolveId(item.key);
                return obj;
            },{});
        }

        /**
        * @name getContainerList
        * @desc
        */
        function getContainerList(){
          return activeContainers.data.reduce(function(obj, item) {
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
        function checkContainerName(name, allowNoContainerSelect = true){
            if (allowNoContainerSelect) {
                return ($rootScope.properties.selectedContainer === '' || name.indexOf($rootScope.properties.selectedContainer) !== -1);
            } else {
                return (name.indexOf($rootScope.properties.selectedContainer) !== -1);
            }

        }

        /**
        * @name updateContainer
        * @desc
        */
        function updateContainer(){
            $location.search('container', $rootScope.properties.selectedContainer);
        };

        /**
        * @name updateContainerFilter
        * @desc
        */
        function updateContainerFilter() {
            $location.search('containerFilter', $rootScope.properties.containerFilter);
        };

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
