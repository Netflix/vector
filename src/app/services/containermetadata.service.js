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
            if (containerConfig.functionName){
                //make api call here
            } else {
                idDictionary(instanceKey,instanceKey);
            }
            
        }

        //////////

        return {
            idDictionary: idDictionary,
            clearIdDictionary: clearIdDictionary,
            resolveId: resolveId
        };
    }

    angular
        .module('app.services')
        .factory('ContainerMetadataService', ContainerMetadataService);

 })();
