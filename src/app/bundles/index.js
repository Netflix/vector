const bundles = [
  {
    name: 'Utilisation',
    iconName: 'computer',
    description: 'Quick overview of system utilization',
    chartIds: [ 'cpu-utilization', 'disk-latency', 'memory-utilization', 'network-throughput' ],
  },
  {
    name: 'Disk',
    iconName: 'disk',
    description: 'Key disk metrics',
    chartIds: [ 'disk-iops', 'disk-latency', 'disk-throughput', 'disk-utilization' ],
  },
  {
    name: 'BCC demo',
    iconName: undefined,
    description: 'BCC view of the world',
    chartIds: [ 'bcc-biolatency', 'bcc-runqlat', 'bcc-tcptop', 'bcc-tracepoint-hits', 'bcc-usdt-hits' ],
  }
]

export default bundles
