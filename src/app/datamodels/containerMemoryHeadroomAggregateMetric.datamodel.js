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
    * @name ContainerMemoryHeadroomAggregateMetricDataModel
    * @desc
    */
    function ContainerMemoryHeadroomAggregateMetricDataModel(WidgetDataModel, MetricListService, VectorService, ContainerMetadataService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            var conversionFunction = function (value) {
                    return value / 1024 /1024;
                },
                containerLimitMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.limit', conversionFunction),
                containerUsedMetric = MetricListService.getOrCreateConvertedMetric('cgroup.memory.usage', conversionFunction),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    containerLimitValue,
                    containerUsedValue,
                    tempTimestamp;


                containerLimitValue = (function () {
                    var total = 0;
                    angular.forEach(containerLimitMetric.data, function (instance) {
                        
                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            total = total + instance.previousValue / 1024 / 1204;
                        }
                    });
                    return total;
                }());

                containerUsedValue = (function () {
                    var total = 0;
                    angular.forEach(containerUsedMetric.data, function (instance) {
                        tempTimestamp = instance.values[instance.values.length - 1].x;
                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            total = total + instance.previousValue / 1024 / 1204;
                        }
                    });

                    return total;
                }());

                if (angular.isDefined(containerLimitValue)) {
                    
                    returnValues.push({
                        timestamp: tempTimestamp,
                        key: 'Container mem limit',
                        value: containerLimitValue
                    });
                }

                if (angular.isDefined(containerUsedValue)) {
                    returnValues.push({
                        timestamp: tempTimestamp,
                        key: 'Container mem usage',
                        value: containerUsedValue
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
            MetricListService.destroyMetric('cgroup.memory.limit');
            MetricListService.destroyMetric('cgroup.memory.usage');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('app.datamodels')
        .factory('ContainerMemoryHeadroomAggregateMetricDataModel', ContainerMemoryHeadroomAggregateMetricDataModel);
 })();
