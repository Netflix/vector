import simpleModel from '../processors/simpleModel'
import { timesliceCalculations, defaultTitleAndKeylabel, cumulativeTransform, kbToGb } from '../processors/transforms'

export default [
  {
    group: 'Memory',
    title: 'Memory Utilization (Cached)',
    processor: simpleModel,
    config: {
      metricNames: [
        'mem.util.cached',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        kbToGb
      ]
    },
  },

  {
    group: 'Memory',
    title: 'Memory Utilization (Free)',
    processor: simpleModel,
    config: {
      metricNames: [
        'mem.util.free',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        kbToGb
      ]
    },
  },

  {
    group: 'Memory',
    title: 'Memory Utilization',
    processor: simpleModel,
    config: {
      lineType: 'stackedarea',
      metricNames: [
        'mem.util.cached',
        'mem.util.used',
        'mem.util.free',
        'mem.util.bufmem',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        kbToGb,
        timesliceCalculations({
          'free (unused)': (slices) => ({ '-1': slices['mem.util.free']['-1'] }),
          'free (cache)': (slices) => ({ '-1': slices['mem.util.cached']['-1'] + slices['mem.util.bufmem']['-1'] }),
          'application': (slices) => ({ '-1': slices['mem.util.used']['-1'] - slices['mem.util.cached']['-1'] - slices['mem.util.bufmem']['-1'] }),
        }),
        defaultTitleAndKeylabel,
      ],
    },
  },

  {
    group: 'Memory',
    title: 'Memory Utilization (Used)',
    processor: simpleModel,
    config: {
      metricNames: [
        'mem.util.used',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        kbToGb
      ]
    },
  },

  {
    group: 'Memory',
    title: 'Page Faults',
    processor: simpleModel,
    config: {
      lineType: 'stackedarea',
      metricNames: [
        'mem.vmstat.pgfault',
        'mem.vmstat.pgmajfault',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        cumulativeTransform
      ]
    },
  },
]
