import React from 'react'
import PropTypes from 'prop-types'

import { Segment  } from 'semantic-ui-react'
import ChartSelector from '../ChartSelector/ChartSelector.jsx'
import WindowIntervalSelector from './WindowIntervalSelector.jsx'
import ContextController from './ContextController.jsx'

import charts from '../../charts'

class ConfigPanel extends React.Component {
  state = {}

  onClearCharts = () => {
    if (this.state.contextSelected) {
      this.props.onClearChartsFromContext(this.state.contextSelected)
    }
  }

  onAddChart = (chart) => {
    if (this.state.contextSelected) {
      this.props.onAddChartToContext(this.state.contextSelected, chart)
    }
  }

  onContextSelect = (context) => {
    this.setState({ contextSelected: context })
  }

  render () {
    return (
      <Segment.Group>
        <Segment>
          <WindowIntervalSelector
            windows={[
              { valueSeconds: 120, text: '2 min' },
              { valueSeconds: 300, text: '5 min' },
              { valueSeconds: 600, text: '10 min' },
            ]}
            intervals={[
              { valueSeconds: 1, text: '1 sec' },
              { valueSeconds: 2, text: '2 sec' },
              { valueSeconds: 5, text: '5 sec' },
            ]}
            defaultWindow={120}
            defaultInterval={2} />
        </Segment>
        <Segment.Group horizontal>
          <Segment>
            <ContextController
              contextData={this.props.contextData}
              onContextSelect={this.onContextSelect}
              onNewContext={this.props.onNewContext}/>
          </Segment>
          <Segment disabled={!this.state.contextSelected}>
            <ChartSelector
              charts={charts}
              onClearCharts={this.onClearCharts}
              onAddChart={this.onAddChart} />
          </Segment>
        </Segment.Group>
      </Segment.Group>
    )
  }
}

ConfigPanel.propTypes = {
  contextData: PropTypes.array.isRequired,
  onNewContext: PropTypes.func.isRequired,
  onAddChartToContext: PropTypes.func.isRequired,
  onClearChartsFromContext: PropTypes.func.isRequired,
}

export default ConfigPanel
