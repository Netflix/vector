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
    * @name BccTcpretransMetricDataModel
    * @desc
    */
    function BccTcpretransMetricDataModel(WidgetDataModel, MetricListService, DashboardService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);

            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();
            this.tableDefinition = {
                columns: [
                    {label: 'LADDR:LPORT'},
                    {label: 'DADDR:DPORT'},
                    {label: 'RETRANSMITS'}
                ],
                rowFn: function(instance, value) {
                    var spl = instance.split('::');
                    return [spl[0], spl[1], value];
                }
            }

            this.metric = MetricListService.getOrCreateMetric('bcc.io.net.tcp.retrans.count');
            this.updateScope(this.metric.data);
        };

        DataModel.prototype.destroy = function () {
            // remove subscribers and delete base metrics
            MetricListService.destroyMetric(this.metric.name);

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('datamodel')
        .factory('BccTcpretransMetricDataModel', BccTcpretransMetricDataModel);
 })();
