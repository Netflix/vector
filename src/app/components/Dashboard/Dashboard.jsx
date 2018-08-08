import React from 'react'
import PropTypes from 'prop-types'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Chart from '../Chart/Chart.jsx'

function matchesHostnameContext(hc1, hc2) {
  return hc1.hostname === hc2.hostname && hc1.contextId == hc2.contextId
}

const SortableChart = SortableElement(props =>
  <li style={{ listStyle: 'none', display: 'inline-block', margin: '6px 6px 6px 6px' }}>
    <Chart {...props}/>
  </li>)

const SortableDashboard = SortableContainer(({ chartlist, contextDatasets, removeChartByIndex, updateChartSettings }) => {
  return (
    <div style={{ paddingLeft: '15px' }}>
      <ul>
        { chartlist.map((c, idx) => {
          const ctxds = contextDatasets.find(ctxds =>
            matchesHostnameContext(ctxds, { hostname: c.context.target.hostname, contextId: c.context.contextId })
          )
          return <SortableChart
            key={`chart-${idx}`}
            index={idx}
            chartInfo={c}
            datasets={ctxds ? ctxds.datasets : []}
            onCloseClicked={() => removeChartByIndex(idx)}
            containerList={c.context.containerList || []}
            instanceDomainMappings={ctxds ? ctxds.instanceDomainMappings : {}}
            containerId={(c.context.containerId || '_all') === '_all' ? '' : c.context.containerId}
            settings={c.settings}
            onNewSettings={(settings) => updateChartSettings(idx, settings)}
            pmids={c.context.pmids}/>
        })}
      </ul>
    </div>
  )
})

export class Dashboard extends React.Component {
  onSortEnd = ({ oldIndex, newIndex }) => this.props.onMoveChart(oldIndex, newIndex)

  render () {
    return <SortableDashboard
      chartlist={this.props.chartlist}
      contextDatasets={this.props.contextDatasets}
      removeChartByIndex={this.props.removeChartByIndex}
      onSortEnd={this.onSortEnd}
      useDragHandle={true}
      axis='xy'/>
  }
}

Dashboard.propTypes = {
  chartlist: PropTypes.array.isRequired,
  contextDatasets: PropTypes.array.isRequired,
  removeChartByIndex: PropTypes.func.isRequired,
  updateChartSettings: PropTypes.func.isRequired,
  onMoveChart: PropTypes.func.isRequired,
}

export default Dashboard
