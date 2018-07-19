import cpuRatioModel from '../processors/cpuRatioModel'

export default {
  group: 'CPU',
  title: 'CPU Utilization',
  processor: cpuRatioModel,
  config: {
    lineType: 'stackedarea',
    metricNames: [
      'kernel.all.cpu.sys',
      'kernel.all.cpu.user',
    ],
    divisorMetricName: 'hinv.ncpu'
  },
}
