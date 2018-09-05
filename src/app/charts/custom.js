import customChartModel from '../processors/customChartModel'
import customTableModel from '../processors/customTableModel'
import nullModel from '../processors/nullModel'
import { number } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'
import TextLabel from '../components/Charts/TextLabel.jsx'
import SimpleTable from '../components/Charts/SimpleTable.jsx'

import CustomSettingsModal from '../components/SettingsModals/CustomSettingsModal.jsx'
import TextLabelModal from '../components/SettingsModals/TextLabelModal.jsx'

export default function _charts(config) {
  if (!config.enableCustomWidgetFeature) return []

  return [
    {
      chartId: 'custom-chart',
      group: 'Custom',
      title: 'Custom chart',
      tooltipText: 'Allows you to configure a basic chart displaying any available metric',
      processor: customChartModel,
      visualisation: Chart,
      // metrics spec and transforms are handled in the customModel
      metricNames: [],
      lineType: 'line',
      converted: false,
      conversionFunction: '',
      forceYAxis: false,
      percentage: false,
      cumulative: false,
      settingsComponent: CustomSettingsModal,
      yTickFormat: number,
    },
    {
      chartId: 'custom-table',
      group: 'Custom',
      title: 'Custom table',
      tooltipText: 'Allows you to present a table displaying latest data of any available metric',
      processor: customTableModel,
      visualisation: SimpleTable,
      // metrics spec and transforms are handled in the customModel
      metricNames: [],
      converted: false,
      conversionFunction: '',
      percentage: false,
      cumulative: false,
      settingsComponent: CustomSettingsModal,
      yTickFormat: number,
    },
    {
      chartId: 'text-label',
      group: 'Custom',
      title: 'Text label',
      tooltipText: 'Displays a text panel with a message of your choice (edit settings)',
      processor: nullModel,
      visualisation: TextLabel,
      settingsComponent: TextLabelModal,
      content: '<click settings to edit>',
      size: 'medium',
    },
  ]
}
