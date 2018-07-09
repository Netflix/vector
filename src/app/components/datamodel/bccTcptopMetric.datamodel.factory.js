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
   * @name BccTcptopMetricDataModel
   * @desc
   */
  function BccTcptopMetricDataModel(WidgetDataModel, MetricListService, DashboardService, TableDataModel) {
    var DataModel = function () {
      return this;
    };

    DataModel.prototype = Object.create(WidgetDataModel.prototype);

    DataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);

      this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + DashboardService.getGuid();

      function bytes_to_kb(x) {
        return (x / 1024).toFixed();
      }

      this.tableDefinition = {
        columns: [
          {label: 'PID', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.pid')},
          {label: 'COMM', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.comm')},
          {label: 'LADDR', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.laddr')},
          {label: 'LPORT', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.lport')},
          {label: 'DADDR', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.daddr')},
          {label: 'DPORT', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.dport')},
          {label: 'RX_KB', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.rx'), format: bytes_to_kb},
          {label: 'TX_KB', metric: MetricListService.getOrCreateMetric('bcc.proc.io.net.tcptop.tx'), format: bytes_to_kb}
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
    .factory('BccTcptopMetricDataModel', BccTcptopMetricDataModel);
})();
