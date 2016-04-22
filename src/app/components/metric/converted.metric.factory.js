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

 /*global _*/

 (function () {
     'use strict';

    /**
    * @name ConvertedMetric
    * @desc
    */
    function ConvertedMetric($rootScope, $log, SimpleMetric) {

        var Metric = function (name, conversionFunction) {
            this.base = SimpleMetric;
            this.base(name);
            this.conversionFunction = conversionFunction;
        };

        Metric.prototype = new SimpleMetric();

        Metric.prototype.pushValue = function (timestamp, iid, iname, value) {
            var self = this,
                instance,
                overflow,
                convertedValue;

            convertedValue = self.conversionFunction(value);

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isDefined(instance) && instance !== null) {
                instance.values.push({ x: timestamp, y: convertedValue });
                overflow = instance.values.length - ((parseInt($rootScope.properties.window) * 60) / parseInt($rootScope.properties.interval));
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [{x: timestamp, y: convertedValue}, {x: timestamp + 1, y: convertedValue}]
                };
                self.data.push(instance);
            }
        };

        return Metric;
    }

    angular
        .module('metric')
        .factory('ConvertedMetric', ConvertedMetric);
 })();
