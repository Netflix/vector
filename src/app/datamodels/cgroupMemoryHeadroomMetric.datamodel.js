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
            var usageMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.memory.usage'),
                limitMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.memory.limit'),
                physmemMetric = MetricListService.getOrCreateCumulativeMetric('mem.physmem'),
                calculatedMaxMem,
                maxInt = 18446744073709552000,
                derivedFunction;

            // create derived function
            derivedFunction = function () {
                var returnValues = [],
                    lastValue;

                var pushReturnValues = function(instance, metricName){
                    if (instance.values.length > 0){
                        lastValue = instance.values[instance.values.length - 1];

                        //metric used to get physical max to overwrite cgroup.memory.limit when it returns max int
                        var value = instance.previousValue;
                        if (metricName === ' limit (physical)'){
                            calculatedMaxMem = instance.previousValue;
                        }
                        if (instance.previousValue >= maxInt){
                           value = calculatedMaxMem;
                        }

                        if (ContainerMetadataService.containerIdExist(instance.key)) {
                            var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                            if (name.indexOf(ContainerMetadataService.getContainerName()) !== -1){
                                returnValues.push({
                                    timestamp: lastValue.x,
                                    key: name + metricName,
                                    value: value / 1024 / 1024
                                });
                            }
                        }
                    }

                };

                angular.forEach(usageMetric.data, function (instance) {
                    pushReturnValues(instance, ' used');
                });

                angular.forEach(limitMetric.data, function (instance) {
                    pushReturnValues(instance, ' limit');
                });

                //metric used to get physical max to overwrite cgroup.memory.limit when it returns max int
                angular.forEach(physmemMetric.data, function (instance) {
                    pushReturnValues(instance, ' limit (physical)');
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
