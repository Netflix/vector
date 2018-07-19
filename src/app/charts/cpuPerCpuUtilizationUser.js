import cumulativeUtilizationModel from '../processors/cumulativeUtilizationModel'

export default {
  group: 'CPU',
  title: 'Per-CPU Utilization (User)',
  processor: cumulativeUtilizationModel,
  config: {
    metricNames: [
      'kernel.percpu.cpu.user',
    ],
  },
}
