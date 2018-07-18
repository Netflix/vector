import simpleModel from '../processors/simpleModel'

export default {
  group: 'CPU',
  title: 'Load Average',
  processor: simpleModel,
  config: {
    metricName: 'kernel.all.load',
  },
}
