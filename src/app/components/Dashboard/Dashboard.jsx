import React from 'react'
import PropTypes from 'prop-types'

import DashPanel from './DashPanel.jsx'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const GridLayout = WidthProvider(Responsive)

function matchesHostnameContext(hc1, hc2) {
  return hc1.hostname === hc2.hostname && hc1.contextId == hc2.contextId
}

const gridResponsiveCols = { lg: 12, sm: 6 }
const gridStyle = { paddingLeft: '15px' }

class Dashboard extends React.Component {
  handleCloseClicked = (chartInfo) => {
    this.props.removeChartByIndex(this.props.chartlist.indexOf(chartInfo))
  }
  handleNewSettings = (chartInfo, settings) => {
    this.props.updateChartSettings(this.props.chartlist.indexOf(chartInfo), settings)
  }

  render () {
    return (
      <GridLayout rowHeight={60} cols={gridResponsiveCols} style={gridStyle} className='layout'>

        { this.props.chartlist.map((c, idx) => {
          const ctxds = this.props.contextDatasets.find(ctxds =>
            matchesHostnameContext(ctxds, { hostname: c.context.target.hostname, contextId: c.context.contextId })
          )
          return (
            <div key={`panel-${idx}`} data-grid={{ x: 0, y: 0, w: 5, h: 6, minW: 3, minH: 3 }} style={{ overflow: 'hidden' }}>
              <DashPanel
                chartIndex={idx}
                chartInfo={c}
                datasets={ctxds ? ctxds.datasets : []}
                onCloseClicked={this.handleCloseClicked}
                containerList={c.context.containerList || []}
                instanceDomainMappings={ctxds ? ctxds.instanceDomainMappings : {}}
                containerId={(c.context.containerId || '_all') === '_all' ? '' : c.context.containerId}
                settings={c.settings}
                onNewSettings={this.handleNewSettings}
                pmids={c.context.pmids}/>
            </div>
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
