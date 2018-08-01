import simpleModel from '../processors/simpleModel'
import { defaultTitleAndKeylabel } from '../processors/transforms'
import { percentage, integer, number } from '../processors/formats'

export default [
  {
    group: 'Network',
    title: 'TCP Connections (Close Wait)',
    processor: simpleModel,
    metricNames: [
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'TCP Connections (Established)',
    processor: simpleModel,
    metricNames: [
      'network.tcpconn.established',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'TCP Connections',
    processor: simpleModel,
    metricNames: [
      'network.tcpconn.established',
      'network.tcpconn.time_wait',
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'TCP Connections (Time Wait)',
    processor: simpleModel,
    metricNames: [
      'network.tcpconn.time_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel,
    ],
    yTickFormat: integer,
  }
]
