/*jslint node: true*/
/*global angular*/

'use strict';

/* Widgets */

var widgets = angular.module('app.widgets', []);

widgets.factory('widgetDefinitions', function (MetricTimeSeriesDataModel,
                                               CummulativeMetricTimeSeriesDataModel,
                                               MemoryMetricTimeSeriesDataModel,
                                               NetworkBytesMetricTimeSeriesDataModel,
                                               CpuUtilizationMetricTimeSeriesDataModel,
                                               PerCpuUtilizationMetricTimeSeriesDataModel,
                                               MultipleMetricTimeSeriesDataModel,
                                               MultipleCummulativeMetricTimeSeriesDataModel,
                                               DummyMetricDataModel,
                                               DiskLatencyTimeSeriesDataModel,
                                               CummulativeUtilizationMetricTimeSeriesDataModel) {
    return [
        {
            name: 'kernel.all.load',
            title: 'Load Average',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.load'
            },
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'kernel.all.cpu.sys',
            title: 'CPU Utilization (System)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.cpu.sys'
            },
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'kernel.all.cpu.user',
            title: 'CPU Utilization (User)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.cpu.user'
            },
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'kernel.percpu.cpu.sys',
            title: 'Per-CPU Utilization (System)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.percpu.cpu.sys'
            },
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'kernel.percpu.cpu.user',
            title: 'Per-CPU Utilization (User)',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.percpu.cpu.user'
            },
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
            group: "Network"
        }, {
            name: 'network.tcp.retranssegs',
            title: 'TCP Retransmits',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcp.retranssegs'
            },
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
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
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
            group: "Network"
        }, {
            name: 'network.interface.bytes',
            title: 'Network kB',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: NetworkBytesMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.bytes'
            },
            style: {
                width: '25%'
            },
            group: "Network"
        }, {
            name: 'disk.iops',
            title: 'Disk IOPS',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.iops',
                metricDefinitions: {
                    "{key} read": "disk.dev.read",
                    "{key} write": "disk.dev.write"
                }
            },
            style: {
                width: '25%'
            },
            group: "Disk"
        }, {
            name: 'disk.bytes',
            title: 'Disk Bytes',
            directive: 'line-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.bytes',
                metricDefinitions: {
                    "{key} read": "disk.dev.read_bytes",
                    "{key} write": "disk.dev.write_bytes"
                }
            },
            style: {
                width: '25%'
            },
            group: "Disk"
        }, {
            name: 'disk.dev.avactive',
            title: 'Disk Utilization',
            directive: 'line-percentage-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeUtilizationMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'disk.dev.avactive'
            },
            style: {
                width: '25%'
            },
            group: "Disk"
        }, {
            name: 'kernel.all.pswitch',
            title: 'Context Switches',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: CummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'kernel.all.pswitch'
            },
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'mem.vmstat.pgfault',
            title: 'Page Faults',
            directive: 'area-stacked-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'mem.vmstat.pgfault',
                metricDefinitions: {
                    "page faults": "mem.vmstat.pgfault",
                    "major page faults": "mem.vmstat.pgmajfault"
                }
            },
            style: {
                width: '25%'
            },
            group: "Memory"
        }, {
            name: 'graph.flame.cpu',
            title: 'CPU Flame Graph',
            directive: 'cpu-flame-graph',
            dataModelType: DummyMetricDataModel,
            style: {
                width: '25%'
            },
            group: "CPU"
        }, {
            name: 'graph.heatmap.disk',
            title: 'Disk Latency Heat Map',
            directive: 'disk-latency-heat-map',
            dataModelType: DummyMetricDataModel,
            style: {
                width: '25%'
            },
            group: "Disk"
        }, {
            name: 'network.interface.packets',
            title: 'Network Packets',
            directive: 'line-integer-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.interface.packets',
                metricDefinitions: {
                    "{key} in": "network.interface.in.packets",
                    "{key} out": "network.interface.out.packets"
                }
            },
            style: {
                width: '25%'
            },
            group: "Network"
        }, {
            name: 'network.tcp.retrans',
            title: 'Network Retransmits',
            directive: 'line-integer-force-y-time-series',
            dataAttrName: 'data',
            dataModelType: MultipleCummulativeMetricTimeSeriesDataModel,
            dataModelOptions: {
                name: 'network.tcp.retrans',
                metricDefinitions: {
                    "timeouts": "network.tcp.timeouts",
                    "listendrops": "network.tcp.listendrops",
                    "fastretrans": "network.tcp.fastretrans",
                    "slowstartretrans": "network.tcp.slowstartretrans",
                    "syncretrans": "network.tcp.syncretrans"
                }
            },
            style: {
                width: '25%'
            },
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
            style: {
                width: '25%'
            },
            group: "Disk"
        }
    ];
});

widgets.value('defaultWidgets', [
    {
        name: 'kernel.all.cpu',
        style: {
            width: '25%'
        }
    }, {
        name: 'kernel.percpu.cpu',
        style: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.runnable',
        style: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.load',
        style: {
            width: '25%'
        }
    }, {
        name: 'network.interface.bytes',
        style: {
            width: '25%'
        }
    }, {
        name: 'network.tcpconn',
        style: {
            width: '25%'
        }
    }, {
        name: 'network.interface.packets',
        style: {
            width: '25%'
        }
    }, {
        name: 'network.tcp.retranssegs',
        style: {
            width: '25%'
        }
    }, {
        name: 'mem',
        style: {
            width: '50%'
        }
    }, {
        name: 'mem.vmstat.pgfault',
        style: {
            width: '25%'
        }
    }, {
        name: 'kernel.all.pswitch',
        style: {
            width: '25%'
        }
    }, {
        name: 'disk.iops',
        style: {
            width: '25%'
        }
    }, {
        name: 'disk.bytes',
        style: {
            width: '25%'
        }
    }, {
        name: 'disk.dev.avactive',
        style: {
            width: '25%'
        }
    }, {
        name: 'disk.dev.latency',
        style: {
            width: '25%'
        }
    }
]);

widgets.value('javaWidgets', [
]);