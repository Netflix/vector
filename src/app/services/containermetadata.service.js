/**!
 */
 (function () {
     'use strict';

     /**
     * @name ContainerMetadataService
     */
     function ContainerMetadataService($http, $rootScope, $q, containerConfig) {

        /**
        * @name idDictionary
        * @desc
        */
        var idMap = {};
        function idDictionary(key, value){
            if (key.indexOf('docker/') !==-1){
                if (key === value){
                    value = value.split('/')[2];
                }
                key = key.split('/')[2];
            } 

            if (value === undefined){
                return idMap[key];
            } else {
                idMap[key] = value;
            }

        }

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

        //////////

        return {
            idDictionary: idDictionary,
            clearIdDictionary: clearIdDictionary,
            resolveId: resolveId,
            setGlobalFilter: setGlobalFilter,
            getGlobalFilter:getGlobalFilter
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
