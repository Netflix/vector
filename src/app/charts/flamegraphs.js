import nullModel from '../processors/nullModel'
import Flamegraph from '../components/Charts/Flamegraph.jsx'

import FlamegraphHelp from '../help/Flamegraph.jsx'

export default function _charts(config) {
  if (!config.enableFlamegraphs) return []

  return [
    {
      chartId: 'fg-cpu',
      group: 'Flamegraphs',
      title: 'CPU',
      helpComponent: FlamegraphHelp,
      tooltipText: 'Flamegraph of process time on CPU',
      processor: nullModel,
      visualisation: Flamegraph,
      metricNames: [
        // does not fetch via model, but use to enable/disable
        'vector.task.cpuflamegraph',
      ],
      transforms: [
      ],
    },
  ]
}
