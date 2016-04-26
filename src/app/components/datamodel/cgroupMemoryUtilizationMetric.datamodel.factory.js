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

/* global _*/
 (function () {
     'use strict';

    /**
    * @name CgroupMemoryUtilizationMetricDataModel
    * @desc
    */
    function CgroupMemoryUtilizationMetricDataModel(WidgetDataModel, MetricListService, DashboardService, ContainerMetadataService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            // create create base metrics
            var conversionFunction = function (value) {
                    return value / 1024 / 1024;
                },
                physmemConversionFunction = function (value) {
                    return value / 1024;
                },
                usageMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.usage', conversionFunction),
                limitMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.limit', conversionFunction),
                physmemMetric = MetricListService.getOrCreateConvertedMetric('mem.physmem', physmemConversionFunction),
                derivedFunction;

            // create derived function
            derivedFunction = function () {
                var returnValues = [],
                    lastPhysmemValue;

                lastPhysmemValue = (function () {
                    if (physmemMetric.data.length > 0) {
                        var instance = physmemMetric.data[physmemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                angular.forEach(usageMetric.data, function (instance) {
                  if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                        var lastValue = instance.values[instance.values.length - 1];
                        var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                        if (ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkContainerFilter(name)){
                            var limitInstance = _.find(limitMetric.data, function(el) {
                                return el.key === instance.key;
                            });

                            if (angular.isDefined(limitInstance)) {
                                var lastLimitValue = limitInstance.values[limitInstance.values.length - 1];

                                if (lastLimitValue.y >= lastPhysmemValue.y) {
                                    returnValues.push({
                                        timestamp: lastValue.x,
                                        key: name,
                                        value: lastValue.y / lastPhysmemValue.y
                                    });
                                } else {
                                    returnValues.push({
                                        timestamp: lastValue.x,
                                        key: name,
                                        value: lastValue.y / lastLimitValue.y
                                    });
                                }
                            }
                        }
                    }
                });

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
            MetricListService.destroyMetric('cgroup.memory.usage');
            MetricListService.destroyMetric('cgroup.memory.limit');
            MetricListService.destroyMetric('mem.physmem');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('CgroupMemoryUtilizationMetricDataModel', CgroupMemoryUtilizationMetricDataModel);
 })();
