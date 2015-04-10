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
(function () {
    'use strict';

    // PMAPI Service factory
    angular
        .module('app.services')
        .factory('PMAPIService', PMAPIService);

    PMAPIService.$inject = ['$http', '$log', '$rootScope', '$q'];

    function PMAPIService($http, $log, $rootScope, $q) {
        return {
            getHostspecContext: getHostspecContext,
            getHostnameContext: getHostnameContext,
            getLocalContext: getLocalContext,
            getArchiveContext: getArchiveContext,            
            getMetricsValues: getMetricsValues,
            getInstanceDomainsByIndom: getInstanceDomainsByIndom,
            getInstanceDomainsByName: getInstanceDomainsByName
        };
    
        ///////////

        function getHostspecContext(hostspec, pollTimeout) {
            var params = {};
            params.contextType = 'hostspec';
            params.contextValue = hostspec;
            params.pollTimeout = pollTimeout;
            return getContext(params);
        }

        function getHostnameContext(hostname, pollTimeout) {
            var params = {};
            params.contextType = 'hostname';
            params.contextValue = hostname;
            params.pollTimeout = pollTimeout;
            return getContext(params);
        }

        function getLocalContext(pollTimeout) {
            var params = {};
            params.contextType = 'local';
            params.contextValue = 'ANYTHING';
            params.pollTimeout = pollTimeout;
            return getContext(params);
        }

        function getArchiveContext(archiveFile, pollTimeout) {
            var params = {};
            params.contextType = 'archivefile';
            params.contextValue = archiveFile;
            params.pollTimeout = pollTimeout;
            return getContext(params);
        }

        function getContext(params) {
            var baseURI = 'http://' + $rootScope.properties.host + ':' +
               $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/context';
            settings.params = {};
            settings.params[params.contextType] = params.contextValue;
            settings.params.polltimeout = params.pollTimeout.toString();

            return $http(settings)
                .then(function (response) { 
                    if (response.data.context) {
                        console.log(response.data.context);
                        return response.data.context;
                    }

                    return $q.reject('context is undefined'); 
                });
        }

        function getMetricsValues(context, names, pmids) {
            var baseURI = 'http://' + $rootScope.properties.host + ':' +
               $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_fetch';
            settings.params = {
                names: names.join(','),
                pmids: pmids.join(',')
            };

            return $http(settings)
                .then(function (response) { return response; });

        }

        function getInstanceDomainsByIndom(context, indom, instances, inames) {
            var baseURI = 'http://' + $rootScope.properties.host + ':' +
                $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_indom';
            settings.params = {
                indom: indom,
                instance: typeof instances !== 'undefined' ? instances.join(',') : '',
                inames: typeof inames !== 'undefined' ? inames.join(',') : ''
            };

            return $http(settings)
                .then(function (response) { return response; });
        }

        function getInstanceDomainsByName(context, name, instances, inames) {
            var baseURI = 'http://' + $rootScope.properties.host + ':' +
                $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_indom';
            settings.params = {
                name: name,
                instance: typeof instances !== 'undefined' ? instances.join(',') : '', 
                inames: typeof inames !== 'undefined' ? inames.join(',') : ''
            };

            return $http(settings)
                .then(function (response) { 
                    if (response.instances) {
                      return response;
                    } 
                    return $q.reject('instances is undefined');
                });
        }
    }
})();