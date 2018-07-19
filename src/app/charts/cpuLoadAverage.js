import simpleModel from '../processors/simpleModel'

export default {
  group: 'CPU',
  title: 'Load Average',
  processor: simpleModel,
  config: {
    metricNames: [
      'kernel.all.load',
    ]
  },
}
