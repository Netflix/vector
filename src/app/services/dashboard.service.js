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

     /**
     * @name DashboardService
     * @desc
     */
     function DashboardService($rootScope, $http, $interval, $log, $location, PMAPIService, MetricListService, flash, vectorConfig, ContainerMetadataService) {
        var loopErrors = 0;
        var intervalPromise;

        /**
        * @name cancelInterval
        * @desc
        */
        function cancelInterval() {
            if (intervalPromise) {
                $interval.cancel(intervalPromise);
                $log.info('Interval canceled.');
            }
        }

        /**
        * @name updateMetricsCallback
        * @desc
        */
        function updateMetricsCallback(success) {
            if (!success) {
                loopErrors = loopErrors + 1;
            } else {
                loopErrors = 0;
            }
            if (loopErrors > 5) {
                cancelInterval(intervalPromise);
                loopErrors = 0;
                flash.to('alert-dashboard-error').error = 'Consistently failed fetching metrics from host (>5). Aborting loop. Please make sure PCP is running correctly.';
            }
        }

        /**
        * @name intervalFunction
        * @desc
        */
        function intervalFunction() {
            MetricListService.updateMetrics(updateMetricsCallback);
            MetricListService.updateDerivedMetrics();
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
                    intervalPromise = $interval(intervalFunction, $rootScope.properties.interval * 1000);
                } else {
                    flash.to('alert-dashboard-error').error = 'Invalid context. Please update host to resume operation.';
                }
                $log.info('Interval updated.');
            }
        }

        /**
        * @name updateHostnameSuccessCallback
        * @desc
        */
        function updateHostnameSuccessCallback(data) {
          $rootScope.properties.hostname = data.values[0].instances[0].value;
          $log.info('Hostname updated: ' + $rootScope.properties.hostname);
        }

        /**
        * @name updateHostnameErrorCallback
        * @desc
        */
        function updateHostnameErrorCallback() {
            $rootScope.properties.hostname = 'Hostname not available.';
            $log.error('Error fetching hostname.');
        }

        /**
        * @name updateContextSuccessCallback
        * @desc
        */
        function updateContextSuccessCallback(data) {
            $rootScope.flags.contextAvailable = true;
            $rootScope.properties.context = data;
            updateInterval();
        }

        /**
        * @name updateContextErrorCallback
        * @desc
        */
        function updateContextErrorCallback() {
            $rootScope.flags.contextAvailable = false;
            $log.error('Error fetching context.');
        }

        /**
        * @name updateContext
        * @desc
        */
        function updateContext(host) {
            $log.info('Context updated.');

            var hostspec = $rootScope.properties.hostspec,
                hostMatch = null;

            if (host && host !== '') {
                $rootScope.flags.contextUpdating = true;
                $rootScope.flags.contextAvailable = false;
                hostMatch = host.match('(.*):([0-9]*)');

                if (hostMatch !== null) {
                    $rootScope.properties.host = hostMatch[1];
                    $rootScope.properties.port = hostMatch[2];
                } else {
                    $rootScope.properties.host = host;
                }

                PMAPIService.getHostspecContext(hostspec, 600)
                    .then(function (data) {
                        $rootScope.flags.contextUpdating = false;
                        updateContextSuccessCallback(data);
                        PMAPIService.getMetrics(data, ['pmcd.hostname'])
                            .then(function (metrics) {
                                updateHostnameSuccessCallback(metrics);
                            }, function errorHandler() {
                                updateHostnameErrorCallback();
                            });
                    }, function errorHandler() {
                        flash.to('alert-dashboard-error').error = 'Failed fetching context from host. Try updating the hostname.';
                        $rootScope.flags.contextUpdating = false;
                        updateContextErrorCallback();
                    });
            }
        }

        /**
        * @name updateHost
        * @desc
        */
        function updateHost(host) {
            $log.info('Host updated.');

            $location.search('host', host);
            $location.search('hostspec', $rootScope.properties.hostspec);

            $rootScope.properties.context = -1;
            $rootScope.properties.hostname = null;
            $rootScope.properties.port = vectorConfig.port;

            MetricListService.clearMetricList();
            MetricListService.clearDerivedMetricList();

            updateContext(host);
        }

        /**
        * @name updateWindow
        * @desc
        */
        function updateWindow() {
            $log.log('Window updated.');
        }

        /**
        * @name updateGlobalFilter
        * @desc
        */
        function updateGlobalFilter(word) {
            $log.log('Global Filter updated.');
            //$rootScope.flags.filterDone = true;
            ContainerMetadataService.setGlobalFilter(word);
        }

        /**
        * @name initializeProperties
        * @desc
        */
        function initializeProperties() {
            if ($rootScope.properties) {
                if (!$rootScope.properties.interval) {
                    $rootScope.properties.interval = vectorConfig.interval;
                }
                if (!$rootScope.properties.window) {
                    $rootScope.properties.window = vectorConfig.window;
                }
                if (!$rootScope.properties.protocol) {
                    $rootScope.properties.protocol = vectorConfig.protocol;
                }
                if (!$rootScope.properties.host) {
                    $rootScope.properties.host = '';
                }
                if (!$rootScope.properties.hostspec) {
                    $rootScope.properties.hostspec = vectorConfig.hostspec;
                }
                if (!$rootScope.properties.port) {
                    $rootScope.properties.port = vectorConfig.port;
                }
                if (!$rootScope.properties.context ||
                    $rootScope.properties.context < 0) {
                    updateContext();
                } else {
                    updateInterval();
                }
            } else {
                $rootScope.properties = {
                    protocol: vectorConfig.protocol,
                    host: '',
                    hostspec: vectorConfig.hostspec,
                    port: vectorConfig.port,
                    context: -1,
                    hostname: null,
                    window: vectorConfig.window,
                    interval: vectorConfig.interval
                };
            }

            $rootScope.flags = {
              contextAvailable: false,
              contextUpdating: false
            };

            if (vectorConfig.enableContainerWidgets) {
              ContainerMetadataService.initContainerCgroups();
            }
        }

        return {
            updateContext: updateContext,
            cancelInterval: cancelInterval,
            updateInterval: updateInterval,
            updateHost: updateHost,
            updateWindow: updateWindow,
            updateGlobalFilter: updateGlobalFilter,
            initializeProperties: initializeProperties
        };
    }

    angular
        .module('app.services')
        .factory('DashboardService', DashboardService);

 })();
