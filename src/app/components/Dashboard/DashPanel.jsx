import React from 'react'
import PropTypes from 'prop-types'

import 'react-resizable/css/styles.css'
import { Segment } from 'semantic-ui-react'
import DashHeader from './DashHeader.jsx'

class DashPanel extends React.Component {

  render () {
    const { chartInfo, datasets, containerList, instanceDomainMappings, containerId } = this.props

    const dataset = datasets
      ? chartInfo.processor.calculateChart(datasets, chartInfo, { instanceDomainMappings, containerList, containerId, chartInfo })
      : []

    const Visualisation = chartInfo.visualisation

    return (
      <Segment.Group raised style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        { /* height=100% to ensure it fills the card, flex so that the content part of the card
             will grow to fill the area */ }

        <Segment clearing>
          <DashHeader
            chartInfo={this.props.chartInfo}
            dataset={dataset}
            pmids={this.props.pmids}
            onNewSettings={this.props.onNewSettings}
            onCloseClicked={this.props.onCloseClicked} />
        </Segment>

        <Segment style={{ flex: 1, minHeight: 0 }}>
          { dataset && dataset.length > 0 &&
            <Visualisation dataset={dataset} chartInfo={chartInfo}/>
          }

          { (!dataset || dataset.length <= 0) &&
            <span>No data yet</span>
          }
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
