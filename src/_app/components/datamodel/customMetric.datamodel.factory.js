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
      this.name = null;
      this.metric = null;
      if (this.dataModelOptions) {
        this.name = this.dataModelOptions.name;
        this.isCumulative = this.dataModelOptions.isCumulative;
        this.isConverted = this.dataModelOptions.isConverted;
        this.strConversionFunction = this.dataModelOptions.strConversionFunction;
      }
      if (this.name) {
        if (!this.isCumulative && !this.isConverted) {
          this.metric = MetricListService.getOrCreateMetric(this.name);
        } else if (this.isCumulative && !this.isConverted) {
          this.metric = MetricListService.getOrCreateCumulativeMetric(this.name);
        } else if (!this.isCumulative && this.isConverted) {
          var conversionFunction = new Function('value', 'return ' + this.strConversionFunction + ';');
          this.metric = MetricListService.getOrCreateConvertedMetric(this.name, conversionFunction);
        }
        this.updateScope(this.metric.data);
      } else {
        this.updateScope([]);
      }
    };

    DataModel.prototype.destroy = function () {
      if (this.metric) {
        MetricListService.destroyMetric(this.name);
        this.metric = null;
      }
      WidgetDataModel.prototype.destroy.call(this);
    };

    return DataModel;
  }

  angular
    .module('datamodel')
    .factory('CustomMetricDataModel', CustomMetricDataModel);
})();
