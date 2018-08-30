import React from 'react'
import simpleModel from '../processors/simpleModel'
import { onlyLatestValues, timesliceCalculations, defaultTitleAndKeylabel, divideBy, divideBySeries, cumulativeTransform } from '../processors/transforms'
import { keyValueArrayToObjectReducer } from '../utils'
import { percentage, integer, number } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'
import SimpleTable from '../components/Charts/SimpleTable.jsx'

const PswitchHelp = () => <p>Kernel context switches per second
  with a super long explanation</p>

export default [
  {
    chartId: 'cpu-pswitch',
    group: 'CPU',
    title: 'Context Switches per second',
    helpComponent: PswitchHelp,
    tooltipText: 'Kernel context switches per second',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.pswitch'
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'cpu-utilization',
    group: 'CPU',
    title: 'CPU Utilization',
    processor: simpleModel,
    visualisation: Chart,
    tooltipText: 'CPU utilization, both system and CPU',
    lineType: 'stackedarea',
    metricNames: [
      'kernel.all.cpu.sys',
      'kernel.all.cpu.user',
      'hinv.ncpu',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform(),
    ],
    yTickFormat: percentage,
  },

  {
    chartId: 'cpu-utilization-sys',
    group: 'CPU',
    title: 'CPU Utilization (System)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.cpu.sys',
      'hinv.ncpu',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform(),
    ],
    yTickFormat: percentage,
  },

  {
    chartId: 'cpu-utilization-user',
    group: 'CPU',
    title: 'CPU Utilization (user)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.cpu.user',
      'hinv.ncpu'
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      divideBySeries('hinv.ncpu'),
      divideBy(1000),
      cumulativeTransform(),
    ],
    yTickFormat: percentage,
  },

  {
    chartId: 'cpu-loadavg',
    group: 'CPU',
    title: 'Load Average',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'cpu-loadavg-table',
    group: 'CPU',
    title: 'Load Average (table)',
    processor: simpleModel,
    visualisation: SimpleTable,
    metricNames: [
      'kernel.all.load',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      onlyLatestValues(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'cpu-percpu-utilization',
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
      cumulativeTransform(),
      timesliceCalculations({
        'cpu [sys+user]': (values) => {
          let cpus = Object.keys(values['kernel.percpu.cpu.sys'])
          let utilizations = cpus.map(cpu => ({
            key: cpu,
            value: (values['kernel.percpu.cpu.sys'][cpu] || 0) + (values['kernel.percpu.cpu.user'][cpu] || 0)
          }))
          return utilizations.reduce(keyValueArrayToObjectReducer, {})
        }
      }),
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: percentage,
  },

  {
    chartId: 'cpu-percpu-utilization-sys',
    group: 'CPU',
    title: 'Per-CPU Utilization (System)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.percpu.cpu.sys',
    ],
    transforms: [
      divideBy(1000),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'cpu-percpu-utilization-user',
    group: 'CPU',
    title: 'Per-CPU Utilization (User)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.percpu.cpu.user',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      divideBy(1000),
      cumulativeTransform(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'cpu-runnable',
    group: 'CPU',
    title: 'Runnable',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'kernel.all.runnable',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  }
]
