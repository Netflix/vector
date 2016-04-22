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
    * @name DerivedMetric
    * @desc
    */
    function DerivedMetric($rootScope) {

        var Metric = function (name, derivedFunction) {
            this.name = name;
            this.data = [];
            this.subscribers = 1;
            this.derivedFunction = derivedFunction;
        };

        Metric.prototype.updateValues = function () {
            var self = this,
                values;

            values = self.derivedFunction(); // timestamp, key, data

            if (values.length !== self.data.length) {
                self.data.length = 0;
            }

            angular.forEach(values, function (data) {
                var overflow,
                    instance = _.find(self.data, function (el) {
                        return el.key === data.key;
                    });

                if (angular.isUndefined(instance)) {
                    instance = {
                        key: data.key,
                        values: [{x: data.timestamp, y: data.value}, {x: data.timestamp + 1, y: data.value}]
                    };
                    self.data.push(instance);
                } else {
                    instance.values.push({x: data.timestamp, y: data.value});
                    overflow = instance.values.length - ((parseInt($rootScope.properties.window) * 60) / parseInt($rootScope.properties.interval));
                    if (overflow > 0) {
                        instance.values.splice(0, overflow);
                    }
                }
            });
        };

        Metric.prototype.clearData = function () {
            this.data.length = 0;
        };

        return Metric;
    }

    angular
        .module('metric')
        .factory('DerivedMetric', DerivedMetric);
 })();
