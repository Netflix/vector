import cpuRatioModel from '../processors/cpuRatioModel'

export default {
  group: 'CPU',
  title: 'CPU Utilization (user)',
  processor: cpuRatioModel,
  config: {
    metricName: 'kernel.all.cpu.user',
    divisorMetricName: 'hinv.ncpu'
  },
}
