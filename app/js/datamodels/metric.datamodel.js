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
    * @name MetricDataModel
    * @desc
    */
    function MetricDataModel(WidgetDataModel, MetricListService, VectorService) {
        var MetricDataModel = function () {
            return this;
        };

        MetricDataModel.prototype = Object.create(WidgetDataModel.prototype);

        MetricDataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            this.metric = MetricListService.getOrCreateMetric(this.name);

            this.updateScope(this.metric.data);

        };

        MetricDataModel.prototype.destroy = function () {
            MetricListService.destroyMetric(this.name);

            WidgetDataModel.prototype.destroy.call(this);
        };

        return MetricDataModel;
    }

    angular
        .module('app.datamodels')
        .factory('MetricDataModel', MetricDataModel);
 })();
