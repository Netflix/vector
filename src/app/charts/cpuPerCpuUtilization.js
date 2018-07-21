import cumulativeSummedUtilizationModel from '../processors/cumulativeSummedUtilizationModel'

export default {
  group: 'CPU',
  title: 'Per-CPU Utilization',
  processor: cumulativeSummedUtilizationModel,
  config: {
    title: 'cpu [sys+user]',
    metricNames: [
      'kernel.percpu.cpu.sys',
      'kernel.percpu.cpu.user',
    ],
  },
}
