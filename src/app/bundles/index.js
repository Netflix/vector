const bundles = [
  {
    name: 'Utilisation',
    iconName: 'computer',
    shouldEnable: () => true,
    description: 'Quick overview of host utilization',
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
    shouldEnable: ({ containerId }) => containerId && containerId !== '_all',
    description: 'A set of metrics for monitoring performance of your container',
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
    shouldEnable: () => true,
    description: 'Key disk metrics',
    chartTemplates: [
      { chartId: 'disk-iops' },
      { chartId: 'disk-latency' },
      { chartId: 'disk-throughput' },
      { chartId: 'disk-utilization' }
    ],
  },
  {
    name: 'BCC demo',
    iconName: 'microchip',
    shouldEnable: () => true,
    description: 'BCC view of the world',
    chartTemplates: [
      {
        chartId: 'text-label',
        content: 'The default BCC widgets. To enable more widgets, on the target host, check the BCC PMDA configuration file and run ./Install to reload',
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
