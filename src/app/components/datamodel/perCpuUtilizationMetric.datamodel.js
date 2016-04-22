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
    * @name PerCpuUtilizationMetricDataModel
    * @desc
    */
    function PerCpuUtilizationMetricDataModel(WidgetDataModel, MetricListService, DashboardService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            var cpuSysMetric = MetricListService.getOrCreateCumulativeMetric('kernel.percpu.cpu.sys'),
                cpuUserMetric = MetricListService.getOrCreateCumulativeMetric('kernel.percpu.cpu.user'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    cpuUserInstance,
                    cpuSysLastValue,
                    cpuUserLastValue;

                angular.forEach(cpuSysMetric.data, function (cpuSysInstance) {
                    if (cpuSysInstance.values.length > 0) {
                        cpuUserInstance = _.find(cpuUserMetric.data, function (el) {
                            return el.key === cpuSysInstance.key;
                        });
                        if (angular.isDefined(cpuUserInstance)) {
                            cpuSysLastValue = cpuSysInstance.values[cpuSysInstance.values.length - 1];
                            cpuUserLastValue = cpuUserInstance.values[cpuUserInstance.values.length - 1];
                            if (cpuSysLastValue.x === cpuUserLastValue.x) {
                                returnValues.push({
                                    timestamp: cpuSysLastValue.x,
                                    key: cpuSysInstance.key,
                                    value: (cpuSysLastValue.y + cpuUserLastValue.y) / 1000
                                });
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
            MetricListService.destroyMetric('kernel.percpu.cpu.sys');
            MetricListService.destroyMetric('kernel.percpu.cpu.user');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('PerCpuUtilizationMetricDataModel', PerCpuUtilizationMetricDataModel);
 })();
