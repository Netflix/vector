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
    * @name CgroupMemoryHeadroomMetricDataModel
    * @desc
    */
    function CgroupMemoryHeadroomMetricDataModel(WidgetDataModel, MetricListService, VectorService, ContainerMetadataService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            // create create base metrics
            var conversionFunction = function (value) {
                    return value / 1024 / 1024;
                },
                usageMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.usage', conversionFunction),
                limitMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.limit', conversionFunction),
                physmemMetric = MetricListService.getOrCreateConvertedMetric('mem.physmem', conversionFunction),
                derivedFunction;

            // create derived function
            derivedFunction = function () {
                var returnValues = [],
                    lastUsedValue,
                    lastLimitValue,
                    usedName,
                    limitName,
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
                    if (instance.values.length > 0) {
                        lastUsedValue = instance.values[instance.values.length - 1];

                        if (ContainerMetadataService.containerIdExist(instance.key)) {
                            usedName = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                            if (usedName.indexOf(ContainerMetadataService.getContainerName()) !== -1){
                                returnValues.push({
                                    timestamp: lastUsedValue.x,
                                    key: usedName + ' used',
                                    value: lastUsedValue.y
                                });
                            }
                        }
                    }
                });

                angular.forEach(limitMetric.data, function (instance) {
                    if (instance.values.length > 0) {
                        lastLimitValue = instance.values[instance.values.length - 1];

                        if (ContainerMetadataService.containerIdExist(instance.key)) {
                            limitName = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                            if (limitName.indexOf(ContainerMetadataService.getContainerName()) !== -1) {
                                if (lastLimitValue.y >= lastPhysmemValue.y) {
                                    returnValues.push({
                                        timestamp: lastPhysmemValue.x,
                                        key: limitName + ' limit (physical)',
                                        value: lastPhysmemValue.y
                                    });
                                } else {
                                    returnValues.push({
                                        timestamp: lastLimitValue.x,
                                        key: limitName + ' limit',
                                        value: lastLimitValue.y
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
        .module('app.datamodels')
        .factory('CgroupMemoryHeadroomMetricDataModel', CgroupMemoryHeadroomMetricDataModel);
 })();
