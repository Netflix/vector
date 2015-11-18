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
                idDictionary(instanceKey,instanceKey);
            }
        }

        /**
        * @name containerIdExist
        * @desc
        */
        function containerIdExist(id) {
            return (idMap[parseId(id)] !== undefined);
        }

        /**;
        * @name initContainerCgroups
        * @desc
        */
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
                if (isTimeCurrent(item.values[item.values.length-1].x)){
                    obj[item.key] = item.key.substring(0,12);
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
        * @name checkGlobalFilter
        * @desc
        */
        function checkGlobalFilter(name){
            return (globalFilter === '' || name.indexOf(globalFilter) !==-1);
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
            checkGlobalFilter: checkGlobalFilter,
            setCurrentTime: setCurrentTime,
            isTimeCurrent: isTimeCurrent,
            containerIdExist: containerIdExist,
            initContainerCgroups:initContainerCgroups
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
