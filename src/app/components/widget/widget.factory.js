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

(function () {
    'use strict';

    /* Widgets */
    function widgetDefinitions(
        MetricDataModel,
        ConvertedMetricDataModel,
        CumulativeMetricDataModel,
        CgroupCPUUsageMetricDataModel,
        CgroupCPUHeadroomMetricDataModel,
        CgroupMemoryUsageMetricTimeSeriesDataModel,
        ContainerMemoryUsageMetricDataModel,
        ContainerNetworkBytesMetricDataModel,
        ContainerMultipleMetricDataModel,
        ContainerMultipleCumulativeMetricDataModel,
        CgroupMemoryHeadroomMetricDataModel,
        MemoryUtilizationMetricDataModel,
        NetworkBytesMetricDataModel,
        CpuUtilizationMetricDataModel,
        PerCpuUtilizationMetricDataModel,
        MultipleMetricDataModel,
        MultipleCumulativeMetricDataModel,
        DummyMetricDataModel,
        DiskLatencyMetricDataModel,
        BccBiolatencyMetricDataModel,
        BccRunqlatMetricDataModel,
        BccFsDistMetricDataModel,
        BccTcplifeMetricDataModel,
        BccExecsnoopMetricDataModel,
        CumulativeUtilizationMetricDataModel,
        CgroupMemoryUtilizationMetricDataModel,
        CustomMetricDataModel,
        config) {

        var handleWidgetFilterSettingsClose = function(resultFromModal, widgetModel) {
            if (typeof resultFromModal !== 'undefined') {
                widgetModel.filter = resultFromModal.filter;
            }
        };

        var definitions = [
            {
                name: 'kernel.all.load',
                title: 'Load Average',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.load'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU'
            }, {
                name: 'kernel.all.runnable',
                title: 'Runnable',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.runnable'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 4,
                    integer: true
                }
            }, {
                name: 'kernel.all.cpu.sys',
                title: 'CPU Utilization (System)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.cpu.sys'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.all.cpu.user',
                title: 'CPU Utilization (User)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.cpu.user'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.all.cpu',
                title: 'CPU Utilization',
                directive: 'area-stacked-time-series',
                dataAttrName: 'data',
                dataModelType: CpuUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.cpu'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.percpu.cpu.sys',
                title: 'Per-CPU Utilization (System)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.percpu.cpu.sys'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.percpu.cpu.user',
                title: 'Per-CPU Utilization (User)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.percpu.cpu.user'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.percpu.cpu',
                title: 'Per-CPU Utilization',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: PerCpuUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.percpu.cpu'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'mem.util.free',
                title: 'Memory Utilization (Free)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: ConvertedMetricDataModel,
                dataModelOptions: {
                    name: 'mem.util.free',
                    conversionFunction: function (value) {
                        return value / 1024 / 1024;
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Memory'
            }, {
                name: 'mem.util.used',
                title: 'Memory Utilization (Used)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: ConvertedMetricDataModel,
                dataModelOptions: {
                    name: 'mem.util.used',
                    conversionFunction: function (value) {
                        return value / 1024 / 1024;
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Memory'
            }, {
                name: 'mem.util.cached',
                title: 'Memory Utilization (Cached)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: ConvertedMetricDataModel,
                dataModelOptions: {
                    name: 'mem.util.cached',
                    conversionFunction: function (value) {
                        return value / 1024 / 1024;
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Memory'
            }, {
                name: 'mem',
                title: 'Memory Utilization',
                directive: 'area-stacked-time-series',
                dataAttrName: 'data',
                dataModelType: MemoryUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'mem'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Memory',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.interface.out.drops',
                title: 'Network Drops (Out)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'network.interface.out.drops'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    forcey: 10,
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.interface.in.drops',
                title: 'Network Drops (In)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'network.interface.in.drops'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    forcey: 10,
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.interface.drops',
                title: 'Network Drops',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleMetricDataModel,
                dataModelOptions: {
                    name: 'network.interface.drops',
                    metricDefinitions: {
                        '{key} in': 'network.interface.in.drops',
                        '{key} out': 'network.interface.out.drops'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    forcey: 10,
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.tcpconn.established',
                title: 'TCP Connections (Estabilished)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'network.tcpconn.established'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.tcpconn.time_wait',
                title: 'TCP Connections (Time Wait)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'network.tcpconn.time_wait'
                },
                enableVerticalResize: false,
                size: {
                    width: '50%',
                    height: '250px'
                },
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.tcpconn.close_wait',
                title: 'TCP Connections (Close Wait)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MetricDataModel,
                dataModelOptions: {
                    name: 'network.tcpconn.close_wait'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.tcpconn',
                title: 'TCP Connections',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleMetricDataModel,
                dataModelOptions: {
                    name: 'network.tcpconn',
                    metricDefinitions: {
                        'established': 'network.tcpconn.established',
                        'time_wait': 'network.tcpconn.time_wait',
                        'close_wait': 'network.tcpconn.close_wait'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.interface.bytes',
                title: 'Network Throughput (kB)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: NetworkBytesMetricDataModel,
                dataModelOptions: {
                    name: 'network.interface.bytes'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/widgetFilterSettings/widgetFilterSettings.html',
                    controller: 'WidgetFilterSettingsController'
                },
                hasLocalSettings: true,
                onSettingsClose: handleWidgetFilterSettingsClose,
                filter: ''
            }, {
                name: 'disk.iops',
                title: 'Disk IOPS',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleCumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'disk.iops',
                    metricDefinitions: {
                        '{key} read': 'disk.dev.read',
                        '{key} write': 'disk.dev.write'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Disk'
            }, {
                name: 'disk.bytes',
                title: 'Disk Throughput (Bytes)',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleCumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'disk.bytes',
                    metricDefinitions: {
                        '{key} read': 'disk.dev.read_bytes',
                        '{key} write': 'disk.dev.write_bytes'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Disk'
            }, {
                name: 'disk.dev.avactive',
                title: 'Disk Utilization',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeUtilizationMetricDataModel,
                dataModelOptions: {
                    name: 'disk.dev.avactive'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Disk',
                attrs: {
                    forcey: 1,
                    percentage: true,
                    integer: false
                }
            }, {
                name: 'kernel.all.pswitch',
                title: 'Context Switches',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'kernel.all.pswitch'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'CPU',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'mem.vmstat.pgfault',
                title: 'Page Faults',
                directive: 'area-stacked-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleCumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'mem.vmstat.pgfault',
                    metricDefinitions: {
                        'page faults': 'mem.vmstat.pgfault',
                        'major page faults': 'mem.vmstat.pgmajfault'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Memory',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'network.interface.packets',
                title: 'Network Packets',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleCumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'network.interface.packets',
                    metricDefinitions: {
                        '{key} in': 'network.interface.in.packets',
                        '{key} out': 'network.interface.out.packets'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    percentage: false,
                    integer: true
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/widgetFilterSettings/widgetFilterSettings.html',
                    controller: 'WidgetFilterSettingsController'
                },
                hasLocalSettings: true,
                onSettingsClose: handleWidgetFilterSettingsClose,
                filter: ''
            }, {
                name: 'network.tcp.retrans',
                title: 'Network Retransmits',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: MultipleCumulativeMetricDataModel,
                dataModelOptions: {
                    name: 'network.tcp.retrans',
                    metricDefinitions: {
                        'retranssegs': 'network.tcp.retranssegs',
                        'timeouts': 'network.tcp.timeouts',
                        'listendrops': 'network.tcp.listendrops',
                        'fastretrans': 'network.tcp.fastretrans',
                        'slowstartretrans': 'network.tcp.slowstartretrans',
                        'synretrans': 'network.tcp.synretrans'
                    }
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Network',
                attrs: {
                    forcey: 10,
                    percentage: false,
                    integer: true
                }
            }, {
                name: 'disk.dev.latency',
                title: 'Disk Latency',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: DiskLatencyMetricDataModel,
                dataModelOptions: {
                    name: 'disk.dev.latency'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Disk',
                attrs: {
                    percentage: false,
                    integer: true
                }
            }
        ];

        if (config.enableFlameGraphs) {
          definitions.push({
            name: 'graph.flame.cpu.task',
            title: 'CPU Flame Graph (Task)',
            directive: 'cpu-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          }, {
            name: 'graph.flame.pnamecpu.task',
            title: 'Package Name CPU Flame Graph (Task)',
            directive: 'p-name-cpu-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          }, {
            name: 'graph.flame.uninlined.task',
            title: 'Uninlined CPU Flame Graph (Task)',
            directive: 'uninlined-cpu-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          }, {
            name: 'graph.flame.pagefault.task',
            title: 'Page Fault Flame Graph (Task)',
            directive: 'pagefault-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          }, {
            name: 'graph.flame.diskio.task',
            title: 'Disk I/O Flame Graph (Task)',
            directive: 'diskio-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          }, {
            name: 'graph.flame.ipc.task',
            title: 'IPC Flame Graph (Task)',
            directive: 'ipc-flame-graph',
            dataModelType: DummyMetricDataModel,
            size: {
              width: '50%',
              height: '250px'
            },
            enableVerticalResize: false,
            group: 'Task',
            settingsModalOptions: {
                templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                controller: 'CustomWidgetHelpController'
            },
            hasLocalHelp: true,
            isContainerAware: true
          });
        }

        if (config.enableBpfFlameGraphs) {
          definitions.push(
            {
                name: 'graph.flame.csw.task',
                title: 'Context Switch Flame Graph (Task)',
                directive: 'csw-flame-graph',
                dataModelType: DummyMetricDataModel,
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Task',
                settingsModalOptions: {
                    templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                    controller: 'CustomWidgetHelpController'
                },
                hasLocalHelp: true,
                hasHighOverhead: true,
                isContainerAware: false
            }, {
                name: 'graph.flame.offcpu.task',
                title: 'Off-CPU Time Flame Graph (Task)',
                directive: 'off-c-p-u-flame-graph',
                dataModelType: DummyMetricDataModel,
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Task',
                settingsModalOptions: {
                    templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                    controller: 'CustomWidgetHelpController'
                },
                hasLocalHelp: true,
                hasHighOverhead: true,
                isContainerAware: false
            }, {
                name: 'graph.flame.offwake.task',
                title: 'Off-Wake Time Flame Graph (Task)',
                directive: 'off-wake-flame-graph',
                dataModelType: DummyMetricDataModel,
                size: {
                    width: '50%',
                    height: '250px'
                },
                enableVerticalResize: false,
                group: 'Task',
                settingsModalOptions: {
                    templateUrl: 'app/components/customWidgetHelp/customWidgetHelp.html',
                    controller: 'CustomWidgetHelpController'
                },
                hasLocalHelp: true,
                hasHighOverhead: true,
                isContainerAware: false
            }
          );
        }

        var handleCustomWidgetSettingsClose = function(resultFromModal, widgetModel) {
            if (typeof resultFromModal !== 'undefined') {
                widgetModel.dataModel.destroy();
                widgetModel.name = resultFromModal.name;
                widgetModel.title = resultFromModal.title;
                widgetModel.dataModelType = resultFromModal.dataModelType;
                widgetModel.dataModelOptions.name = resultFromModal.dataModelOptions.name;
                widgetModel.dataModelOptions.isCumulative = resultFromModal.dataModelOptions.isCumulative;
                widgetModel.dataModelOptions.isConverted = resultFromModal.dataModelOptions.isConverted;
                widgetModel.dataModelOptions.strConversionFunction = resultFromModal.dataModelOptions.strConversionFunction;
                widgetModel.attrs.forcey = resultFromModal.attrs.forcey;
                widgetModel.attrs.integer = resultFromModal.attrs.integer;
                widgetModel.attrs.percentage = resultFromModal.attrs.percentage;
                widgetModel.attrs.area = resultFromModal.attrs.area;
                widgetModel.enableVerticalResize = resultFromModal.enableVerticalResize;
                widgetModel.dataModel.init();
                widgetModel.dataModel.widgetScope.compileTemplate();
            }
        };

        if (config.enableCustomWidgetFeature) {
            definitions.push({
                name: 'custom.metric',
                title: 'Custom Metric',
                directive: 'line-time-series',
                dataAttrName: 'data',
                dataModelType: CustomMetricDataModel,
                dataModelOptions: {
                    name: '',
                    isCumulative: false,
                    isConverted: false,
                    strConversionFunction: 'value'
                },
                size: {
                    width: '50%',
                    height: '250px'
                },
                attrs: {
                    forcey: null,
                    percentage: false,
                    integer: true,
                    area: false
                },
                enableVerticalResize: false,
                group: 'Custom',
                settingsModalOptions: {
                    templateUrl: 'app/components/customWidgetSettings/customWidgetSettings.html',
                    controller: 'CustomWidgetSettingsController'
                },
                hasLocalSettings: true,
                onSettingsClose: handleCustomWidgetSettingsClose
            })
        }

        if (config.enableContainerWidgets) {
            definitions.push(
                {
                    name: 'cgroup.cpuacct.usage',
                    title: 'Per-Container CPU Utilization',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: CgroupCPUUsageMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.cpuacct.usage'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    requireContainerFilter: true,
                    attrs: {
                        forcey: 1,
                        percentage: true,
                        integer: false
                    }
                }, {
                    name: 'cgroup.memory.usage',
                    title: 'Per-Container Memory Usage (Mb)',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: CgroupMemoryUsageMetricTimeSeriesDataModel,
                    dataModelOptions: {
                        name: 'cgroup.memory.usage'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true,
                        forcey: 10
                    }
                }, {
                    name: 'container.memory.usage',
                    title: 'Total Container Memory Usage (Mb)',
                    directive: 'area-stacked-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMemoryUsageMetricDataModel,
                    dataModelOptions: {
                        name: 'container.memory.usage'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.memory.headroom',
                    title: 'Per-Container Memory Headroom (Mb)',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: CgroupMemoryHeadroomMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.memory.headroom'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    requireContainerFilter: true,
                    attrs: {
                        forcey: 1,
                        percentage: false,
                        integer: true,
                        area: true
                    }
                }, {
                    name: 'cgroup.blkio.all.io_serviced',
                    title: 'Container Disk IOPS',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleCumulativeMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.blkio.all.io_serviced',
                        metricDefinitions: {
                            '{key} read': 'cgroup.blkio.all.io_serviced.read',
                            '{key} write': 'cgroup.blkio.all.io_serviced.write'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.blkio.all.io_service_bytes',
                    title: 'Container Disk Throughput (Bytes)',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleCumulativeMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.blkio.all.io_service_bytes',
                        metricDefinitions: {
                            '{key} read': 'cgroup.blkio.all.io_service_bytes.read',
                            '{key} write': 'cgroup.blkio.all.io_service_bytes.write'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.blkio.all.throttle.io_serviced',
                    title: 'Container Disk IOPS (Throttled)',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleCumulativeMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.blkio.all.throttle.io_serviced',
                        metricDefinitions: {
                            '{key} read': 'cgroup.blkio.all.throttle.io_serviced.read',
                            '{key} write': 'cgroup.blkio.all.throttle.io_serviced.write'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.blkio.all.throttle.io_service_bytes',
                    title: 'Container Disk Throughput (Throttled) (Bytes)',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleCumulativeMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.blkio.all.throttle.io_service_bytes',
                        metricDefinitions: {
                            '{key} read': 'cgroup.blkio.all.throttle.io_service_bytes.read',
                            '{key} write': 'cgroup.blkio.all.throttle.io_service_bytes.write'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.cpusched',
                    title: 'Per-Container CPU Scheduler',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.cpusched',
                        metricDefinitions: {
                            '{key} shares': 'cgroup.cpusched.shares',
                            '{key} periods': 'cgroup.cpusched.periods'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.cpuacct.headroom',
                    title: 'Per-Container CPU Headroom',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: CgroupCPUHeadroomMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.cpuacct.headroom'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    requireContainerFilter: true,
                    attrs: {
                        forcey: 1,
                        percentage: true,
                        integer: false,
                        area: true
                    }
                }, {
                    name: 'cgroup.cpusched.throttled_time',
                    title: 'Per-Container Throttled CPU',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: ContainerMultipleCumulativeMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.cpusched.throttled_time',
                        metricDefinitions: {
                            '{key}': 'cgroup.cpusched.throttled_time'
                        }
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    attrs: {
                        forcey: 5,
                        percentage: false,
                        integer: true
                    }
                }, {
                    name: 'cgroup.memory.utilization',
                    title: 'Per-Container Memory Utilization',
                    directive: 'line-time-series',
                    dataAttrName: 'data',
                    dataModelType: CgroupMemoryUtilizationMetricDataModel,
                    dataModelOptions: {
                        name: 'cgroup.memory.utilization'
                    },
                    size: {
                        width: '50%',
                        height: '250px'
                    },
                    enableVerticalResize: false,
                    group: 'Container',
                    requireContainerFilter: true,
                    attrs: {
                        forcey: 1,
                        percentage: true,
                        integer: false,
                        area: false
                    }
                }

            );

        }

        if (config.enableBcc) {
            definitions.push({
                name: 'bcc.disk.dev.latency',
                title: 'BCC biolatency (block device I/O latency)',
                directive: 'heatmap',
                dataAttrName: 'data',
                dataModelType: BccBiolatencyMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.disk.dev.latency'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                    unit: "'us'"
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/heatmap/heatmapSettings.html',
                    controller: 'HeatmapSettingsController'
                },
                hasLocalSettings: true,
                heatmapMaxRow: 4095,
                heatmapMaxValue: 1000
            });

            definitions.push({
                name: 'bcc.runq.latency',
                title: 'BCC runqlat (run queue latency)',
                directive: 'heatmap',
                dataAttrName: 'data',
                dataModelType: BccRunqlatMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.runq.latency'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                    unit: "'us'"
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/heatmap/heatmapSettings.html',
                    controller: 'HeatmapSettingsController'
                },
                hasLocalSettings: true,
                heatmapMaxRow: 2097151,
                heatmapMaxValue: 10
            });

            definitions.push({
                name: 'bcc.fs.ext4.latency',
                title: 'BCC ext4dist (ext4 operation latencies)',
                directive: 'heatmap',
                dataAttrName: 'data',
                dataModelType: BccFsDistMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.fs.ext4.latency',
                    operation: 'open'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                    unit: "'us'"
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/heatmap/heatmapSettings.html',
                    controller: 'HeatmapSettingsController'
                },
                hasLocalSettings: true,
                heatmapMaxRow: 2097151,
                heatmapMaxValue: 100
            });

            definitions.push({
                name: 'bcc.fs.xfs.latency',
                title: 'BCC xfsdist (xfs operation latencies)',
                directive: 'heatmap',
                dataAttrName: 'data',
                dataModelType: BccFsDistMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.fs.xfs.latency',
                    operation: 'open'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                    unit: "'us'"
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/heatmap/heatmapSettings.html',
                    controller: 'HeatmapSettingsController'
                },
                hasLocalSettings: true,
                heatmapMaxRow: 2097151,
                heatmapMaxValue: 100
            });

            definitions.push({
                name: 'bcc.fs.zfs.latency',
                title: 'BCC zfsdist (zfs operation latencies)',
                directive: 'heatmap',
                dataAttrName: 'data',
                dataModelType: BccFsDistMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.fs.zfs.latency',
                    operation: 'open'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                    unit: "'us'"
                },
                settingsModalOptions: {
                    templateUrl: 'app/components/heatmap/heatmapSettings.html',
                    controller: 'HeatmapSettingsController'
                },
                hasLocalSettings: true,
                heatmapMaxRow: 2097151,
                heatmapMaxValue: 100
            });

            definitions.push({
                name: 'bcc.proc.io.net.tcp',
                title: 'BCC tcplife (TCP sessions)',
                directive: 'table',
                dataAttrName: 'data',
                dataModelType: BccTcplifeMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.proc.io.net.tcp'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                }
            });

            definitions.push({
                name: 'bcc.proc.exec',
                title: 'BCC execsnoop (traces new processes)',
                directive: 'table',
                dataAttrName: 'data',
                dataModelType: BccExecsnoopMetricDataModel,
                dataModelOptions: {
                    name: 'bcc.proc.exec'
                },
                size: {
                    width: '50%',
                    height: '500px'
                },
                enableVerticalResize: true,
                group: 'BCC',
                attrs: {
                }
            });
        }

        return definitions;
    }

    var defaultWidgets = [
        {
            name: 'kernel.all.cpu',
            size: {
                width: '50%'
            }
        }, {
            name: 'kernel.percpu.cpu',
            size: {
                width: '50%'
            }
        }, {
            name: 'kernel.all.runnable',
            size: {
                width: '50%'
            }
        }, {
            name: 'kernel.all.load',
            size: {
                width: '50%'
            }
        }, {
            name: 'network.interface.bytes',
            size: {
                width: '50%'
            }
        }, {
            name: 'network.tcpconn',
            size: {
                width: '50%'
            }
        }, {
            name: 'network.interface.packets',
            size: {
                width: '50%'
            }
        }, {
            name: 'network.tcp.retrans',
            size: {
                width: '50%'
            }
        }, {
            name: 'mem',
            size: {
                width: '50%'
            }
        }, {
            name: 'mem.vmstat.pgfault',
            size: {
                width: '50%'
            }
        }, {
            name: 'kernel.all.pswitch',
            size: {
                width: '50%'
            }
        }, {
            name: 'disk.iops',
            size: {
                width: '50%'
            }
        }, {
            name: 'disk.bytes',
            size: {
                width: '50%'
            }
        }, {
            name: 'disk.dev.avactive',
            size: {
                width: '50%'
            }
        }, {
            name: 'disk.dev.latency',
            size: {
                width: '50%'
            }
        }
    ];

    var emptyWidgets = [];

    var containerWidgets = [
        {
            name: 'cgroup.cpuacct.usage',
            size: {
                width: '50%'
            }
        }, {
            name: 'container.memory.usage',
            size: {
                width: '50%'
            }
        }, {
            name: 'cgroup.memory.usage',
            size: {
                width: '50%'
            }
        }, {
            name: 'cgroup.memory.headroom',
            size: {
                width: '50%'
            }
        }, {
            name: 'container.disk.iops',
            size: {
                width: '50%'
            }
        }, {
            name: 'container.disk.bytes',
            size: {
                width: '50%'
            }
        }
    ];

    angular
        .module('widget', [
            'datamodel',
            'chart',
            'flamegraph',
            'pnamecpuflamegraphtask',
            'uninlinedcpuflamegraphtask',
            'pagefaultflamegraphtask',
            'diskioflamegraphtask',
            'ipcflamegraphtask',
            'cswflamegraphtask',
            'offcpuflamegraphtask',
            'offwakeflamegraphtask',
            'heatmap',
            'table',
            'customWidgetSettings',
            'customWidgetHelp',
            'widgetFilterSettings'
        ])
        .factory('widgetDefinitions', widgetDefinitions)
        .value('defaultWidgets', defaultWidgets)
        .value('emptyWidgets', emptyWidgets)
        .value('containerWidgets', containerWidgets);

})();
