import React from 'react'

const bundles = [
  {
    name: 'Utilization',
    iconName: 'computer',
    description: (<div>
      Quick overview of host utilization:
      <ul>
        <li>CPU utilization</li>
        <li>Disk latency</li>
        <li>Memory utilization</li>
        <li>Network throughput</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'cpu-utilization' },
      { chartId: 'disk-latency' },
      { chartId: 'memory-utilization' },
      { chartId: 'network-throughput' },
    ]
  },
  {
    name: 'Container app',
    iconName: 'clone',
    description: (<div>
      A set of metrics for monitoring performance of your container
      <ul>
        <li>Container CPU</li>
        <li>Container MEM usage (MB & %)</li>
        <li>Container Disk IOPS</li>
        <li>Container Disk IOPS throttled</li>
        <li>Container CPU throttled</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'text-label', content: 'Default container metrics for your instance' },
      { chartId: 'container-percont-cpu' },
      { chartId: 'container-percont-mem' },
      { chartId: 'container-disk-iops' },
      { chartId: 'container-disk-iops-throttle' },
      { chartId: 'container-percont-cpu-throttle' },
      { chartId: 'container-percont-mem-util', },
    ],
  },
  {
    name: 'Disk',
    iconName: 'disk',
    description: (<div>
      Key disk metrics
      <ul>
        <li>IOPS</li>
        <li>Latency</li>
        <li>Throughput</li>
        <li>Utilization</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'disk-iops' },
      { chartId: 'disk-latency' },
      { chartId: 'disk-throughput' },
      { chartId: 'disk-utilization' }
    ],
  },
  {
    name: 'Flamegraphs',
    iconName: 'hotjar',
    description: 'Flame graphs',
    chartTemplates: [
      {
        chartId: 'text-label',
        content: 'All available flame graphs. Please also check out Flamecommander',
      },
      { chartId: 'fg-cpu' },
      { chartId: 'fg-pname-cpu' },
      { chartId: 'fg-uninlined-cpu' },
      { chartId: 'fg-pagefault' },
      { chartId: 'fg-diskio' },
      { chartId: 'fg-ipc' },
    ]
  },
  {
    name: 'BCC demo',
    iconName: 'microchip',
    description: 'A collection showing the default configured BCC PMDA metrics, make sure you have the BCC PMDA installed.',
    chartTemplates: [
      {
        chartId: 'text-label',
        content: 'The default BCC widgets. To enable more widgets, on the target host, check the BCC PMDA configuration file and run ./Install to reload.',
      },
      { chartId: 'bcc-tcptop' },
      { chartId: 'bcc-runqlat' },
      { chartId: 'bcc-biolatency' },
      { chartId: 'bcc-tracepoint-hits' },
      { chartId: 'bcc-usdt-hits' },
    ]
  }
]

export default bundles
