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


    /**
    * @name MetricListService
    * @desc
    */
    function MetricListService($rootScope, $http, $log, $q, PMAPIService, SimpleMetric, CumulativeMetric, ConvertedMetric, CumulativeConvertedMetric, DerivedMetric) {
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

        function getDerivedMetricList() {
            return derivedMetrics;
        }

        function getSimpleMetricList() {
            return simpleMetrics;
        }

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
            getSimpleMetricList: getSimpleMetricList,
            getDerivedMetricList: getDerivedMetricList
        };
    }

    angular
        .module('metriclist', [
            'pmapi',
            'metric'
        ])
        .factory('MetricListService', MetricListService);

 })();
