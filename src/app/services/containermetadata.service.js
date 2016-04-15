/**!
 */
 (function () {
     'use strict';

     /**
     * @name ContainerMetadataService
     */
     function ContainerMetadataService($http, $rootScope, $q, $interval, containerConfig, MetricListService) {

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
        function clearIdDictionary(){
            idMap = {};
        }

        /**
        * @name resolveId
        * @desc
        */
        function resolveId(instanceKey) {
            if (containerConfig.externalAPI){
                //make external api call here to resolve container id
                //need to set containerConfig.externalAPI to true in app.config.js
            } else {
                return idDictionary(instanceKey);
            }
        }

        /**
        * @name containerIdExist
        * @desc
        */
        function containerIdExist(id) {
            return (idMap[parseId(id)] !== undefined && idMap[parseId(id)] !== '');
        }

        /**;
        * @name initialize
        * @desc
        */
        var activeContainers;
        function initialize(){
            activeContainers = MetricListService.getOrCreateMetric('containers.cgroup');
        }

        /**;
        * @name updateIdDictionary
        * @desc
        */
        function updateIdDictionary(){
            idMap = activeContainers.data.reduce(function(obj, item) {
                if (containerConfig.externalAPI) {
                    obj[item.key] = resolveId(item.key);
                } else {
                    obj[item.key] = item.key.substring(0,12);
                }
                return obj;
            },{});
        }

        /**
        * @name getContainerList
        * @desc
        */
        function getContainerList(){
          return activeContainers.data.reduce(function(obj, item) {
              if (containerConfig.externalAPI) {
                  obj.push(resolveId(item.key));
              } else {
                  obj.push(item.key.substring(0,12));
              }
              return obj;
          },[]);
        }

        /**
        * @name setGlobalFilter
        * @desc
        */
        var globalFilter = '';
        function setGlobalFilter(word){
            globalFilter = word;
        }

        /**
        * @name checkGlobalFilter
        * @desc
        */
        function checkGlobalFilter(name){
            return (globalFilter === '' || name.indexOf(globalFilter) !==-1);
        }

        /**
        * @name getGlobalFilter
        * @desc
        */
        function getGlobalFilter(){
            return globalFilter;
        }

        /**
        * @name setContainerName
        * @desc
        */
        var containerName = '';
        function setContainerName(name){
            containerName = name;
        }

        /**
        * @name getContainerName
        * @desc
        */
        function getContainerName(){
            return containerName;
        }

        /**
        * @name checkContainerName
        * @desc
        */
        function checkContainerName(name){
            return (containerName === '' || name.indexOf(containerName) !== -1);
        }

        return {
            idDictionary: idDictionary,
            getContainerList: getContainerList,
            updateIdDictionary: updateIdDictionary,
            clearIdDictionary: clearIdDictionary,
            resolveId: resolveId,
            setGlobalFilter: setGlobalFilter,
            checkGlobalFilter: checkGlobalFilter,
            getGlobalFilter : getGlobalFilter,
            containerIdExist: containerIdExist,
            setContainerName: setContainerName,
            getContainerName: getContainerName,
            checkContainerName: checkContainerName,
            initialize: initialize
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
