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
    * @name ContainerMultipleMetricDataModel
    * @desc
    */
    function ContainerMultipleMetricDataModel(WidgetDataModel, MetricListService, DashboardService, ContainerMetadataService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            this.metricDefinitions = this.dataModelOptions.metricDefinitions;

            var derivedFunction,
                metrics = {};

            angular.forEach(this.metricDefinitions, function (definition, key) {
                metrics[key] = MetricListService.getOrCreateMetric(definition);
            });

            derivedFunction = function () {
                var returnValues = [],
                    lastValue,
                    name;

                angular.forEach(metrics, function (metric, key) {
                    angular.forEach(metric.data, function (instance) {

                        if (ContainerMetadataService.containerIdExist(instance.key)) {
                            name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                            if (instance.values.length > 0 && ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkContainerFilter(name)) {
                                lastValue = instance.values[instance.values.length - 1];
                                returnValues.push({
                                    timestamp: lastValue.x,
                                    key: key.replace('{key}', name),
                                    value: lastValue.y
                                });
                            }
                        }
                    });
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
            angular.forEach(this.metricDefinitions, function (definition) {
                MetricListService.destroyMetric(definition);
            });

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('ContainerMultipleMetricDataModel', ContainerMultipleMetricDataModel);
 })();
