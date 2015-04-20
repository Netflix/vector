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

/*jslint node: true*/
/*jslint todo: true */
/*jslint unparam:true */
/*jslint nomen: true */
/*global $, jQuery, alert, angular, _*/

(function () {
    'use strict';

    /* Factories */

    function MetricFactory($rootScope, $log, MetricService) {

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
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [{x: timestamp, y: value}]
                };
                self.data.push(instance);
            }
        };

        Metric.prototype.pushValues = function (iid, timestamp, value) {
            var self = this,
                instance,
                overflow;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isDefined(instance) && instance !== null) {
                instance.values.push({ x: timestamp, y: value });
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: 'Series ' + iid,
                    iid: iid,
                    values: [{x: timestamp, y: value}]
                };
                self.data.push(instance);
                MetricService.getInames(self.name, iid)
                    .then(function (response) {
                        $.each(response.data.instances, function (index, value) {
                            if (value.instance === iid) {
                                instance.key = value.name;
                            }
                        });
                    });
            }
        };

        Metric.prototype.clearData = function () {
            this.data.length = 0;
        };

        return Metric;
    }

    function DerivedMetricFactory($rootScope, $log) {

        var DerivedMetric = function (name, derivedFunction) {
            this.name = name;
            this.data = [];
            this.subscribers = 1;
            this.derivedFunction = derivedFunction;
        };

        DerivedMetric.prototype.updateValues = function () {
            var self = this,
                values;

            values = self.derivedFunction(); // timestamp, key, data

            if (values.length !== self.data.length) {
                self.data.length = 0;
            }

            $.each(values, function (index, data) {
                var overflow,
                    instance = _.find(self.data, function (el) {
                        return el.key === data.key;
                    });

                if (angular.isUndefined(instance)) {
                    instance = {
                        key: data.key,
                        values: [{x: data.timestamp, y: data.value}]
                    };
                    self.data.push(instance);
                } else {
                    instance.values.push({x: data.timestamp, y: data.value});
                    overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                    if (overflow > 0) {
                        instance.values.splice(0, overflow);
                    }
                }
            });
        };

        DerivedMetric.prototype.clearData = function () {
            this.data.length = 0;
        };

        return DerivedMetric;
    }

    function CumulativeMetricFactory($rootScope, $log, Metric, MetricService) {

        var CumulativeMetric = function (name) {
            this.base = Metric;
            this.base(name);
        };

        CumulativeMetric.prototype = new Metric();

        CumulativeMetric.prototype.pushValue = function (timestamp, iid, iname, value) {
            var self = this,
                instance,
                overflow,
                diffValue;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isUndefined(instance)) {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [],
                    previousValue: value,
                    previousTimestamp: timestamp
                };
                self.data.push(instance);
            } else {
                diffValue = ((value - instance.previousValue) / ((timestamp - instance.previousTimestamp) / 1000)); // sampling frequency
                instance.values.push({ x: timestamp, y: diffValue });
                instance.previousValue = value;
                instance.previousTimestamp = timestamp;
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            }
        };

        CumulativeMetric.prototype.pushValues = function (iid, timestamp, value) {
            var self = this,
                instance,
                overflow,
                diffValue;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isUndefined(instance)) {
                instance = {
                    key: 'Series ' + iid,
                    iid: iid,
                    values: [],
                    previousValue: value,
                    previousTimestamp: timestamp
                };
                self.data.push(instance);

                MetricService.getInames(self.name, iid)
                    .then(function (response) {
                        $.each(response.data.instances, function (index, value) {
                            if (value.instance === iid) {
                                instance.key = value.name;
                            }
                        });
                    });
            } else {
                diffValue = ((value - instance.previousValue) / ((timestamp - instance.previousTimestamp) / 1000)); // sampling frequency
                instance.values.push({ x: timestamp, y: diffValue });
                instance.previousValue = value;
                instance.previousTimestamp = timestamp;
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            }
        };

        return CumulativeMetric;
    }

    function ConvertedMetricFactory($rootScope, $log, Metric, MetricService) {

        var ConvertedMetric = function (name, conversionFunction) {
            this.base = Metric;
            this.base(name);
            this.conversionFunction = conversionFunction;
        };

        ConvertedMetric.prototype = new Metric();

        ConvertedMetric.prototype.pushValue = function (timestamp, iid, iname, value) {
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
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [{x: timestamp, y: convertedValue}]
                };
                self.data.push(instance);
            }
        };

        ConvertedMetric.prototype.pushValues = function (iid, timestamp, value) {
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
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            } else {
                instance = {
                    key: 'Series ' + iid,
                    iid: iid,
                    values: [{x: timestamp, y: convertedValue}]
                };
                self.data.push(instance);
                MetricService.getInames(self.name, iid)
                .then(function (response) {
                    $.each(response.data.instances, function (index, value) {
                        if (value.instance === iid) {
                            instance.key = value.name;
                        }
                    });
                });
            }
        };

        return ConvertedMetric;
    }

    function CumulativeConvertedMetricFactory($rootScope, $log, Metric, MetricService) {

        var CumulativeConvertedMetric = function (name, conversionFunction) {
            this.base = Metric;
            this.base(name);
            this.conversionFunction = conversionFunction;
        };

        CumulativeConvertedMetric.prototype = new Metric();

        CumulativeConvertedMetric.prototype.pushValue = function (timestamp, iid, iname, value) {
            var self = this,
                instance,
                overflow,
                diffValue,
                convertedValue;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isUndefined(instance)) {
                instance = {
                    key: angular.isDefined(iname) ? iname : this.name,
                    iid: iid,
                    values: [],
                    previousValue: value,
                    previousTimestamp: timestamp
                };
                self.data.push(instance);
            } else {
                diffValue = ((value - instance.previousValue) / (timestamp - instance.previousTimestamp)); // sampling frequency
                convertedValue = self.conversionFunction(diffValue);
                instance.values.push({ x: timestamp, y: convertedValue });
                instance.previousValue = value;
                instance.previousTimestamp = timestamp;
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            }
        };

        CumulativeConvertedMetric.prototype.pushValues = function (iid, timestamp, value) {
            var self = this,
                instance,
                overflow,
                diffValue,
                convertedValue;

            instance = _.find(self.data, function (el) {
                return el.iid === iid;
            });

            if (angular.isUndefined(instance)) {
                instance = {
                    key: 'Series ' + iid,
                    iid: iid,
                    values: [],
                    previousValue: value,
                    previousTimestamp: timestamp
                };
                self.data.push(instance);

                MetricService.getInames(self.name, iid)
                    .then(function (response) {
                        $.each(response.data.instances, function (index, value) {
                            if (value.instance === iid) {
                                instance.key = value.name;
                            }
                        });
                    });
            } else {
                diffValue = ((value - instance.previousValue) / (timestamp - instance.previousTimestamp)); // sampling frequency
                convertedValue = self.conversionFunction(diffValue);
                instance.values.push({ x: timestamp, y: convertedValue });
                instance.previousValue = value;
                instance.previousTimestamp = timestamp;
                overflow = instance.values.length - (($rootScope.properties.window * 60) / $rootScope.properties.interval);
                if (overflow > 0) {
                    instance.values.splice(0, overflow);
                }
            }
        };

        return CumulativeConvertedMetric;
    }

    angular
        .module('app.factories')
        .factory('Metric', MetricFactory)
        .factory('DerivedMetric', DerivedMetricFactory)
        .factory('CumulativeMetric', CumulativeMetricFactory)
        .factory('ConvertedMetric', ConvertedMetricFactory)
        .factory('CumulativeConvertedMetric', CumulativeConvertedMetricFactory);
})();


