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
/*global angular*/

'use strict';

/* Widgets */

var widgets = angular.module('app.widgets', []);

widgets.factory('widgetDefinitions', function (MetricTimeSeriesDataModel,
                                               CumulativeMetricTimeSeriesDataModel,
                                               MemoryMetricTimeSeriesDataModel,
                                               NetworkBytesMetricTimeSeriesDataModel,
                                               CpuUtilizationMetricTimeSeriesDataModel,
                                               PerCpuUtilizationMetricTimeSeriesDataModel,
                                               MultipleMetricTimeSeriesDataModel,
                                               MultipleCumulativeMetricTimeSeriesDataModel,
                                               DummyMetricDataModel,
                                               DiskLatencyTimeSeriesDataModel,
                                               CumulativeUtilizationMetricTimeSeriesDataModel,
                                               vectorConfig) {
    var definitions = [
        {
            name: 'kernel.all.load',
            title: 'Load Average',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.load'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.all.runnable',
            title: 'Runnable',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.runnable'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.all.cpu.sys',
            title: 'CPU Utilization (System)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.cpu.sys'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.all.cpu.user',
            title: 'CPU Utilization (User)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.cpu.user'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.all.cpu',
            title: 'CPU Utilization',
            directive: 'area-stacked-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CpuUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.cpu'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.percpu.cpu.sys',
            title: 'Per-CPU Utilization (System)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.percpu.cpu.sys'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.percpu.cpu.user',
            title: 'Per-CPU Utilization (User)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.percpu.cpu.user'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'kernel.percpu.cpu',
            title: 'Per-CPU Utilization',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: PerCpuUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.percpu.cpu'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'mem.freemem',
            title: 'Memory Utilization (Free)',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem.freemem'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Memory"
        }, {
            name: 'mem.util.used',
            title: 'Memory Utilization (Used)',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem.util.used'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Memory"
        }, {
            name: 'mem.util.cached',
            title: 'Memory Utilization (Cached)',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem.util.cached'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Memory"
        }, {
            name: 'mem',
            title: 'Memory Utilization',
            directive: 'area-stacked-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MemoryMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Memory"
        }, {
            name: 'network.interface.out.drops',
            title: 'Network Drops (Out)',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.out.drops'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.interface.in.drops',
            title: 'Network Drops (In)',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.in.drops'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.interface.drops',
            title: 'Network Drops',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.drops',
                metricDefinitions: {
                    "{key} in": "network.interface.in.drops",
                    "{key} out": "network.interface.out.drops"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.tcpconn.established',
            title: 'TCP Connections (Estabilished)',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcpconn.established'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.tcpconn.time_wait',
            title: 'TCP Connections (Time Wait)',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcpconn.time_wait'
            },
            enableVerticalResize: false,
            size: {
                width: '25%',
                height: '250px'
            },
            group: "Network"
        }, {
            name: 'network.tcpconn.close_wait',
            title: 'TCP Connections (Close Wait)',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcpconn.close_wait'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.tcpconn',
            title: 'TCP Connections',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcpconn',
                metricDefinitions: {
                    "established": "network.tcpconn.established",
                    "time_wait": "network.tcpconn.time_wait",
                    "close_wait": "network.tcpconn.close_wait"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.interface.bytes',
            title: 'Network Throughput (kB)',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: NetworkBytesMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.bytes'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'disk.iops',
            title: 'Disk IOPS',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.iops',
                metricDefinitions: {
                    "{key} read": "disk.dev.read",
                    "{key} write": "disk.dev.write"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Disk"
        }, {
            name: 'disk.bytes',
            title: 'Disk Throughput (Bytes)',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.bytes',
                metricDefinitions: {
                    "{key} read": "disk.dev.read_bytes",
                    "{key} write": "disk.dev.write_bytes"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Disk"
        }, {
            name: 'disk.dev.avactive',
            title: 'Disk Utilization',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.dev.avactive'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Disk"
        }, {
            name: 'kernel.all.pswitch',
            title: 'Context Switches',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: CumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.pswitch'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "CPU"
        }, {
            name: 'mem.vmstat.pgfault',
            title: 'Page Faults',
            directive: 'area-stacked-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem.vmstat.pgfault',
                metricDefinitions: {
                    "page faults": "mem.vmstat.pgfault",
                    "major page faults": "mem.vmstat.pgmajfault"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Memory"
        }, {
            name: 'network.interface.packets',
            title: 'Network Packets',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.packets',
                metricDefinitions: {
                    "{key} in": "network.interface.in.packets",
                    "{key} out": "network.interface.out.packets"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'network.tcp.retrans',
            title: 'Network Retransmits',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCumulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcp.retrans',
                metricDefinitions: {
                    "retranssegs": "network.tcp.retranssegs",
                    "timeouts": "network.tcp.timeouts",
                    "listendrops": "network.tcp.listendrops",
                    "fastretrans": "network.tcp.fastretrans",
                    "slowstartretrans": "network.tcp.slowstartretrans",
                    "syncretrans": "network.tcp.syncretrans"
                }
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Network"
        }, {
            name: 'disk.dev.latency',
            title: 'Disk Latency',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: DiskLatencyTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.dev.latency'
            },
            size: {
                width: '25%',
                height: '250px'
            },
            enableVerticalResize: false,
            group: "Disk"
        }
    ];

    if (vectorConfig.enableCpuFlameGraph) {
      definitions.push({
        name: 'graph.flame.cpu',
        title: 'CPU Flame Graph',
        directive: 'cpu-flame-graph',
        dataModelType: DummyMetricDataModel,
        size: {
          width: '25%',
          height: '250px'
        },
        enableVerticalResize: false,
        group: "CPU"
      })
    }

    if (vectorConfig.enableDiskLatencyHeatMap) {
      definitions.push({
        name: 'graph.heatmap.disk',
        title: 'Disk Latency Heat Map',
        directive: 'disk-latency-heat-map',
        dataModelType: DummyMetricDataModel,
        size: {
          width: '25%',
          height: '250px'
        },
        enableVerticalResize: false,
        group: "Disk"
      })
    }

    return definitions;
});



widgets.value('defaultWidgets', [
    {
        name: 'kernel.all.cpu',
        size: {
            width: '25%'
        }
    }, {
        name: 'kernel.percpu.cpu',
        size: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.runnable',
        size: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.load',
        size: {
            width: '25%'
        }
    }, {
        name: 'network.interface.bytes',
        size: {
            width: '25%'
        }
    }, {
        name: 'network.tcpconn',
        size: {
            width: '25%'
        }
    }, {
        name: 'network.interface.packets',
        size: {
            width: '25%'
        }
    }, {
        name: 'network.tcp.retrans',
        size: {
            width: '25%'
        }
    }, {
        name: 'mem',
        size: {
            width: '50%'
        }
    }, {
        name: 'mem.vmstat.pgfault',
        size: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.pswitch',
        size: {
            width: '25%'
        }
    }, {
        name: 'disk.iops',
        size: {
            width: '25%'
        }
    }, {
        name: 'disk.bytes',
        size: {
            width: '25%'
        }
    }, {
        name: 'disk.dev.avactive',
        size: {
            width: '25%'
        }
    }, {
        name: 'disk.dev.latency',
        size: {
            width: '25%'
        }
    }
]);

widgets.value('emptyWidgets', [
]);
