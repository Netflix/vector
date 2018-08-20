import simpleModel from '../processors/simpleModel'
import { copyDataToCoordinatesForSemiotic, log, timesliceCalculations, defaultTitleAndKeylabel, divideBy, divideBySeries, cumulativeTransform } from '../processors/transforms'
import { keyValueArrayToObject } from '../processors/utils'
import { percentage, integer, number } from '../processors/formats'
import Chart from '../components/Chart/Chart.jsx'
import Table from '../components/Table/Table.jsx'
import Heatmap from '../components/Heatmap/Heatmap.jsx'

export default [
  {
    group: 'CPU',
    title: 'Context Switches per second',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.pswitch'
    ],
    transforms: [
      defaultTitleAndKeylabel,
      cumulativeTransform,
    ],
    yTickFormat: integer,
  },

  {
    group: 'CPU',
    title: 'CPU Utilization',
    processor: simpleModel,
    visualisation: Chart,
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
    ],
    yTickFormat: percentage,
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (System)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.cpu.sys',
      'hinv.ncpu',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform,
    ],
    yTickFormat: percentage,
  },

  {
    group: 'CPU',
    title: 'CPU Utilization (user)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.cpu.user',
      'hinv.ncpu'
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform,
    ],
    yTickFormat: percentage,
  },

  {
    group: 'CPU',
    title: 'Load Average',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: number,
  },

  {
    group: 'CPU',
    title: 'Load Average (heatmap)',
    processor: simpleModel,
    visualisation: Heatmap,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      copyDataToCoordinatesForSemiotic,
    ],
    yTickFormat: number,
    heatmap: {
      thresholds: [ 0.01, 0.25, 0.5, 0.75, 0.98 ],
      colors: [ 'none', '#fbeeec', '#f3c8c2', '#e39787', '#ce6751', '#b3331d' ],
    },
  },

  {
    group: 'CPU',
    title: 'Load Average (table)',
    processor: simpleModel,
    visualisation: Table,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: number,
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.percpu.cpu.sys',
      'kernel.percpu.cpu.user',
    ],
    transforms: [
      divideBy(1000),
      cumulativeTransform,
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
    yTickFormat: percentage,
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (System)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.percpu.cpu.sys',
    ],
    transforms: [
      divideBy(1000),
      defaultTitleAndKeylabel,
      cumulativeTransform,
    ],
    yTickFormat: number,
  },

  {
    group: 'CPU',
    title: 'Per-CPU Utilization (User)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.percpu.cpu.user',
    ],
    transforms: [
      defaultTitleAndKeylabel,
      divideBy(1000),
      cumulativeTransform,
    ],
    yTickFormat: number,
  },

  {
    group: 'CPU',
    title: 'Runnable',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.runnable',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: integer,
  }
]
