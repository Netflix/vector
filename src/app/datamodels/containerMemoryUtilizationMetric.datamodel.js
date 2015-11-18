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
    * @name ContainerMemoryUtilizationMetricDataModel
    * @desc
    */
    function ContainerMemoryUtilizationMetricDataModel(WidgetDataModel, MetricListService, VectorService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            var conversionFunction = function (value) {
                    return value / 1024;
                },
                cachedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.cached', conversionFunction),
                usedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.used', conversionFunction),
                freeMemMetric = MetricListService.getOrCreateConvertedMetric('mem.freemem', conversionFunction),
                buffersMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.bufmem', conversionFunction),
                containerMemMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.memory.usage'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    usedValue,
                    cachedValue,
                    freeValue,
                    buffersValue,
                    containerUsedValue,
                    tempTimestamp;


                usedValue = (function () {
                    if (usedMemMetric.data.length > 0) {
                        var instance = usedMemMetric.data[usedMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                cachedValue = (function () {
                    if (cachedMemMetric.data.length > 0) {
                        var instance = cachedMemMetric.data[cachedMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                freeValue = (function () {
                    if (freeMemMetric.data.length > 0) {
                        var instance = freeMemMetric.data[freeMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            tempTimestamp = instance.values[instance.values.length - 1].x;
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                buffersValue = (function () {
                    if (buffersMemMetric.data.length > 0) {
                        var instance = buffersMemMetric.data[buffersMemMetric.data.length - 1];
                        if (instance.values.length > 0) {
                            return instance.values[instance.values.length - 1];
                        }
                    }
                }());

                containerUsedValue = (function () {
                    var total = 0;
                    angular.forEach(containerMemMetric.data, function (instance) {
                        var difference = tempTimestamp - instance.previousTimestamp;
                        if (instance.values.length > 0 && instance.key.indexOf('docker/')!== -1 && difference < 5500) {
                            total = total + (instance.previousValue / 1024 / 1024);
                        }
                    });
                    return Math.round(total);

                }());

                if (angular.isDefined(usedValue) &&
                    angular.isDefined(containerUsedValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'System used mem',
                        value: usedValue.y - containerUsedValue
                    });

                }

                if (angular.isDefined(freeValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'System free (unused)',
                        value: freeValue.y
                    });
                }

                if (angular.isDefined(containerUsedValue) &&
                    angular.isDefined(usedValue)) {
                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'Container used mem',
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
            MetricListService.destroyMetric('mem.util.used');
            MetricListService.destroyMetric('mem.freemem');
            MetricListService.destroyMetric('cgroup.memory.usage');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('app.datamodels')
        .factory('ContainerMemoryUtilizationMetricDataModel', ContainerMemoryUtilizationMetricDataModel);
 })();
