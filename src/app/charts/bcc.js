import simpleModel from '../processors/simpleModel'
import {
  customTitleAndKeylabel,
  log,
  divideByOnlyMetric,
  renameMetric,
  onlyLatestValues,
  filterKeepSelectedMetrics,
  mapInstanceDomains,
  ceiling,
  cumulativeTransform,
  mathValuesSelective,
} from '../processors/transforms'
import Table from '../components/Table/Table.jsx'
import SimpleTable from '../components/Table/SimpleTable.jsx'
import Heatmap from '../components/Heatmap/Heatmap.jsx'
import HeatmapSettingsModal from '../components/CustomSettingsModal/HeatmapSettingsModal.jsx'
import HeatmapSettingsAndMetricSelectorModal from '../components/CustomSettingsModal/HeatmapSettingsAndMetricSelectorModal.jsx'
import { thresholds, colors } from '../components/Heatmap/Cividis.js'

export default [
  {
    group: 'BCC/BPF',
    title: 'BCC biolatency (block device I/O latency)',
    processor: simpleModel,
    visualisation: Heatmap,
    metricNames: [
      'bcc.disk.all.latency'
    ],
    transforms: [
      cumulativeTransform(),
      ceiling(),
      mapInstanceDomains('yAxisLabels'),
    ],
    settingsComponent: HeatmapSettingsModal,
    heatmap: { thresholds, colors },
    heatmapMaxValue: 0,
  },

  {
    group: 'BCC/BPF',
    title: 'BCC runqlat (run queue latency)',
    processor: simpleModel,
    visualisation: Heatmap,
    metricNames: [
      'bcc.runq.latency'
    ],
    transforms: [
      cumulativeTransform(),
      ceiling(),
      mapInstanceDomains('yAxisLabels'),
    ],
    settingsComponent: HeatmapSettingsModal,
    heatmap: { thresholds, colors },
    heatmapMaxValue: 0,
  },

  {
    group: 'BCC/BPF',
    title: 'BCC ext4dist (ext4 operation latencies)',
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
    ],
    settingsComponent: HeatmapSettingsAndMetricSelectorModal,
    heatmap: { thresholds, colors },
    heatmapMaxValue: 0,
    selectedMetrics: [
      'bcc.fs.ext4.latency.open',
      'bcc.fs.ext4.latency.read',
      'bcc.fs.ext4.latency.write',
      'bcc.fs.ext4.latency.fsync',
    ],
  },

  {
    group: 'BCC/BPF',
    title: 'BCC xfsdist (xfs operation latencies)',
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
    ],
    settingsComponent: HeatmapSettingsAndMetricSelectorModal,
    heatmap: { thresholds, colors },
    heatmapMaxValue: 0,
    selectedMetrics: [
      'bcc.fs.xfs.latency.open',
      'bcc.fs.xfs.latency.read',
      'bcc.fs.xfs.latency.write',
      'bcc.fs.xfs.latency.fsync',
    ],
  },

  {
    group: 'BCC/BPF',
    title: 'BCC zfsdist (zfs operation latencies)',
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
    ],
    settingsComponent: HeatmapSettingsAndMetricSelectorModal,
    heatmap: { thresholds, colors },
    heatmapMaxValue: 0,
    selectedMetrics: [
      'bcc.fs.zfs.latency.open',
      'bcc.fs.zfs.latency.read',
      'bcc.fs.zfs.latency.write',
      'bcc.fs.zfs.latency.fsync',
    ],
  },

  {
    group: 'BCC/BPF',
    title: 'BCC tcplife (TCP sessions)',
    processor: simpleModel,
    visualisation: Table,
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
    group: 'BCC/BPF',
    title: 'BCC execsnoop (traces new processes)',
    processor: simpleModel,
    visualisation: Table,
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
    group: 'BCC/BPF',
    title: 'BCC tcpretrans (counts TCP retransmits)',
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
    group: 'BCC/BPF',
    title: 'BCC biotop (block device I/O top)',
    processor: simpleModel,
    visualisation: Table,
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
    group: 'BCC/BPF',
    title: 'BCC tcptop (tcp throughput)',
    processor: simpleModel,
    visualisation: Table,
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
    group: 'BCC/BPF',
    title: 'BCC tracepoint hits (kernel tracepoint hit counts)',
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
    group: 'BCC/BPF',
    title: 'BCC USDT hits (kernel tracepoint hit counts)',
    processor: simpleModel,
    visualisation: SimpleTable,
    metricNames: [
      'bcc.usdt.hits',
    ],
    transforms: [
      // TODO what is the logic in the original bccUSDThits.datamodel.factory.js doing?
      mapInstanceDomains(),
      customTitleAndKeylabel((metric, instance) => instance),
      onlyLatestValues(),
    ],
  },

  {
    group: 'BCC/BPF',
    title: 'BCC uprobe hits (uprobe hit count)',
    processor: simpleModel,
    visualisation: SimpleTable,
    metricNames: [
      'bcc.uprobe.hits',
    ],
    transforms: [
      // TODO what is the logic in the original bccUprobehits.datamodel.factory.js doing?
      mapInstanceDomains(),
      customTitleAndKeylabel((metric, instance) => instance),
      onlyLatestValues(),
    ],
  },

]
