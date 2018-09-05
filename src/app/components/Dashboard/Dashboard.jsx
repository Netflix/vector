import React from 'react'
import PropTypes from 'prop-types'

import DashPanel from './DashPanel.jsx'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { matchesTarget } from '../../utils'

const GridLayout = WidthProvider(Responsive)

const gridResponsiveCols = { lg: 12, md: 10, sm: 8, xs: 6 }
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
      <GridLayout rowHeight={40} cols={gridResponsiveCols} style={gridStyle} clazzName='layout' draggableCancel='.doNotDrag'>

        { this.props.chartlist.map((c, idx) => {
          const ctxds = (this.props.pausedContextDatasets || this.props.contextDatasets)
            .find(ctxds => matchesTarget(ctxds.target, c.context.target))
          return (
            <div key={`panel-${c.chartId}`} data-grid={{ x: ((idx % 2) * 5), y: 0, w: 5, h: 9, minW: 3, minH: 3 }} style={{ overflow: 'hidden' }}>
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
                pmids={c.context.pmids || {}}/>
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
  pausedContextDatasets: PropTypes.array,
  removeChartByIndex: PropTypes.func.isRequired,
  updateChartSettings: PropTypes.func.isRequired,
}

export default Dashboard
