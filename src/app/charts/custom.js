/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

import customChartModel from '../processors/customChartModel'
import customTableModel from '../processors/customTableModel'
import { number } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'
import SimpleTable from '../components/Charts/SimpleTable.jsx'

import CustomSettingsModal from '../components/SettingsModals/CustomSettingsModal.jsx'

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
    /*
     * TODO add this when url can handle full serialisation
     * otherwise this is only really useful for bundles, as it cannot be 'persisted'
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
    */
  ]
}
