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
    * @name MetricListService
    * @desc
    */
    function MetricListService($rootScope, $http, $log, $q, PMAPIService, SimpleMetric, CumulativeMetric, ConvertedMetric, CumulativeConvertedMetric, DerivedMetric, flash) {
        var simpleMetrics = [],
            derivedMetrics = [];

        /**
        * @name getOrCreateMetric
        * @desc
        */
        function getOrCreateMetric(name) {
            var metric = _.find(simpleMetrics, function (el) {
                return el.name === name;
            });

            if (angular.isUndefined(metric)) {
                metric = new SimpleMetric(name);
                simpleMetrics.push(metric);
            } else {
                metric.subscribers++;
            }
            return metric;
        }

        /**
        * @name getOrCreateCumulativeMetric
        * @desc
        */
        function getOrCreateCumulativeMetric(name) {
            var metric = _.find(simpleMetrics, function (el) {
                return el.name === name;
            });

            if (angular.isUndefined(metric)) {
                metric = new CumulativeMetric(name);
                simpleMetrics.push(metric);
            } else {
                metric.subscribers++;
            }
            return metric;
        }

        /**
        * @name getOrCreateConvertedMetric
        * @desc
        */
        function getOrCreateConvertedMetric(name, conversionFunction) {
            var metric = _.find(simpleMetrics, function (el) {
                return el.name === name;
            });

            if (angular.isUndefined(metric)) {
                metric = new ConvertedMetric(name, conversionFunction);
                simpleMetrics.push(metric);
            } else {
                metric.subscribers++;
            }
            return metric;
        }

        /**
        * @name getOrCreateCumulativeConvertedMetric
        * @desc
        */
        function getOrCreateCumulativeConvertedMetric(name, conversionFunction) {
            var metric = _.find(simpleMetrics, function (el) {
                return el.name === name;
            });

            if (angular.isUndefined(metric)) {
                metric = new CumulativeConvertedMetric(name, conversionFunction);
                simpleMetrics.push(metric);
            } else {
                metric.subscribers++;
            }
            return metric;
        }

        /**
        * @name getOrCreateDerivedMetric
        * @desc
        */
        function getOrCreateDerivedMetric(name, derivedFunction) {
            var metric = _.find(derivedMetrics, function (metric) {
                return metric.name === name;
            });

            if (angular.isUndefined(metric)) {
                metric = new DerivedMetric(name, derivedFunction);
                derivedMetrics.push(metric);
            } else {
                metric.subscribers++;
            }
            return metric;
        }

        /**
        * @name destroyMetric
        * @desc
        */
        function destroyMetric(name) {
            var index,
                metric = _.find(simpleMetrics, function (el) {
                    return el.name === name;
                });

            metric.subscribers--;

            if (metric.subscribers < 1) {
                index = simpleMetrics.indexOf(metric);
                if (index > -1) {
                    simpleMetrics.splice(index, 1);
                }
            }
        }

        /**
        * @name destroyDerivedMetric
        * @desc
        */
        function destroyDerivedMetric(name) {
            var index,
                metric = _.find(derivedMetrics, function (el) {
                    return el.name === name;
                });

            metric.subscribers--;

            if (metric.subscribers < 1) {
                index = derivedMetrics.indexOf(metric);
                if (index > -1) {
                    derivedMetrics.splice(index, 1);
                }
            }
        }

        /**
        * @name clearMetricList
        * @desc
        */
        function clearMetricList() {
            angular.forEach(simpleMetrics, function (metric) {
                metric.clearData();
            });
        }

        /**
        * @name clearDerivedMetricList
        * @desc
        */
        function clearDerivedMetricList() {
            angular.forEach(derivedMetrics, function (metric) {
                metric.clearData();
            });
        }

        /**
        * @name updateMetrics
        * @desc
        */
        function updateMetrics(callback) {
            var metricArr = [],
                url,
                host = $rootScope.properties.host,
                port = $rootScope.properties.port,
                context = $rootScope.properties.context,
                protocol = $rootScope.properties.protocol;

            if (context && context > 0 && simpleMetrics.length > 0) {
                angular.forEach(simpleMetrics, function (value) {
                    metricArr.push(value.name);
                });

                url = protocol + '://' + host + ':' + port + '/pmapi/' + context + '/_fetch?names=' + metricArr.join(',');

                PMAPIService.getMetrics(context, metricArr)
                    .then(function (metrics) {
                        angular.forEach(metrics.values, function (value) {
                            var name = value.name;
                            angular.forEach(value.instances, function (instance) {
                                var iid = angular.isUndefined(instance.instance) ? 1 : instance.instance;
                                var iname = metrics.inames[name].inames[iid];

                                var metricInstance = _.find(simpleMetrics, function (el) {
                                    return el.name === name;
                                });
                                if (angular.isDefined(metricInstance) && metricInstance !== null) {
                                    metricInstance.pushValue(metrics.timestamp, iid, iname, instance.value);
                                }
                            });
                        });
                    }).then(
                        function () { callback(true); },
                        function () {
                            flash.to('alert-dashboard-error').error = 'Failed fetching metrics.';
                            // Check if context is wrong and update it if needed
                            // PMWEBAPI error, code -12376: Attempt to use an illegal context
                            callback(false);
                    });

                $rootScope.$broadcast('updateMetrics');
            }
        }

        /**
        * @name updateDerivedMetrics
        * @desc
        */
        function updateDerivedMetrics() {
            if (derivedMetrics.length > 0) {
                angular.forEach(derivedMetrics, function (metric) {
                    metric.updateValues();
                });
                $rootScope.$broadcast('updateDerivedMetrics');
            }
        }


        ///////////

        return {
            getOrCreateMetric: getOrCreateMetric,
            getOrCreateCumulativeMetric: getOrCreateCumulativeMetric,
            getOrCreateConvertedMetric: getOrCreateConvertedMetric,
            getOrCreateCumulativeConvertedMetric: getOrCreateCumulativeConvertedMetric,
            getOrCreateDerivedMetric: getOrCreateDerivedMetric,
            destroyMetric: destroyMetric,
            destroyDerivedMetric: destroyDerivedMetric,
            clearMetricList: clearMetricList,
            clearDerivedMetricList: clearDerivedMetricList,
            updateMetrics: updateMetrics,
            updateDerivedMetrics: updateDerivedMetrics
        };
    }

    angular
        .module('app.services')
        .factory('MetricListService', MetricListService);

 })();
