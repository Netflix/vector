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
        function idDictionary(key, value){
            if (value === undefined){
                return idMap[key];
            } else {
                idMap[key] = parseId(key);
            }
        }

        /**
        * @name parseId
        * @desc parses different types of docker ID
        */
        function parseId(id){
            //handle regular docker
            if (id.indexOf('docker/') !==-1){
                id = id.split('/')[2];
            //handle systemd
            } else if (id.indexOf('/docker-') !==-1){
                id = id.split('-')[1].split('.')[0];
            }
            return id.substring(0,12);
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
                idDictionary(instanceKey,instanceKey);
                if (!containerCgroups){
                    containerCgroups = true;
                    initContainerCgroups();
                }
            }
        }

        /**
        * @name containerIdExist
        * @desc
        */
        function containerIdExist(id) {
            return idMap[id];
        }

        /**;
        * @name initContainerCgroups
        * @desc
        */
        var containerCgroups = false;
        var activeContainers;
        function initContainerCgroups(){
            activeContainers = MetricListService.getOrCreateMetric('containers.cgroup');
            $interval(containerCgroupIntervalFunction, $rootScope.properties.interval * 1000);
        }

        /**;
        * @name containerCgroupIntervalFunction
        * @desc
        */
        function containerCgroupIntervalFunction(){
            idMap = activeContainers.data.reduce(function(obj, item){
                var parsedKey = parseId(item.key);
                if (isTimeCurrent(item.values[item.values.length-1].x)){
                    obj[item.key] = parsedKey;
                } else {
                    delete obj[item.key];
                }
                return obj;
            },{});
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
        * @name getGlobalFilter
        * @desc
        */
        function getGlobalFilter(){
            return globalFilter;
        }

        /**
        * @name setCurrentTime
        * @desc
        */
        var currentTime = 0;
        function setCurrentTime(time){
            if (time > currentTime){
                currentTime = time;
            }
        }

        /**
        * @name isTimeCurrent
        * @desc
        */
        function isTimeCurrent(time){
            var difference = currentTime - time;
            return difference < 6000;
        }

        //////////

        return {
            idDictionary: idDictionary,
            clearIdDictionary: clearIdDictionary,
            resolveId: resolveId,
            setGlobalFilter: setGlobalFilter,
            getGlobalFilter: getGlobalFilter,
            setCurrentTime: setCurrentTime,
            isTimeCurrent: isTimeCurrent,
            containerIdExist: containerIdExist
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
