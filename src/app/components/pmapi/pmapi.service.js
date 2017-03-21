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

    function PMAPIService($http, $log, $rootScope, $q) {

        function getContext(params) {
            var baseURI = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' +
               $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/context';
            settings.params = {};
            settings.params[params.contextType] = params.contextValue;
            settings.params.polltimeout = params.pollTimeout.toString();
            settings.timeout = 5000;

            return $http(settings)
                .then(function (response) {
                    if (response.data.context) {
                        return response.data.context;
                    }

                    return $q.reject('context is undefined');
                });
        }

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

        function getMetricsValues(context, names, pmids) {
            var baseURI = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' +
               $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_fetch';
            settings.params = {};

            if (angular.isDefined(pmids) && pmids !== null && pmids.length > 0)  {
                settings.params.pmids = pmids.join(',');
            }

            if (angular.isDefined(names) && names !== null && names.length > 0) {
                settings.params.names = names.join(',');
            }

            return $http(settings)
                .then(function (response) {
                    if (angular.isUndefined(response.data.timestamp) ||
                        angular.isUndefined(response.data.timestamp.s) ||
                        angular.isUndefined(response.data.timestamp.us) ||
                        angular.isUndefined(response.data.values)) {
                        return $q.reject('metric values is empty');
                    }
                    return response;
                });
        }

        function getInstanceDomainsByIndom(context, indom, instances, inames) {
            var baseURI = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' +
                $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_indom';
            settings.params = {indom: indom}; // required

            if (angular.isDefined(instances) && instances !== null) {
                settings.params.instance = instances.join(',');
            }

            if (angular.isDefined(inames) && inames !== null) {
                settings.params.inames = inames.join(',');
            }

            settings.cache = true;

            return $http(settings)
                .then(function (response) {
                    if (angular.isDefined(response.data.indom) ||
                        angular.isDefined(response.data.instances)) {
                       return response;
                    }

                    return $q.reject('instances is undefined');
                });
        }

        function getInstanceDomainsByName(context, name, instances, inames) {
            var baseURI = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' +
                $rootScope.properties.port;
            var settings = {};
            settings.method = 'GET';
            settings.url = baseURI + '/pmapi/' + context + '/_indom';
            settings.params = {name: name};

            if (angular.isDefined(instances) && instances !== null) {
                settings.params.instance = instances.join(',');
            }

            if (angular.isDefined(inames) && inames !== null) {
                settings.params.inames = inames.join(',');
            }

            settings.cache = true;

            return $http(settings)
                .then(function (response) {
                    if (angular.isDefined(response.data.instances)) {
                      return response;
                    }
                    return $q.reject('instances is undefined');
                });
        }

        function convertTimestampToMillisOrMicros(response) {
            var timestamp = (response.data.timestamp.s * 1000) +
                (response.data.timestamp.us / 1000);
            var values = response.data.values;
			
			if ($rootScope.metadata == undefined) {
				return {
                timestamp: timestamp,
                values: values
            	};
			}
			
			var units = [];
			response.data.values.forEach(function(ele) {
				units.push($rootScope.metadata.find(function(element) {
					return element.name == ele.name;
				}).units);
			})
			
			units.forEach(function(ele) {
				if (ele == "millisec" || ele == "");
				else if (ele == "microsec" || ele == "") {
					timestamp = (response.data.timestamp.s * 1000000) +
                	(response.data.timestamp.us / 1000000);
				}
			})
			
            // timestamp is in milliseconds

            return {
                timestamp: timestamp,
                values: values
            };

        }

        function mapMetricNamesToInstanceDomains(responses) {
            var instanceDomains = {};
            angular.forEach(responses, function (response)  {
                var indom = response.data.indom;
                var name = response.config.params.name;
                var inames = {};
                angular.forEach(response.data.instances, function (inst) {
                    inames[inst.instance.toString()] = inst.name;
                });
                instanceDomains[name.toString()] = {
                    indom: indom,
                    name: name,
                    inames: inames
                };
            });

            return instanceDomains;
        }

        function appendInstanceDomains(context, data) {
            var deferred = $q.defer();
            var instanceDomainPromises = [];
            angular.forEach(data.values, function (value) {
                var ids = _.map(value.instances, function (inst) {
                    if (angular.isDefined(inst.instance) &&
                        inst.instance !== null) {
                        return inst.instance;
                    } else {
                        return -1;
                    }
                });
                instanceDomainPromises.push(
                    getInstanceDomainsByName(context, value.name, ids));
            });

            $q.all(instanceDomainPromises)
                .then(function (responses) {
                    var dict = mapMetricNamesToInstanceDomains(responses);

                    var result = {
                        timestamp: data.timestamp,
                        values: data.values,
                        inames: dict
                    };

                    deferred.resolve(result);
                }, function (errors) {
                    deferred.reject(errors);
                }, function (updates) {
                    deferred.update(updates);
                });

            return deferred.promise;
        }
      
        function getMetricsMetadata(context) {
            var baseURI = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' +
               $rootScope.properties.port;
            var metadata = {};
            metadata.method = 'GET';
            metadata.url = baseURI + '/pmapi/' + context + '/_metric';
			
			$http(metadata).then(function(response) {
				$rootScope.metadata = response.data.metrics;
			});

        }  
      
        function getMetrics(context, metrics, pmids) {
          if ($rootScope.metadata == undefined) {
              getMetricsMetadata(context);
          }
          return getMetricsValues(context, metrics, pmids)
                    .then(convertTimestampToMillisOrMicros)
                    .then(function(data) {
                        return appendInstanceDomains(context, data);
                    });
        }

         return {
            getHostspecContext: getHostspecContext,
            getHostnameContext: getHostnameContext,
            getLocalContext: getLocalContext,
            getArchiveContext: getArchiveContext,
            getMetricsValues: getMetricsValues,
            getMetrics: getMetrics,
            getInstanceDomainsByIndom: getInstanceDomainsByIndom,
            getInstanceDomainsByName: getInstanceDomainsByName
        };
    }

    // PMAPI Service factory
    angular
        .module('pmapi', [])
        .factory('PMAPIService', PMAPIService);

    PMAPIService.$inject = ['$http', '$log', '$rootScope', '$q'];

})();
