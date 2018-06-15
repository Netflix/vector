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

  /*global _*/

  (function () {
    'use strict';

   /**
   * @name TableDataModel
   * @desc
   */
   function TableDataModel() {

       function derivedFunction (metrics) {
            var returnValues = [];

            var firstMetric = metrics[0];
            for (var i = 0; i < firstMetric.metric.data.length; i++) {
                var instance = firstMetric.metric.data[i];

                if (instance.values.length > 0) {
                    var lastValue = instance.values[instance.values.length - 1];
                    var values = [];
                    values.push(firstMetric.format ? firstMetric.format(lastValue.y) : lastValue.y);

                    for(var j = 1; j < metrics.length; j++) {
                        var otherMetric = metrics[j];
                        var otherInstance = _.find(otherMetric.metric.data, function (element) {
                            return element.key === instance.key;
                        });
                        if (angular.isDefined(otherInstance) && otherInstance.values.length > 0) {
                            var otherLastValue = otherInstance.values[otherInstance.values.length - 1];
                            values.push(otherMetric.format ? otherMetric.format(otherLastValue.y) : otherLastValue.y);
                        }
                        else {
                            values.push('');
                        }
                    }

                    returnValues.push({
                        timestamp: lastValue.x,
                        key: instance.key,
                        value: values
                    });
                }
            }

            return returnValues;
        }

        return {
            derivedFunction: derivedFunction
        };
   }

   angular
       .module('datamodel')
       .factory('TableDataModel', TableDataModel);
})();
