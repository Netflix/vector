import React from 'react'
import PropTypes from 'prop-types'

import DashPanel from './DashPanel.jsx'
import ErrorPanel from '../ErrorPanel.jsx'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ErrorBoundary from 'react-error-boundary'

import { matchesTarget } from '../../utils'

const GridLayout = WidthProvider(Responsive)

const gridResponsiveCols = { lg: 12, md: 10, sm: 8, xs: 6 }
const gridStyle = { paddingLeft: '15px' }

const dashPanelDivStyle = { overflow: 'hidden' }

class Dashboard extends React.Component {
  handleCloseClicked = (chartInfo) => {
    this.props.removeChartByIndex(this.props.chartlist.indexOf(chartInfo))
  }
  handleNewSettings = (chartInfo, settings) => {
    this.props.updateChartSettings(this.props.chartlist.indexOf(chartInfo), settings)
  }

  render () {
    const { chartlist, pausedContextDatasets, contextDatasets } = this.props
    const datasets = pausedContextDatasets || contextDatasets

    return (
      <GridLayout rowHeight={40} cols={gridResponsiveCols} style={gridStyle} clazzName='layout' draggableCancel='.doNotDrag'>
        { chartlist.map((c, idx) => {
          const ctxds = datasets.find(ctxds => matchesTarget(ctxds.target, c.context.target))
          return (
            // TODO this layout calculation is a bit clunky
            <div key={`panel-${c.chartId}`} data-grid={{ x: ((idx % 2) * 5), y: 0, w: 5, h: 9, minW: 3, minH: 3 }} style={dashPanelDivStyle}>
              <ErrorBoundary FallbackComponent={ErrorPanel}>
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
              </ErrorBoundary>
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
