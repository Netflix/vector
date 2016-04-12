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
            taskNames = {};
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
                idDictionary(instanceKey);
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
                var time = item.values[item.values.length-1].x;
                setCurrentTime(time);
                if (isTimeCurrent(time)){
                    obj[item.key] = item.key.substring(0,12);
                }
                if (containerConfig.externalAPI){
                    resolveId(item.key);
                }
                if (obj !==''){
                    return obj;
                }
            },{});
            if (!containerIdExist(containerName)){
                getAllContainers();
            }

        }

        /**;
        * @name getAllContainers
        * @desc
        */
        var taskNames = {};
        function getAllContainers(){
            var keys = Object.keys(idMap);
            var tempObj = idMap;
            if (containerConfig.externalAPI){
                keys = Object.keys(taskNames);
                tempObj = taskNames;
            }

            var values = new Array(keys.length);
            for(var i = 0; i < keys.length; i++) {
                values[i] = tempObj[keys[i]];
            }
            return values;
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
            clearIdDictionary: clearIdDictionary,
            resolveId: resolveId,
            setGlobalFilter: setGlobalFilter,
            checkGlobalFilter: checkGlobalFilter,
            getGlobalFilter : getGlobalFilter,
            setCurrentTime: setCurrentTime,
            isTimeCurrent: isTimeCurrent,
            containerIdExist: containerIdExist,
            getAllContainers: getAllContainers,
            initContainerCgroups:initContainerCgroups,
            setContainerName: setContainerName,
            getContainerName: getContainerName,
            checkContainerName: checkContainerName
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
