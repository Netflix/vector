import cpuRatioModel from '../processors/cpuRatioModel'

export default {
  group: 'CPU',
  title: 'CPU Utilization (System)',
  processor: cpuRatioModel,
  config: {
    metricName: 'kernel.all.cpu.sys',
    divisorMetricName: 'hinv.ncpu'
  },
}
