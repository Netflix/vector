import customModel from '../processors/customModel'
import { percentage, integer, number } from '../processors/formats'

import CustomSettingsModal from '../components/CustomSettingsModal/CustomSettingsModal.jsx'

export default [
  {
    group: 'Custom',
    title: 'Custom chart',
    processor: customModel,
    // metrics spec and transforms are handled in the customModel
    metricNames: [''],
    lineType: 'line',
    converted: false,
    conversionFunction: '',
    forceYAxis: false,
    percentage: false,
    cumulative: false,
    settingsComponent: CustomSettingsModal,
    yTickFormat: number,
  },
]
