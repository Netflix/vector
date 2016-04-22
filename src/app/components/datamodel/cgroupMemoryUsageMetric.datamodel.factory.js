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
    * @name CgroupMemoryUsageMetricTimeSeriesDataModel
    * @desc
    */
    function CgroupMemoryUsageMetricTimeSeriesDataModel(ContainerMetadataService, WidgetDataModel, MetricListService, DashboardService) {
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
                usageMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.usage', conversionFunction),
                derivedFunction;


            // create derived function
            derivedFunction = function () {
                var returnValues = [],
                    lastValue,
                    name;

                angular.forEach(usageMetric.data, function (instance) {
                    if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                        lastValue = instance.values[instance.values.length - 1];
                        name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                        if (ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkContainerFilter(name)){
                            returnValues.push({
                                timestamp: lastValue.x,
                                key: name,
                                value: lastValue.y
                            });
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

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('CgroupMemoryUsageMetricTimeSeriesDataModel', CgroupMemoryUsageMetricTimeSeriesDataModel);
 })();
