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
    * @name ContainerMemoryHeadroomMetricDataModel
    * @desc
    */
    function ContainerMemoryHeadroomMetricDataModel(WidgetDataModel, MetricListService, VectorService, ContainerMetadataService) {
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
                derivedFunction;

            // create derived function
            derivedFunction = function () {
                var returnValues = [],
                    lastValue;

                var pushReturnValues = function(instance, metricName){                    
                    ContainerMetadataService.setCurrentTime(instance.previousTimestamp);
                    if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                        lastValue = instance.values[instance.values.length - 1];
                        var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                        if (name.indexOf(ContainerMetadataService.getSelectedContainer()) !== -1){
                            returnValues.push({
                                timestamp: lastValue.x,
                                key: name + metricName,
                                value: instance.previousValue / 1024 / 1024
                            });
                        }
                    }

                };

                angular.forEach(usageMetric.data, function (instance) {
                    pushReturnValues(instance, ' - Usage');
                });

                angular.forEach(limitMetric.data, function (instance) {
                    pushReturnValues(instance, ' - Limit');
                });

                return returnValues.sort(function(val1, val2){ return val1.key < val2.key; });
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

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('app.datamodels')
        .factory('ContainerMemoryHeadroomMetricDataModel', ContainerMemoryHeadroomMetricDataModel);
 })();
