import simpleModel from '../processors/simpleModel'
import { log, timesliceCalculations, defaultTitleAndKeylabel, divideBy, divideBySeries, cumulativeTransform, toPercentage } from '../processors/transforms'
import { keyValueArrayToObject } from '../processors/utils'

export default [
  {
    group: 'CPU',
    title: 'Context Switches per second',
    processor: simpleModel,
    metricNames: [
      'kernel.all.pswitch'
    ],
    transforms: [
      log('before'),
      defaultTitleAndKeylabel,
      cumulativeTransform,
      log('after'),
    ],
  },

  {
    group: 'CPU',
    title: 'CPU Utilization',
    processor: simpleModel,
    lineType: 'stackedarea',
    metricNames: [
      'kernel.all.cpu.sys',
      'kernel.all.cpu.user',
      'hinv.ncpu',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform,
      toPercentage,
    ],
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (System)',
    processor: simpleModel,
    metricNames: [
      'kernel.all.cpu.sys',
      'hinv.ncpu',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform,
      toPercentage,
    ],
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (user)',
    processor: simpleModel,
    metricNames: [
      'kernel.all.cpu.user',
      'hinv.ncpu'
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform,
      toPercentage,
    ],
  },

  {
    group: 'CPU',
    title: 'Load Average',
    processor: simpleModel,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization',
    processor: simpleModel,
    metricNames: [
      'kernel.percpu.cpu.sys',
      'kernel.percpu.cpu.user',
    ],
    transforms: [
      divideBy(1000),
      cumulativeTransform,
      toPercentage,
      timesliceCalculations({
        'cpu [sys+user]': (values) => {
          let cpus = Object.keys(values['kernel.percpu.cpu.sys'])
          let utilizations = cpus.map(cpu => ({
            key: cpu,
            value: (values['kernel.percpu.cpu.sys'][cpu] || 0) + (values['kernel.percpu.cpu.user'][cpu] || 0)
          }))
          return utilizations.reduce(keyValueArrayToObject, {})
        }
      }),
      defaultTitleAndKeylabel,
    ],
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (System)',
    processor: simpleModel,
    metricNames: [
      'kernel.percpu.cpu.sys',
    ],
    transforms: [
      divideBy(1000),
      defaultTitleAndKeylabel,
      cumulativeTransform,
      toPercentage,
    ]
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (User)',
    processor: simpleModel,
    metricNames: [
      'kernel.percpu.cpu.user',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBy(1000),
      cumulativeTransform,
      toPercentage,
    ],
  },

  {
    group: 'CPU',
    title: 'Runnable',
    processor: simpleModel,
    metricNames: [
      'kernel.all.runnable',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
  }
]
