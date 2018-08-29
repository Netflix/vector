import simpleModel from '../processors/simpleModel'
import { defaultTitleAndKeylabel } from '../processors/transforms'
import { integer } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'

export default [
  {
    chartId: 'network-tcp-closewait',
    group: 'Network',
    title: 'TCP Connections (Close Wait)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp-established',
    group: 'Network',
    title: 'TCP Connections (Established)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.established',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp',
    group: 'Network',
    title: 'TCP Connections',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.established',
      'network.tcpconn.time_wait',
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp-timewait',
    group: 'Network',
    title: 'TCP Connections (Time Wait)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.time_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  }
]
