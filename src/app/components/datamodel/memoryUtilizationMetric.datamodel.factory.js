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
    * @name MemoryUtilizationMetricDataModel
    * @desc
    */
    function MemoryUtilizationMetricDataModel(WidgetDataModel, MetricListService, DashboardService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            var conversionFunction = function (value) {
                    return value / 1024;
                },
                cachedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.cached', conversionFunction),
                usedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.used', conversionFunction),
                freeMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.free', conversionFunction),
                buffersMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.bufmem', conversionFunction),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    usedValue,
                    cachedValue,
                    freeValue,
                    buffersValue;


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

                if (angular.isDefined(usedValue) &&
                    angular.isDefined(cachedValue) &&
                    angular.isDefined(buffersValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'application',
                        value: usedValue.y - cachedValue.y - buffersValue.y
                    });
                }

                if (angular.isDefined(cachedValue) &&
                    angular.isDefined(buffersValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'free (cache)',
                        value: cachedValue.y + buffersValue.y
                    });
                }

                if (angular.isDefined(freeValue)) {

                    returnValues.push({
                        timestamp: usedValue.x,
                        key: 'free (unused)',
                        value: freeValue.y
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
            MetricListService.destroyMetric('mem.util.cached');
            MetricListService.destroyMetric('mem.util.used');
            MetricListService.destroyMetric('mem.util.free');
            MetricListService.destroyMetric('mem.util.bufmem');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('MemoryUtilizationMetricDataModel', MemoryUtilizationMetricDataModel);
 })();
