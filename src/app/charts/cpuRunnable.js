import simpleModel from '../processors/simpleModel'

export default {
  group: 'CPU',
  title: 'Runnable',
  processor: simpleModel,
  config: {
    metricName: 'kernel.all.runnable',
  },
}
