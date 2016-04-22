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
    * @name DiskLatencyMetricDataModel
    * @desc
    */
    function DiskLatencyMetricDataModel(WidgetDataModel, MetricListService, DashboardService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            var readActiveMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.read_rawactive'),
                writeActiveMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.write_rawactive'),
                readMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.read'),
                writeMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.write'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    rawactiveInstance,
                    lastValue,
                    rawactiveLastValue,
                    value;

                function calculateValues(metric, rawactiveMetric, key, outputArr) {
                    if (metric.data.length > 0) {
                        angular.forEach(metric.data, function (instance) {
                            rawactiveInstance = _.find(rawactiveMetric.data, function (element) {
                                return element.key === instance.key;
                            });
                            if (angular.isDefined(rawactiveInstance)) {
                                if (instance.values.length > 0) {
                                    if (rawactiveInstance.values.length > 0) {
                                        lastValue = instance.values[instance.values.length - 1];
                                        rawactiveLastValue = rawactiveInstance.values[instance.values.length - 1];
                                        if (lastValue.y > 0) {
                                            value = rawactiveLastValue.y / lastValue.y;
                                        } else {
                                            value = 0;
                                        }
                                        outputArr.push({
                                            timestamp: lastValue.x,
                                            key: instance.key + key,
                                            value: value
                                        });
                                    }
                                }
                            }
                        });
                    }
                }

                calculateValues(readMetric, readActiveMetric, ' read latency', returnValues);
                calculateValues(writeMetric, writeActiveMetric, ' write latency', returnValues);

                return returnValues;
            };

            // create derived metric
            this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

            this.updateScope(this.metric.data);
        };

        DataModel.prototype.destroy = function () {
            // remove subscribers and delete derived metric
            MetricListService.destroyDerivedMetric(this.name);

            // remove subscribers and delete base metrics
            MetricListService.destroyMetric('disk.dev.read_rawactive');
            MetricListService.destroyMetric('disk.dev.write_rawactive');
            MetricListService.destroyMetric('disk.dev.read');
            MetricListService.destroyMetric('disk.dev.write');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('DiskLatencyMetricDataModel', DiskLatencyMetricDataModel);
 })();
