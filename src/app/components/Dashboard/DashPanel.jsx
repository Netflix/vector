import React from 'react'
import PropTypes from 'prop-types'

import 'react-resizable/css/styles.css'
import { Segment } from 'semantic-ui-react'
import ErrorBoundary from 'react-error-boundary'

import DashHeader from './DashHeader.jsx'
import ErrorPanel from '../ErrorPanel.jsx'

const panelStyle = {
  // height=100% to ensure it fills the card, flex so that the content part of
  // the card will grow to fill the area
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

const panelContentStyle = {
  flex: 1,
  minHeight: 0,
}

class DashPanel extends React.Component {
  render () {
    const { chartInfo, datasets, containerList, instanceDomainMappings, containerId } = this.props
    const { pmids, onNewSettings, onCloseClicked } = this.props

    const dataset = datasets && chartInfo.processor
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []

    const Visualisation = chartInfo.visualisation

    return (
      <Segment.Group style={panelStyle}>

        <Segment clearing>
          <DashHeader chartInfo={chartInfo} dataset={dataset} pmids={pmids}
            onNewSettings={onNewSettings} onCloseClicked={onCloseClicked} />
        </Segment>

        <Segment style={panelContentStyle}>
          <ErrorBoundary FallbackComponent={ErrorPanel}>
            { dataset && dataset.length > 0 &&
              <Visualisation dataset={dataset} chartInfo={chartInfo}/>
            }

            { (!dataset || dataset.length <= 0) &&
              <span>No data yet</span>
            }
          </ErrorBoundary>
        </Segment>
      </Segment.Group>
    )
  }
}

DashPanel.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onNewSettings: PropTypes.func,
  instanceDomainMappings: PropTypes.object.isRequired,
  containerList: PropTypes.array.isRequired,
  containerId: PropTypes.string.isRequired,
  pmids: PropTypes.object.isRequired,
}

export default DashPanel
