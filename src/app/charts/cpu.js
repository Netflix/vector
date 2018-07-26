import simpleModel from '../processors/simpleModel'
import { customTitleAndKeylabel, combineValuesByTitle, defaultTitleAndKeylabel, divideBy, divideBySeries, cumulativeTransform, toPercentage } from '../processors/transforms'

import HelpFlamegraph from '../help/Flamegraph.jsx'
import FilterModal from '../components/FilterModal/FilterModal.jsx'

function sum (a, b) {
  return a + b
}

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
        // TODO filterWithoutAllValuesAtTimestamps,
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
        // TODO filterWithoutAllValuesAtTimestamps,
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
        // TODO filterWithoutAllValuesAtTimestamps,
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
        customTitleAndKeylabel((metric, instance) => `cpu [sys+user] (${instance})`),
        combineValuesByTitle(sum),
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
