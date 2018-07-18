import cumulativeModel from '../processors/cumulativeModel'

import HelpFlamegraph from '../help/Flamegraph.jsx'
import FilterModal from '../components/FilterModal/FilterModal.jsx'

export default {
  group: 'CPU',
  title: 'Context Switches per second',
  processor: cumulativeModel,
  config: {
    metricName: 'kernel.all.pswitch',
  },
  settings: {
    filter: ''
  },
  isContainerAware: true,
  isHighOverhead: true,
  helpComponent: HelpFlamegraph,
  settingsComponent: FilterModal,
}
