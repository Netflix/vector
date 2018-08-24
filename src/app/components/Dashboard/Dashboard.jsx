import React from 'react'
import PropTypes from 'prop-types'

import DashPanel from './DashPanel.jsx'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

function matchesHostnameContext(hc1, hc2) {
  return hc1.hostname === hc2.hostname && hc1.contextId == hc2.contextId
}

export class Dashboard extends React.Component {
  render () {
    return (
      <GridLayout style={{ paddingLeft: '15px' }} className='layout' cols={12} rowHeight={30}>
        { this.props.chartlist.map((c, idx) => {
          const ctxds = this.props.contextDatasets.find(ctxds =>
            matchesHostnameContext(ctxds, { hostname: c.context.target.hostname, contextId: c.context.contextId })
          )
          return (
            <DashPanel
              key={`panel-${idx}`}
              index={idx}
              dataGrid={{w:1, h:1}}
              chartInfo={c}
              datasets={ctxds ? ctxds.datasets : []}
              onCloseClicked={() => this.props.removeChartByIndex(idx)}
              containerList={c.context.containerList || []}
              instanceDomainMappings={ctxds ? ctxds.instanceDomainMappings : {}}
              containerId={(c.context.containerId || '_all') === '_all' ? '' : c.context.containerId}
              settings={c.settings}
              onNewSettings={(settings) => this.props.updateChartSettings(idx, settings)}
              pmids={c.context.pmids}/>
          )
        })}
      </GridLayout>
    )
  }
}

Dashboard.propTypes = {
  chartlist: PropTypes.array.isRequired,
  contextDatasets: PropTypes.array.isRequired,
  removeChartByIndex: PropTypes.func.isRequired,
  updateChartSettings: PropTypes.func.isRequired,
}
export default Dashboard
