/**!
 *
 *  Copyright 2018 Andreas Gerstmayr.
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
    * @name BccFsDistMetricDataModel
    * @desc generic data model for ext4dist, xfsdist and zfsdist
    */
    function BccFsDistMetricDataModel(WidgetDataModel, MetricListService, DashboardService, $rootScope) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = 'metric_' + DashboardService.getGuid();

            this.removeOperationWatcher = this.widgetScope.$watch('widget.dataModelOptions.operation', function(newValue) {
                if (this.metric) {
                    MetricListService.destroyMetric(this.metric.name);
                }

                this.metric = MetricListService.getOrCreateCumulativeMetric(this.dataModelOptions.name + '.' + newValue);
                this.updateScope(this.metric.data);
            }.bind(this));

            this.removeIntervalWatcher = $rootScope.$watch('properties.interval', function() {
                this.metric.clearData();
            }.bind(this));
        };

        DataModel.prototype.destroy = function () {
            this.removeOperationWatcher();
            this.removeIntervalWatcher();

            MetricListService.destroyMetric(this.metric.name);
            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('BccFsDistMetricDataModel', BccFsDistMetricDataModel);
 })();
