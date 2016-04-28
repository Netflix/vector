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
    * @name ContainerMemoryUsageMetricDataModel
    * @desc
    */
    function ContainerMemoryUsageMetricDataModel(WidgetDataModel, MetricListService, DashboardService, ContainerMetadataService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            var cgroupConversionFunction = function (value) {
                    return value / 1024 / 1024;
                },
                memConversionFunction = function (value) {
                    return value / 1024;
                },
                usedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.used', memConversionFunction),
                freeMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.free', memConversionFunction),
                containerMemMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.usage', cgroupConversionFunction),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    usedValue,
                    freeValue,
                    containerValue;


                usedValue = (function () {
                    if (usedMemMetric.data.length > 0) {
                        var instance = usedMemMetric.data[usedMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                freeValue = (function () {
                    if (freeMemMetric.data.length > 0) {
                        var instance = freeMemMetric.data[freeMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                containerValue = (function () {
                    if (containerMemMetric.data.length > 0) {
                        var total = 0;
                        var timestamp = containerMemMetric.data[containerMemMetric.data.length - 1].values[containerMemMetric.data[containerMemMetric.data.length - 1].values.length - 1].x;
                        angular.forEach(containerMemMetric.data, function (instance) {
                            if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                                total = total + instance.values[instance.values.length - 1].y;
                            }
                        });
                        return {
                            x: timestamp,
                            y: total
                        };
                    }
                }());

                if (angular.isDefined(usedValue) &&
                    angular.isDefined(containerValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'host used',
                        value: usedValue.y - containerValue.y
                    });

                }

                if (angular.isDefined(freeValue)) {

                    returnValues.push({
                        timestamp: freeValue.x,
                        key: 'free (unused)',
                        value: freeValue.y
                    });
                }

                if (angular.isDefined(containerValue) &&
                    angular.isDefined(usedValue)) {
                    returnValues.push({
                        timestamp: containerValue.x,
                        key: 'container used',
                        value: containerValue.y
                    });
                }

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
            MetricListService.destroyMetric('mem.util.used');
            MetricListService.destroyMetric('mem.util.free');
            MetricListService.destroyMetric('cgroup.memory.usage');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('ContainerMemoryUsageMetricDataModel', ContainerMemoryUsageMetricDataModel);
 })();
