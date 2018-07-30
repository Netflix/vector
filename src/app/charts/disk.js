import simpleModel from '../processors/simpleModel'
import { mapInstanceDomains, defaultTitleAndKeylabel, divideBy, cumulativeTransform, toPercentage } from '../processors/transforms'


export default [
  {
    group: 'Disk',
    title: 'Disk IOPS',
    processor: simpleModel,
    config: {
      metricNames: [
        'disk.dev.read',
        'disk.dev.write',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ]
    },
  },

  {
    group: 'Disk',
    title: 'Disk Latency',
    processor: simpleModel,
    config: {
      metricNames: [
        'disk.dev.read_rawactive',
        'disk.dev.write_rawactive',
        'disk.dev.read',
        'disk.dev.write',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform
      ]
    },
  },

  {
    group: 'Disk',
    title: 'Disk Throughput (Bytes)',
    processor: simpleModel,
    config: {
      metricNames: [
        'disk.dev.read_bytes',
        'disk.dev.write_bytes',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform
      ]
    },
  },

  {
    group: 'Disk',
    title: 'Disk Utilization (%)',
    processor: simpleModel,
    config: {
      metricNames: [
        'disk.dev.avactive',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        divideBy(1000),
        cumulativeTransform,
        toPercentage,
      ],
    },
  },
]
