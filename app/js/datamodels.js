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
/*jslint plusplus: true */
/*jslint nomen: true */
/*global angular, _, $*/

'use strict';

/* Data Models */

var datamodels = angular.module('app.datamodels', []);

datamodels.factory('DummyMetricDataModel', function (WidgetDataModel, MetricListService) {
    var DummyMetricDataModel = function () {
        return this;
    };

    DummyMetricDataModel.prototype = Object.create(WidgetDataModel.prototype);

    DummyMetricDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.metric = MetricListService.getOrCreateMetric('kernel.uname.release');
    };

    DummyMetricDataModel.prototype.destroy = function () {
        MetricListService.destroyMetric('kernel.uname.release');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return DummyMetricDataModel;
});

datamodels.factory('MetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var MetricTimeSeriesDataModel = function () {
        return this;
    };

    MetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        this.metric = MetricListService.getOrCreateMetric(this.name);

        this.updateScope(this.metric.data);

    };

    MetricTimeSeriesDataModel.prototype.destroy = function () {
        MetricListService.destroyMetric(this.name);

        WidgetDataModel.prototype.destroy.call(this);
    };

    return MetricTimeSeriesDataModel;
});

datamodels.factory('CumulativeMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var CumulativeMetricTimeSeriesDataModel = function () {
        return this;
    };

    CumulativeMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    CumulativeMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        this.metric = MetricListService.getOrCreateCumulativeMetric(this.name);

        this.updateScope(this.metric.data);

    };

    CumulativeMetricTimeSeriesDataModel.prototype.destroy = function () {
        MetricListService.destroyMetric(this.name);

        WidgetDataModel.prototype.destroy.call(this);
    };

    return CumulativeMetricTimeSeriesDataModel;
});

datamodels.factory('CumulativeUtilizationMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var CumulativeUtilizationMetricTimeSeriesDataModel = function () {
        return this;
    };

    CumulativeUtilizationMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    CumulativeUtilizationMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        var rawMetric = MetricListService.getOrCreateCumulativeMetric(this.name),
            derivedFunction;

        derivedFunction = function () {
            var returnValues = [],
                lastValue;

            /*jslint unparam: true*/
            $.each(rawMetric.data, function (index, instance) {
                if (instance.values.length > 0) {
                    lastValue = instance.values[instance.values.length - 1];
                    returnValues.push({
                        timestamp: lastValue.x,
                        key: instance.key,
                        value: lastValue.y / 1000
                    });
                }
            });
            /*jslint unparam: false*/

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);

    };

    CumulativeUtilizationMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric(this.name);

        WidgetDataModel.prototype.destroy.call(this);
    };

    return CumulativeUtilizationMetricTimeSeriesDataModel;
});

datamodels.factory('MultipleMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var MultipleMetricTimeSeriesDataModel = function () {
        return this;
    };

    MultipleMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MultipleMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        this.metricDefinitions = this.dataModelOptions.metricDefinitions;

        var derivedFunction,
            metrics = {};

        /*jslint unparam: true*/
        $.each(this.metricDefinitions, function (key, definition) {
            metrics[key] = MetricListService.getOrCreateMetric(definition);
        });
        /*jslint unparam: false*/

        derivedFunction = function () {
            var returnValues = [],
                lastValue;

            /*jslint unparam: true*/
            $.each(metrics, function (key, metric) {
                $.each(metric.data, function (index, instance) {
                    if (instance.values.length > 0) {
                        lastValue = instance.values[instance.values.length - 1];
                        returnValues.push({
                            timestamp: lastValue.x,
                            key: key.replace("{key}", instance.key),
                            value: lastValue.y
                        });
                    }
                });
            });
            /*jslint unparam: false*/

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    MultipleMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        /*jslint unparam: true*/
        $.each(this.metricDefinitions, function (key, definition) {
            MetricListService.destroyMetric(definition);
        });
        /*jslint unparam: false*/

        WidgetDataModel.prototype.destroy.call(this);
    };

    return MultipleMetricTimeSeriesDataModel;
});

datamodels.factory('MultipleCumulativeMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var MultipleCumulativeMetricTimeSeriesDataModel = function () {
        return this;
    };

    MultipleCumulativeMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MultipleCumulativeMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        this.metricDefinitions = this.dataModelOptions.metricDefinitions;

        var derivedFunction,
            metrics = {};

        /*jslint unparam: true*/
        $.each(this.metricDefinitions, function (key, definition) {
            metrics[key] = MetricListService.getOrCreateCumulativeMetric(definition);
        });
        /*jslint unparam: false*/

        derivedFunction = function () {
            var returnValues = [],
                lastValue;

            /*jslint unparam: true*/
            $.each(metrics, function (key, metric) {
                $.each(metric.data, function (index, instance) {
                    if (instance.values.length > 0) {
                        lastValue = instance.values[instance.values.length - 1];
                        returnValues.push({
                            timestamp: lastValue.x,
                            key: key.replace("{key}", instance.key),
                            value: lastValue.y
                        });
                    }
                });
            });
            /*jslint unparam: false*/

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    MultipleCumulativeMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        /*jslint unparam: true*/
        $.each(this.metricDefinitions, function (key, definition) {
            MetricListService.destroyMetric(definition);
        });
        /*jslint unparam: false*/

        WidgetDataModel.prototype.destroy.call(this);
    };

    return MultipleCumulativeMetricTimeSeriesDataModel;
});

datamodels.factory('NetworkBytesMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var NetworkBytesMetricTimeSeriesDataModel = function () {
        return this;
    };

    NetworkBytesMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    NetworkBytesMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        // create create base metrics
        var inMetric = MetricListService.getOrCreateCumulativeMetric('network.interface.in.bytes'),
            outMetric = MetricListService.getOrCreateCumulativeMetric('network.interface.out.bytes'),
            derivedFunction;

        // create derived function
        derivedFunction = function () {
            var returnValues = [],
                lastValue;

            /*jslint unparam: true*/
            $.each(inMetric.data, function (index, instance) {
                if (instance.values.length > 0) {
                    lastValue = instance.values[instance.values.length - 1];
                    returnValues.push({
                        timestamp: lastValue.x,
                        key: instance.key + ' in',
                        value: lastValue.y / 1024
                    });
                }
            });
            /*jslint unparam: false*/

            /*jslint unparam: true*/
            $.each(outMetric.data, function (index, instance) {
                if (instance.values.length > 0) {
                    lastValue = instance.values[instance.values.length - 1];
                    returnValues.push({
                        timestamp: lastValue.x,
                        key: instance.key + ' out',
                        value: lastValue.y / 1024
                    });
                }
            });
            /*jslint unparam: false*/

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    NetworkBytesMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric('network.interface.in.bytes');
        MetricListService.destroyMetric('network.interface.out.bytes');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return NetworkBytesMetricTimeSeriesDataModel;
});

datamodels.factory('CpuUtilizationMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var CpuUtilizationMetricTimeSeriesDataModel = function () {
        return this;
    };

    CpuUtilizationMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    CpuUtilizationMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        // create create base metrics
        var cpuSysMetric = MetricListService.getOrCreateCumulativeMetric('kernel.all.cpu.sys'),
            cpuUserMetric = MetricListService.getOrCreateCumulativeMetric('kernel.all.cpu.user'),
            ncpuMetric = MetricListService.getOrCreateMetric('hinv.ncpu'),
            derivedFunction;

        derivedFunction = function () {
            var returnValues = [],
                cpuInstance,
                cpuCount;

            if (ncpuMetric.data.length > 0) {
                cpuInstance = ncpuMetric.data[ncpuMetric.data.length - 1];

                if (cpuInstance.values.length > 0) {
                    cpuCount = cpuInstance.values[cpuInstance.values.length - 1].y;

                    /*jslint unparam: true*/
                    $.each(cpuSysMetric.data, function (index, instance) {
                        if (instance.values.length > 0) {
                            var lastValue = instance.values[instance.values.length - 1];
                            returnValues.push({
                                timestamp: lastValue.x,
                                key: 'sys',
                                value: lastValue.y / (cpuCount * 1000)
                            });
                        }
                    });
                    /*jslint unparam: false*/

                    /*jslint unparam: true*/
                    $.each(cpuUserMetric.data, function (index, instance) {
                        if (instance.values.length > 0) {
                            var lastValue = instance.values[instance.values.length - 1];
                            returnValues.push({
                                timestamp: lastValue.x,
                                key: 'user',
                                value: lastValue.y / (cpuCount * 1000)
                            });
                        }
                    });
                    /*jslint unparam: false*/
                }
            }

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    CpuUtilizationMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric('kernel.all.cpu.sys');
        MetricListService.destroyMetric('kernel.all.cpu.user');
        MetricListService.destroyMetric('hinv.ncpu');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return CpuUtilizationMetricTimeSeriesDataModel;
});

datamodels.factory('PerCpuUtilizationMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var PerCpuUtilizationMetricTimeSeriesDataModel = function () {
        return this;
    };

    PerCpuUtilizationMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    PerCpuUtilizationMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        var cpuSysMetric = MetricListService.getOrCreateCumulativeMetric('kernel.percpu.cpu.sys'),
            cpuUserMetric = MetricListService.getOrCreateCumulativeMetric('kernel.percpu.cpu.user'),
            derivedFunction;

        derivedFunction = function () {
            var returnValues = [],
                cpuUserInstance,
                cpuSysLastValue,
                cpuUserLastValue;

            /*jslint unparam: true*/
            $.each(cpuSysMetric.data, function (index, cpuSysInstance) {
                if (cpuSysInstance.values.length > 0) {
                    cpuUserInstance = _.find(cpuUserMetric.data, function (el) {
                        return el.key === cpuSysInstance.key;
                    });
                    if (cpuUserInstance !== undefined) {
                        cpuSysLastValue = cpuSysInstance.values[cpuSysInstance.values.length - 1];
                        cpuUserLastValue = cpuUserInstance.values[cpuUserInstance.values.length - 1];
                        if (cpuSysLastValue.x === cpuUserLastValue.x) {
                            returnValues.push({
                                timestamp: cpuSysLastValue.x,
                                key: cpuSysInstance.key,
                                value: (cpuSysLastValue.y + cpuUserLastValue.y) / 1000
                            });
                        }
                    }
                }
            });
            /*jslint unparam: false*/

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    PerCpuUtilizationMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric('kernel.percpu.cpu.sys');
        MetricListService.destroyMetric('kernel.percpu.cpu.user');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return PerCpuUtilizationMetricTimeSeriesDataModel;
});

datamodels.factory('MemoryMetricTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var MemoryMetricTimeSeriesDataModel = function () {
        return this;
    };

    MemoryMetricTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MemoryMetricTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        var conversionFunction = function (value) {
                return value / 1024;
            },
            cachedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.cached', conversionFunction),
            usedMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.used', conversionFunction),
            freeMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.free', conversionFunction),
            buffersMemMetric = MetricListService.getOrCreateConvertedMetric('mem.util.bufmem', conversionFunction),
            derivedFunction;

        derivedFunction = function () {
            var returnValues = [],
                usedValue,
                cachedValue,
                freeValue,
                buffersValue;


            usedValue = (function () {
                if (usedMemMetric.data.length > 0) {
                    var instance = usedMemMetric.data[usedMemMetric.data.length - 1];
                    if (instance.values.length > 0) {
                        return instance.values[instance.values.length - 1];
                    }
                }
            }());

            cachedValue = (function () {
                if (cachedMemMetric.data.length > 0) {
                    var instance = cachedMemMetric.data[cachedMemMetric.data.length - 1];
                    if (instance.values.length > 0) {
                        return instance.values[instance.values.length - 1];
                    }
                }
            }());

            freeValue = (function () {
                if (freeMemMetric.data.length > 0) {
                    var instance = freeMemMetric.data[freeMemMetric.data.length - 1];
                    if (instance.values.length > 0) {
                        return instance.values[instance.values.length - 1];
                    }
                }
            }());

            buffersValue = (function () {
                if (buffersMemMetric.data.length > 0) {
                    var instance = buffersMemMetric.data[buffersMemMetric.data.length - 1];
                    if (instance.values.length > 0) {
                        return instance.values[instance.values.length - 1];
                    }
                }
            }());

            if (usedValue !== undefined && cachedValue !== undefined && buffersValue !== undefined) {
                returnValues.push({
                    timestamp: usedValue.x,
                    key: 'application',
                    value: usedValue.y - cachedValue.y - buffersValue.y
                });
            }

            if (cachedValue !== undefined && buffersValue !== undefined) {
                returnValues.push({
                    timestamp: usedValue.x,
                    key: 'free (cache)',
                    value: cachedValue.y + buffersValue.y
                });
            }

            if (freeValue !== undefined) {
                returnValues.push({
                    timestamp: usedValue.x,
                    key: 'free (unused)',
                    value: freeValue.y
                });
            }


            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    MemoryMetricTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric('mem.util.cached');
        MetricListService.destroyMetric('mem.util.used');
        MetricListService.destroyMetric('mem.util.free');
        MetricListService.destroyMetric('mem.util.bufmem');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return MemoryMetricTimeSeriesDataModel;
});

datamodels.factory('DiskLatencyTimeSeriesDataModel', function (WidgetDataModel, MetricListService, VectorService) {
    var DiskLatencyTimeSeriesDataModel = function () {
        return this;
    };

    DiskLatencyTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    DiskLatencyTimeSeriesDataModel.prototype.init = function () {
        WidgetDataModel.prototype.init.call(this);

        this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

        var readActiveMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.read_rawactive'),
            writeActiveMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.write_rawactive'),
            readMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.read'),
            writeMetric = MetricListService.getOrCreateCumulativeMetric('disk.dev.write'),
            derivedFunction;

        derivedFunction = function () {
            var returnValues = [],
                rawactiveInstance,
                lastValue,
                rawactiveLastValue,
                value;

            function calculateValues(metric, rawactiveMetric, key, outputArr) {
                if (metric.data.length > 0) {
                    /*jslint unparam: true*/
                    $.each(metric.data, function (index, instance) {
                        rawactiveInstance = _.find(rawactiveMetric.data, function (element) {
                            return element.key === instance.key;
                        });
                        if (rawactiveInstance !== undefined) {
                            if (instance.values.length > 0) {
                                if (rawactiveInstance.values.length > 0) {
                                    lastValue = instance.values[instance.values.length - 1];
                                    rawactiveLastValue = rawactiveInstance.values[instance.values.length - 1];
                                    if (lastValue.y > 0) {
                                        value = rawactiveLastValue.y / lastValue.y;
                                    } else {
                                        value = 0;
                                    }
                                    outputArr.push({
                                        timestamp: lastValue.x,
                                        key: instance.key + key,
                                        value: value
                                    });
                                }
                            }
                        }
                    });
                    /*jslint unparam: false*/
                }
            }

            calculateValues(readMetric, readActiveMetric, ' read latency', returnValues);
            calculateValues(writeMetric, writeActiveMetric, ' write latency', returnValues);

            return returnValues;
        };

        // create derived metric
        this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

        this.updateScope(this.metric.data);
    };

    DiskLatencyTimeSeriesDataModel.prototype.destroy = function () {
        // remove subscribers and delete derived metric
        MetricListService.destroyDerivedMetric(this.name);

        // remove subscribers and delete base metrics
        MetricListService.destroyMetric('disk.dev.read_rawactive');
        MetricListService.destroyMetric('disk.dev.write_rawactive');
        MetricListService.destroyMetric('disk.dev.read');
        MetricListService.destroyMetric('disk.dev.write');

        WidgetDataModel.prototype.destroy.call(this);
    };

    return DiskLatencyTimeSeriesDataModel;
});
