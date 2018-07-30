import simpleModel from '../processors/simpleModel'
import { timesliceCalculations, defaultTitleAndKeylabel, divideBy, divideBySeries, cumulativeTransform, toPercentage } from '../processors/transforms'
import { keyValueArrayToObject } from '../processors/utils'

import HelpFlamegraph from '../help/Flamegraph.jsx'
import FilterModal from '../components/FilterModal/FilterModal.jsx'

export default [
  {
    group: 'CPU',
    title: 'Context Switches per second',
    processor: simpleModel,
    config: {
      metricNames: [
        'kernel.all.pswitch'
      ],
      transforms: [
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
    settings: {
      filter: ''
    },
    isContainerAware: true,
    isHighOverhead: true,
    helpComponent: HelpFlamegraph,
    settingsComponent: FilterModal,
  },

  {
    group: 'CPU',
    title: 'CPU Utilization',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (System)',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (user)',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'Load Average',
    processor: simpleModel,
    config: {
      metricNames: [
        'kernel.all.load',
      ],
      transforms: [
        defaultTitleAndKeylabel,
      ],
    },
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (System)',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (User)',
    processor: simpleModel,
    config: {
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
  },

  {
    group: 'CPU',
    title: 'Runnable',
    processor: simpleModel,
    config: {
      metricNames: [
        'kernel.all.runnable',
      ],
      transforms: [
        defaultTitleAndKeylabel,
      ],
    },
  }
]
