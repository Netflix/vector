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

/*global _*/

 (function () {
     'use strict';

     /**
     * @name DashboardService
     * @desc
     */
     function DashboardService($rootScope, $http, $interval, $log, $location, toastr, config, PMAPIService, MetricListService, ContainerMetadataService) {
        var loopErrors = 0,
            intervalPromise;

        /**
        * @name cancelInterval
        * @desc
        */
        function cancelInterval() {
            if (intervalPromise) {
                $interval.cancel(intervalPromise);
            }
        }

        /**
        * @name updateMetricsCallback
        * @desc
        */
        function updateMetricsCallback(success) {
            if (!success) {
                toastr.error('Failed fetching metrics. Trying again.', 'Error');
                loopErrors = loopErrors + 1;
            } else {
                loopErrors = 0;
            }
            if (loopErrors > 5) {
                cancelInterval(intervalPromise);
                loopErrors = 0;
                $rootScope.properties.context = '-1';
                $rootScope.flags.contextAvailable = false;
                toastr.error('Consistently failed fetching metrics from host (>5). Please update the hostname to resume operation.', 'Error');
            }
        }

        /**
        * @name updateMetrics
        * @desc
        */
        function updateMetrics(callback) {
            var metricArr = [],
                context = $rootScope.properties.context,
                simpleMetrics = MetricListService.getSimpleMetricList();

            if (context && context > 0 && simpleMetrics.length > 0) {
                angular.forEach(simpleMetrics, function (value) {
                    metricArr.push(value.name);
                });

                PMAPIService.getMetrics(context, metricArr)
                    .then(function (metrics) {
                        var name,
                            metricInstance,
                            iid,
                            iname;

                        if (metrics.values.length !== simpleMetrics.length) {
                            var currentMetric;

                            angular.forEach(simpleMetrics, function (metric) {
                                currentMetric= _.find(metrics.values, function (el) {
                                    return el.name === metric.name;
                                });
                                if (angular.isUndefined(currentMetric)) {
                                    metric.clearData();
                                }
                            });
                        }

                        angular.forEach(metrics.values, function (value) {
                            name = value.name;

                            metricInstance = _.find(simpleMetrics, function (el) {
                                return el.name === name;
                            });

                            if(value.instances.length !== metricInstance.data.length) {
                                metricInstance.deleteInvalidInstances(value.instances);
                            }

                            if (angular.isDefined(metricInstance) && metricInstance !== null) {
                                angular.forEach(value.instances, function (instance) {
                                    iid = angular.isUndefined(instance.instance) ? 1 : instance.instance;
                                    iname = metrics.inames[name].inames[iid];

                                    metricInstance.pushValue(metrics.timestamp, iid, iname, instance.value);
                                });
                            }
                        });
                    }).then(
                        function () {
                            callback(true);
                            $rootScope.$broadcast('updateMetrics');
                        },
                        function (response) {
                            if(response.status === 400 && response.data.indexOf('-12376') !== -1) {
                                updateContext();
                            }
                            callback(false);
                    });
            }
        }

        /**
        * @name updateDerivedMetrics
        * @desc
        */
        function updateDerivedMetrics() {
            var derivedMetrics = MetricListService.getDerivedMetricList();
            if (derivedMetrics.length > 0) {
                angular.forEach(derivedMetrics, function (metric) {
                    metric.updateValues();
                });
                $rootScope.$broadcast('updateDerivedMetrics');
            }
        }

        /**
        * @name intervalFunction
        * @desc
        */
        function intervalFunction() {
            updateMetrics(updateMetricsCallback);
            updateDerivedMetrics();
        }

        /**
        * @name updateInterval
        * @desc
        */
        function updateInterval() {
            cancelInterval(intervalPromise);

            if ($rootScope.properties.host) {
                if ($rootScope.properties.context &&
                    $rootScope.properties.context > 0) {
                    intervalPromise = $interval(intervalFunction, parseInt($rootScope.properties.interval) * 1000);
                } else {
                    toastr.error('Vector is not connected to the host. Please update the hostname to resume operation.', 'Error');
                }
            }
        }

        /**
        * @name parseHostInput
        * @desc
        */
        function parseHostInput(host) {
            var hostMatch = null;
            if (host) {
                hostMatch = host.match('(.*):([0-9]*)');
                if (hostMatch !== null) {
                    $rootScope.properties.host = hostMatch[1];
                    $rootScope.properties.port = hostMatch[2];
                } else {
                    $rootScope.properties.host = host;
                }
            }
        }

        /**
        * @name updateContext
        * @desc
        */
        function updateContext() {
            $rootScope.flags.contextUpdating = true;
            $rootScope.flags.contextAvailable = false;

            PMAPIService.getHostspecContext($rootScope.properties.hostspec, 600)
                .then(function (data) {
                    $rootScope.flags.contextUpdating = false;
                    $rootScope.flags.contextAvailable = true;
                    $rootScope.properties.context = data;
                    updateInterval();
                    PMAPIService.getMetrics(data, ['pmcd.hostname'])
                        .then(function (data) {
                            $rootScope.properties.hostname = data.values[0].instances[0].value;
                        }, function () {
                            $rootScope.properties.hostname = 'Hostname not available.';
                            $log.error('Error fetching hostname.');
                        });
                }, function () {
                    toastr.error('Failed fetching context from host. Try updating the hostname.', 'Error');
                    $rootScope.flags.contextUpdating = false;
                    $rootScope.flags.contextAvailable = false;
                });
        }

        /**
        * @name updateHost
        * @desc
        */
        function updateHost(host) {
            $location.search('host', host);
            $location.search('hostspec', $rootScope.properties.hostspec);

            $rootScope.properties.context = -1;
            $rootScope.properties.hostname = null;
            $rootScope.properties.port = config.port;

            MetricListService.clearMetricList();
            MetricListService.clearDerivedMetricList();

            parseHostInput(host);
            updateContext();
        }

        /**
        * @name initialize
        * @desc
        */
        function initialize() {
            if ($rootScope.properties) {
                if (!$rootScope.properties.interval) {
                    $rootScope.properties.interval = config.interval;
                }
                if (!$rootScope.properties.window) {
                    $rootScope.properties.window = config.window;
                }
                if (!$rootScope.properties.protocol) {
                    $rootScope.properties.protocol = config.protocol;
                }
                if (!$rootScope.properties.host) {
                    $rootScope.properties.host = '';
                }
                if (!$rootScope.properties.hostspec) {
                    $rootScope.properties.hostspec = config.hostspec;
                }
                if (!$rootScope.properties.port) {
                    $rootScope.properties.port = config.port;
                }
                if (!$rootScope.properties.context ||
                    $rootScope.properties.context < 0) {
                    updateContext();
                } else {
                    updateInterval();
                }
            } else {
                $rootScope.properties = {
                    protocol: config.protocol,
                    host: '',
                    hostspec: config.hostspec,
                    port: config.port,
                    context: -1,
                    hostname: null,
                    window: config.window,
                    interval: config.interval,
                    containerFilter: '',
                    containerList: [],
                    selectedContainer: ''
                };
            }

            $rootScope.flags = {
                contextAvailable: false,
                contextUpdating: false,
                isHostnameExpanded: config.expandHostname,
                enableContainerWidgets: config.enableContainerWidgets,
                disableHostspecInput: config.disableHostspecInput,
                disableContainerFilter: config.disableContainerFilter,
                disableContainerSelect: config.disableContainerSelect,
                containerSelectOverride: config.containerSelectOverride,
                disableContainerSelectNone: false,
                disableHostnameInputContainerSelect: config.disableHostnameInputContainerSelect
            };

            if (config.enableContainerWidgets) {
                ContainerMetadataService.initialize();
            }
        }

        /**
        * @name getGuid
        * @desc
        */
        function getGuid() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return {
            cancelInterval: cancelInterval,
            updateInterval: updateInterval,
            updateHost: updateHost,
            updateContext: updateContext,
            getGuid: getGuid,
            initialize: initialize
        };
    }

    angular
        .module('dashboard', [
            'pmapi',
            'metriclist',
            'containermetadata'
        ])
        .factory('DashboardService', DashboardService);

 })();
