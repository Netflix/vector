import simpleModel from '../processors/simpleModel'
import { renameMetric, defaultTitleAndKeylabel, mapInstanceDomains, cumulativeTransform } from '../processors/transforms'
import { integer } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'
import FilterModal from '../components/SettingsModals/FilterModal.jsx'

export default [
  {
    group: 'Network',
    title: 'Network Drops (In)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.interface.in.drops',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'Network Drops (In + Out)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.interface.in.drops',
      'network.interface.out.drops',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'Network Drops (Out)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.interface.out.drops',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

  {
    // TODO should this chart have the container aware warning?
    group: 'Network',
    title: 'Network Packets',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.interface.in.packets',
      'network.interface.out.packets',
    ],
    transforms: [
      mapInstanceDomains(),
      FilterModal.filterInstanceIncludesFilterText(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    settingsComponent: FilterModal,
    filter: '',
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'Network Retransmits',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcp.retranssegs',
      'network.tcp.timeouts',
      'network.tcp.listendrops',
      'network.tcp.fastretrans',
      'network.tcp.slowstartretrans',
      'network.tcp.synretrans',
    ],
    transforms: [
      cumulativeTransform(),
      renameMetric({
        'network.tcp.retranssegs': 'retranssegs',
        'network.tcp.timeouts': 'timeouts',
        'network.tcp.listendrops': 'listendrops',
        'network.tcp.fastretrans': 'fastretrans',
        'network.tcp.slowstartretrans': 'slowstartretrans',
        'network.tcp.synretrans': 'synretrans',
      }),
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    group: 'Network',
    title: 'Network Throughput (kB)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.interface.in.bytes',
      'network.interface.out.bytes',
    ],
    transforms: [
      mapInstanceDomains(),
      FilterModal.filterInstanceIncludesFilterText(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    settingsComponent: FilterModal,
    filter: '',
    yTickFormat: integer,
  }
]
