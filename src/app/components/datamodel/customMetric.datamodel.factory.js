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
    * @name CustomMetricDataModel
    * @desc
    */
    function CustomMetricDataModel($rootScope, WidgetDataModel, MetricListService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);
            this.updateScope([]);
        };

        DataModel.prototype.destroy = function () {
            MetricListService.destroyMetric(this.name);
            WidgetDataModel.prototype.destroy.call(this);
        };

        DataModel.prototype.update = function (name, cumulative) {
            this.name = name;

            // destroy metric before updating
            MetricListService.destroyMetric(this.name);

            if (!cumulative) {
                this.metric = MetricListService.getOrCreateMetric(name);
            } else {
                this.metric = MetricListService.getOrCreateCumulativeMetric(name);
            }
            
            this.updateScope(this.metric.data);
        }

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('CustomMetricDataModel', CustomMetricDataModel);
 })();
