import simpleModel from '../processors/simpleModel'
import { mapInstanceDomains, ceiling, defaultTitleAndKeylabel, cumulativeTransform } from '../processors/transforms'
import { integer } from '../processors/formats'
import Table from '../components/Table/Table.jsx'
import Heatmap from '../components/Heatmap/Heatmap.jsx'
import { thresholds, colors } from '../components/Heatmap/Cividis.js'

// TODO all heatmap charts need a 'max row' and 'max value' setting
// TODO ext4, xfs, zfs charts need to be able to filter on 'open' 'read' 'write' 'fsync'
// TODO work out how to do multi column tables

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
    heatmap: { thresholds, colors },
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
    heatmap: { thresholds, colors },
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
      mapInstanceDomains('yAxisLabels'),
    ],
    heatmap: { thresholds, colors },
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
      mapInstanceDomains('yAxisLabels'),
    ],
    heatmap: { thresholds, colors },
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
      mapInstanceDomains('yAxisLabels'),
    ],
    heatmap: { thresholds, colors },
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
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
      // TODO this needs a calculator to transform bytes_to_kb for tcp.tx and tcp.rx and us_to_ms for tcp.duration
    ],
    yTickFormat: integer,
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
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
      // TODO needs a multi column table
    ],
    yTickFormat: integer,
  },

  {
    group: 'BCC/BPF',
    title: 'BCC tcpretrans (counts TCP retransmits)',
    processor: simpleModel,
    visualisation: Table,
    metricNames: [
      'bcc.io.net.tcp.retrans.count',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

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
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
      // TODO needs perdev.bytes bytes->kb conversion and perdev.duration us->ms conversion
    ],
    yTickFormat: integer,
  },
]
