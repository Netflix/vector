import simpleModel from '../processors/simpleModel'
import {
  customTitleAndKeylabel,
  divideByOnlyMetric,
  renameMetric,
  onlyLatestValues,
  filterKeepSelectedMetrics,
  mapInstanceDomains,
  ceiling,
  cumulativeTransform,
  mathValuesSelective,
  filterAboveMaxInstanceValue,
} from '../processors/transforms'
import MultiTable from '../components/Charts/MultiTable.jsx'
import SimpleTable from '../components/Charts/SimpleTable.jsx'
import Heatmap from '../components/Charts/Heatmap.jsx'
import HeatmapSettingsModal from '../components/SettingsModals/HeatmapSettingsModal.jsx'
import { thresholds, colors } from '../components/Charts/cividis.js'

export default function _charts(config) {
  if (!config.enableBcc) return []

  return [
    {
      chartId: 'bcc-biolatency',
      group: 'BCC/BPF',
      title: 'biolatency',
      tooltipText: 'block device I/O latency heatmap',
      processor: simpleModel,
      visualisation: Heatmap,
      metricNames: [
        'bcc.disk.all.latency'
      ],
      transforms: [
        cumulativeTransform(),
        ceiling(),
        mapInstanceDomains('yAxisLabels'),
        filterAboveMaxInstanceValue(),
      ],
      settingsComponent: HeatmapSettingsModal,
      heatmap: { thresholds, colors },
    },

    {
      chartId: 'bcc-runqlat',
      group: 'BCC/BPF',
      title: 'runqlat',
      tooltipText: 'run queue latency heatmap',
      processor: simpleModel,
      visualisation: Heatmap,
      metricNames: [
        'bcc.runq.latency'
      ],
      transforms: [
        cumulativeTransform(),
        ceiling(),
        mapInstanceDomains('yAxisLabels'),
        filterAboveMaxInstanceValue(),
      ],
      settingsComponent: HeatmapSettingsModal,
      heatmap: { thresholds, colors },
    },

    {
      chartId: 'bcc-ext4lat',
      group: 'BCC/BPF',
      title: 'ext4dist',
      tooltipText: 'ext4 operation latencies (open, read, write, fsync)',
      processor: simpleModel,
      visualisation: Heatmap,
      metricNames: [
        'bcc.fs.ext4.latency.open',
        'bcc.fs.ext4.latency.read',
        'bcc.fs.ext4.latency.write',
        'bcc.fs.ext4.latency.fsync',
      ],
      transforms: [
        cumulativeTransform(),
        ceiling(),
        filterKeepSelectedMetrics('selectedMetrics'),
        mapInstanceDomains('yAxisLabels'),
        filterAboveMaxInstanceValue(),
      ],
      settingsComponent: HeatmapSettingsModal,
      heatmap: { thresholds, colors },
      selectedMetrics: [
        'bcc.fs.ext4.latency.open',
        'bcc.fs.ext4.latency.read',
        'bcc.fs.ext4.latency.write',
        'bcc.fs.ext4.latency.fsync',
      ],
    },

    {
      chartId: 'bcc-xfslat',
      group: 'BCC/BPF',
      title: 'xfsdist',
      tooltipText: 'xfs operation latencies (open, read, write, fsync)',
      processor: simpleModel,
      visualisation: Heatmap,
      metricNames: [
        'bcc.fs.xfs.latency.open',
        'bcc.fs.xfs.latency.read',
        'bcc.fs.xfs.latency.write',
        'bcc.fs.xfs.latency.fsync',
      ],
      transforms: [
        cumulativeTransform(),
        ceiling(),
        filterKeepSelectedMetrics('selectedMetrics'),
        mapInstanceDomains('yAxisLabels'),
        filterAboveMaxInstanceValue(),
      ],
      settingsComponent: HeatmapSettingsModal,
      heatmap: { thresholds, colors },
      selectedMetrics: [
        'bcc.fs.xfs.latency.open',
        'bcc.fs.xfs.latency.read',
        'bcc.fs.xfs.latency.write',
        'bcc.fs.xfs.latency.fsync',
      ],
    },

    {
      chartId: 'bcc-zfslat',
      group: 'BCC/BPF',
      title: 'zfsdist',
      tooltipText: 'zfs operation latencies (open, read, write, fsync)',
      processor: simpleModel,
      visualisation: Heatmap,
      metricNames: [
        'bcc.fs.zfs.latency.open',
        'bcc.fs.zfs.latency.read',
        'bcc.fs.zfs.latency.write',
        'bcc.fs.zfs.latency.fsync',
      ],
      transforms: [
        cumulativeTransform(),
        ceiling(),
        filterKeepSelectedMetrics('selectedMetrics'),
        mapInstanceDomains('yAxisLabels'),
        filterAboveMaxInstanceValue(),
      ],
      settingsComponent: HeatmapSettingsModal,
      heatmap: { thresholds, colors },
      selectedMetrics: [
        'bcc.fs.zfs.latency.open',
        'bcc.fs.zfs.latency.read',
        'bcc.fs.zfs.latency.write',
        'bcc.fs.zfs.latency.fsync',
      ],
    },

    {
      chartId: 'bcc-tcplife',
      group: 'BCC/BPF',
      title: 'tcplife',
      tooltipText: 'TCP session life and data rates',
      processor: simpleModel,
      visualisation: MultiTable,
      metricNames: [
        'bcc.proc.io.net.tcp.pid',
        'bcc.proc.io.net.tcp.comm',
        'bcc.proc.io.net.tcp.laddr',
        'bcc.proc.io.net.tcp.lport',
        'bcc.proc.io.net.tcp.daddr',
        'bcc.proc.io.net.tcp.dport',
        'bcc.proc.io.net.tcp.tx',
        'bcc.proc.io.net.tcp.rx',
        'bcc.proc.io.net.tcp.duration',
      ],
      transforms: [
        onlyLatestValues(),
        renameMetric({
          'bcc.proc.io.net.tcp.pid': 'PID',
          'bcc.proc.io.net.tcp.comm': 'COMM',
          'bcc.proc.io.net.tcp.laddr': 'LADDR',
          'bcc.proc.io.net.tcp.lport': 'LPORT',
          'bcc.proc.io.net.tcp.daddr': 'DADDR',
          'bcc.proc.io.net.tcp.dport': 'DPORT',
          'bcc.proc.io.net.tcp.tx': 'TX_KB',
          'bcc.proc.io.net.tcp.rx': 'RX_KB',
          'bcc.proc.io.net.tcp.duration': 'MS'
        }),
        divideByOnlyMetric(1024, [ 'TX_KB', 'RX_KB' ]),
        divideByOnlyMetric(1000, [ 'MS' ]),
        mathValuesSelective(Math.round, mi => ['TX_KB', 'RX_KB', 'MS'].includes(mi.metric)),
      ],
    },

    {
      chartId: 'bcc-execsnoop',
      group: 'BCC/BPF',
      title: 'execsnoop',
      tooltipText: 'trace new process launches',
      processor: simpleModel,
      visualisation: MultiTable,
      metricNames: [
        'bcc.proc.exec.comm',
        'bcc.proc.exec.pid',
        'bcc.proc.exec.ppid',
        'bcc.proc.exec.ret',
        'bcc.proc.exec.args',
      ],
      transforms: [
        onlyLatestValues(),
        renameMetric({
          'bcc.proc.exec.comm': 'COMM',
          'bcc.proc.exec.pid': 'PID',
          'bcc.proc.exec.ppid': 'PPID',
          'bcc.proc.exec.ret': 'RET',
          'bcc.proc.exec.args': 'ARGS',
        }),
      ],
    },

    {
      chartId: 'bcc-tcpretrans',
      group: 'BCC/BPF',
      title: 'tcpretrans',
      tooltipText: 'TCP retransmit counts',
      processor: simpleModel,
      visualisation: SimpleTable,
      metricNames: [
        'bcc.io.net.tcp.retrans.count',
      ],
      transforms: [
        mapInstanceDomains(),
        customTitleAndKeylabel((metric, instance) => instance),
        onlyLatestValues(),
      ],
    },

    // TODO test biotop (could not get it working on my machine)
    {
      chartId: 'bcc-biotop',
      group: 'BCC/BPF',
      title: 'biotop',
      tooltipText: 'block device I/O "top"',
      processor: simpleModel,
      visualisation: MultiTable,
      metricNames: [
        'bcc.proc.io.perdev.pid',
        'bcc.proc.io.perdev.comm',
        'bcc.proc.io.perdev.direction',
        'bcc.proc.io.perdev.major',
        'bcc.proc.io.perdev.minor',
        'bcc.proc.io.perdev.disk',
        'bcc.proc.io.perdev.io',
        'bcc.proc.io.perdev.bytes',
        'bcc.proc.io.perdev.duration',
      ],
      transforms: [
        onlyLatestValues(),
        renameMetric({
          'bcc.proc.io.perdev.pid': 'PID',
          'bcc.proc.io.perdev.comm': 'COMM',
          'bcc.proc.io.perdev.direction': 'D',
          'bcc.proc.io.perdev.major': 'MAJ',
          'bcc.proc.io.perdev.minor': 'MIN',
          'bcc.proc.io.perdev.disk': 'DISK',
          'bcc.proc.io.perdev.io': 'I/O',
          'bcc.proc.io.perdev.bytes': 'Kbytes', // will be shortly
          'bcc.proc.io.perdev.duration': 'AVGms', // will be shortly
        }),
        divideByOnlyMetric(1024, [ 'Kbytes' ]),
        divideByOnlyMetric(1000, [ 'AVGms' ]),
        mathValuesSelective(Math.round, mi => ['Kbytes', 'AVGms'].includes(mi.metric)),
      ],
    },

    {
      chartId: 'bcc-tcptop',
      group: 'BCC/BPF',
      title: 'tcptop',
      tooltipText: 'tcp throughput "top"',
      processor: simpleModel,
      visualisation: MultiTable,
      metricNames: [
        'bcc.proc.io.net.tcptop.pid',
        'bcc.proc.io.net.tcptop.comm',
        'bcc.proc.io.net.tcptop.laddr',
        'bcc.proc.io.net.tcptop.lport',
        'bcc.proc.io.net.tcptop.daddr',
        'bcc.proc.io.net.tcptop.dport',
        'bcc.proc.io.net.tcptop.rx',
        'bcc.proc.io.net.tcptop.tx',
      ],
      transforms: [
        onlyLatestValues(),
        renameMetric({
          'bcc.proc.io.net.tcptop.pid': 'PID',
          'bcc.proc.io.net.tcptop.comm': 'COMM',
          'bcc.proc.io.net.tcptop.laddr': 'LADDR',
          'bcc.proc.io.net.tcptop.lport': 'LPORT',
          'bcc.proc.io.net.tcptop.daddr': 'DADDR',
          'bcc.proc.io.net.tcptop.dport': 'DPORT',
          'bcc.proc.io.net.tcptop.rx': 'RX_KB',
          'bcc.proc.io.net.tcptop.tx': 'TX_KB',
        }),
        divideByOnlyMetric(1024, [ 'TX_KB', 'RX_KB' ]),
        mathValuesSelective(Math.round, mi => ['TX_KB', 'RX_KB'].includes(mi.metric)),
      ],
    },

    {
      chartId: 'bcc-tracepoint-hits',
      group: 'BCC/BPF',
      title: 'tracepoint hits',
      tooltipText: 'kernel tracepoint hit counts',
      processor: simpleModel,
      visualisation: SimpleTable,
      metricNames: [
        'bcc.tracepoint.hits',
      ],
      transforms: [
        mapInstanceDomains(),
        customTitleAndKeylabel((metric, instance) => instance),
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'bcc-usdt-hits',
      group: 'BCC/BPF',
      title: 'USDT hits',
      tooltipText: 'user-level statically defined tracepoint hit counts',
      processor: simpleModel,
      visualisation: SimpleTable,
      metricNames: [
        'bcc.usdt.hits',
      ],
      transforms: [
        mapInstanceDomains(),
        customTitleAndKeylabel((metric, instance) => instance),
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'bcc-uprobe-hits',
      group: 'BCC/BPF',
      title: 'uprobe hits',
      tooltipText: 'uprobe hit counts',
      processor: simpleModel,
      visualisation: SimpleTable,
      metricNames: [
        'bcc.uprobe.hits',
      ],
      transforms: [
        mapInstanceDomains(),
        customTitleAndKeylabel((metric, instance) => instance),
        onlyLatestValues(),
      ],
    },
  ]
}
