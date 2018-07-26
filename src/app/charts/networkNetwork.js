import simpleModel from '../processors/simpleModel'
import { defaultTitleAndKeylabel, mapInstanceDomains, cumulativeTransform } from '../processors/transforms'

export default [
  {
    group: 'Network',
    title: 'Network Drops (In)',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.interface.in.drops',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  },

  {
    group: 'Network',
    title: 'Network Drops (In + Out)',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.interface.in.drops',
        'network.interface.out.drops',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  },

  {
    group: 'Network',
    title: 'Network Drops (Out)',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.interface.out.drops',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  },

  // TODO add interface filtering
  {
    group: 'Network',
    title: 'Network Packets',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.interface.in.packets',
        'network.interface.out.packets',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  },

  {
    group: 'Network',
    title: 'Network Retransmits',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.tcp.retranssegs',
        'network.tcp.timeouts',
        'network.tcp.listendrops',
        'network.tcp.fastretrans',
        'network.tcp.slowstartretrans',
        'network.tcp.synretrans',
      ],
      transforms: [
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  },

  // TODO add interface filtering
  {
    group: 'Network',
    title: 'Network Throughput (kB)',
    processor: simpleModel,
    config: {
      metricNames: [
        'network.interface.in.bytes',
        'network.interface.out.bytes',
      ],
      transforms: [
        mapInstanceDomains,
        defaultTitleAndKeylabel,
        cumulativeTransform,
      ],
    },
  }
]
