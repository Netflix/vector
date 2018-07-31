import customModel from '../processors/customModel'
import { defaultTitleAndKeylabel } from '../processors/transforms'

import CustomSettingsModal from '../components/CustomSettingsModal/CustomSettingsModal.jsx'

export default [
  {
    group: 'Custom',
    title: 'Custom chart',
    processor: customModel,
    config: {
      // metrics spec and transforms are handled in the customModel
    },
    settings: {
      metricName: '',
      converted: false,
      conversionFunction: '',
      forceYAxis: false,
      area: false,
      percentage: false,
      cumulative: false,
    },
    settingsComponent: CustomSettingsModal,
  },
]
