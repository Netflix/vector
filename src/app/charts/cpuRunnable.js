import simpleModel from '../processors/simpleModel'

export default {
  group: 'CPU',
  title: 'Runnable',
  processor: simpleModel,
  config: {
    metricNames: [
      'kernel.all.runnable',
    ]
  },
}
