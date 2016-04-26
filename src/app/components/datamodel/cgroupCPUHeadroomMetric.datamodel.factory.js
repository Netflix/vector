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
    * @name CgroupCPUHeadroomMetricDataModel
    * @desc
    */
    function CgroupCPUHeadroomMetricDataModel(ContainerMetadataService, WidgetDataModel, MetricListService, DashboardService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);
            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            // create create base metrics
            var cpuUsageMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.cpuacct.usage'),
                cpuSharesMetric = MetricListService.getOrCreateMetric('cgroup.cpusched.shares'),
                cpuPeriodsMetric = MetricListService.getOrCreateMetric('cgroup.cpusched.periods'),
                ncpuMetric = MetricListService.getOrCreateMetric('hinv.ncpu'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [];

                if ( cpuUsageMetric.data.length > 0){
                    angular.forEach(cpuUsageMetric.data, function (instance) {

                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            var lastValue = instance.values[instance.values.length - 1];
                            var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;

                            if (ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkContainerFilter(name)) {
                                returnValues.push({
                                    timestamp: lastValue.x,
                                    key: name,
                                    value: lastValue.y / 1000 / 1000 / 1000
                                });
                            }
                        }
                    });
                }

                if ( cpuPeriodsMetric.data.length > 0) {
                    angular.forEach(cpuPeriodsMetric.data, function (instance) {

                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            var lastValue = instance.values[instance.values.length - 1];
                            var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;

                            if (ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkContainerFilter(name)) {

                                if (lastValue.y > 0) {
                                    var cpuSharesInstance = _.find(cpuSharesMetric.data, function(el) {
                                        return el.key === instance.key;
                                    });

                                    if (angular.isDefined(cpuSharesInstance)) {
                                        var cpuSharesValue = cpuSharesInstance.values[cpuSharesInstance.values.length - 1];
                                        returnValues.push({
                                            timestamp: lastValue.x,
                                            key: name + ' (limit)',
                                            value: cpuSharesValue.y / lastValue.y
                                        });
                                    }
                                } else {
                                    if (ncpuMetric.data.length > 0) {
                                        var ncpuInstance = ncpuMetric.data[ncpuMetric.data.length - 1];
                                        if (ncpuInstance.values.length > 0) {
                                            var ncpuValue = ncpuInstance.values[ncpuInstance.values.length - 1];
                                            returnValues.push({
                                                timestamp: ncpuValue.x,
                                                key: name + ' (physical)',
                                                value: ncpuValue.y
                                            });
                                        }
                                    }
                                }
                            }
                        }
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
            MetricListService.destroyMetric('cgroup.cpuacct.usage');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('CgroupCPUHeadroomMetricDataModel', CgroupCPUHeadroomMetricDataModel);
 })();
