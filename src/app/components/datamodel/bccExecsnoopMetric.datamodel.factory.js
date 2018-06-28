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
    * @name BccExecsnoopMetricDataModel
    * @desc
    */
    function BccExecsnoopMetricDataModel(WidgetDataModel, MetricListService, DashboardService, TableDataModel) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

            this.tableDefinition = {
                columns: [
                    {label: 'COMM', metric: MetricListService.getOrCreateMetric('bcc.proc.exec.comm'), css_class: 'text-nowrap'},
                    {label: 'PID', metric: MetricListService.getOrCreateMetric('bcc.proc.exec.pid'), css_class: 'text-nowrap'},
                    {label: 'PPID', metric: MetricListService.getOrCreateMetric('bcc.proc.exec.ppid'), css_class: 'text-nowrap'},
                    {label: 'RET', metric: MetricListService.getOrCreateMetric('bcc.proc.exec.ret'), css_class: 'text-nowrap'},
                    {label: 'ARGS', metric: MetricListService.getOrCreateMetric('bcc.proc.exec.args')}
                ],
                isMultiMetricsTable: true
            };

            // create derived metric
            this.metric = MetricListService.getOrCreateDerivedMetric(this.name, TableDataModel.derivedFunction.bind(null, this.tableDefinition));

            this.updateScope(this.metric.data);
        };

        DataModel.prototype.destroy = function () {
            // remove subscribers and delete derived metric
            MetricListService.destroyDerivedMetric(this.name);

            // remove subscribers and delete base metrics
            for (var i = 0; i < this.tableDefinition.columns.length; i++) {
                MetricListService.destroyMetric(this.tableDefinition.columns[i].metric.name);
            }

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('BccExecsnoopMetricDataModel', BccExecsnoopMetricDataModel);
 })();
