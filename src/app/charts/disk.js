import simpleModel from '../processors/simpleModel'
import { mapInstanceDomains, defaultTitleAndKeylabel, divideBy, cumulativeTransform } from '../processors/transforms'
import { percentage, integer, number } from '../processors/formats'

export default [
  {
    group: 'Disk',
    title: 'Disk IOPS',
    processor: simpleModel,
    metricNames: [
      'disk.dev.read',
      'disk.dev.write',
    ],
    transforms: [
      mapInstanceDomains,
      defaultTitleAndKeylabel,
      cumulativeTransform,
    ],
    yTickFormat: number,
  },

  {
    group: 'Disk',
    title: 'Disk Latency',
    processor: simpleModel,
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
    ],
    yTickFormat: number,
  },

  {
    group: 'Disk',
    title: 'Disk Throughput (Bytes)',
    processor: simpleModel,
    metricNames: [
      'disk.dev.read_bytes',
      'disk.dev.write_bytes',
    ],
    transforms: [
      mapInstanceDomains,
      defaultTitleAndKeylabel,
      cumulativeTransform
    ],
    yTickFormat: integer,
  },

  {
    group: 'Disk',
    title: 'Disk Utilization (%)',
    processor: simpleModel,
    metricNames: [
      'disk.dev.avactive',
    ],
    transforms: [
      mapInstanceDomains,
      defaultTitleAndKeylabel,
      divideBy(1000),
      cumulativeTransform,
    ],
    yTickFormat: percentage,
  },
]
