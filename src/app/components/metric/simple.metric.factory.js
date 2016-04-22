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
    * @name SimpleMetric
    * @desc
    */
    function SimpleMetric($rootScope) {

        var Metric = function (name) {
            this.name = name || null;
            this.data = [];
            this.subscribers = 1;
        };

        Metric.prototype.toString = function () {
            return this.name;
        };

        Metric.prototype.pushValue = function (timestamp, iid, iname, value) {
            var self = this,
                instance,
                overflow;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isDefined(instance) && instance !== null) {
                instance.values.push({ x: timestamp, y: value });
                overflow = instance.values.length - ((parseInt($rootScope.properties.window) * 60) / parseInt($rootScope.properties.interval));
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [{x: timestamp, y: value}, {x: timestamp + 1, y: value}]
                };
                self.data.push(instance);
            }
        };

        Metric.prototype.clearData = function () {
            this.data.length = 0;
        };

        Metric.prototype.deleteInvalidInstances = function (currentInstances) {
            var iid,
                currentInstance,
                index,
                self = this;
            angular.forEach(self.data, function(instance) {
                currentInstance = _.find(currentInstances, function (el) {
                    iid = angular.isUndefined(el.instance) ? 1 : el.instance;
                    return iid === instance.iid;
                });
                if (angular.isUndefined(currentInstance)) {
                    index = self.data.indexOf(instance);
                    if (index > -1) {
                        self.data.splice(index, 1);
                    }
                }
            });
        };

        return Metric;
    }

    angular
        .module('metric')
        .factory('SimpleMetric', SimpleMetric);
 })();
