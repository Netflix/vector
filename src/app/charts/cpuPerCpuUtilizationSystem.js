import cumulativeUtilizationModel from '../processors/cumulativeUtilizationModel'

export default {
  group: 'CPU',
  title: 'Per-CPU Utilization (System)',
  processor: cumulativeUtilizationModel,
  config: {
    metricNames: [
      'kernel.percpu.cpu.sys',
    ],
  },
}
