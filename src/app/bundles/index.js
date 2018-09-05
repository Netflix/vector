const bundles = [
  {
    name: 'Utilisation',
    iconName: 'computer',
    description: 'Quick overview of system utilization',
    chartTemplates: [
      { chartId: 'cpu-utilization' },
      { chartId: 'disk-latency' },
      { chartId: 'memory-utilization' },
      { chartId: 'network-throughput' },
    ]
  },
  {
    name: 'Disk',
    iconName: 'disk',
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
    iconName: 'magnify',
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
