import React from 'react'
import PropTypes from 'prop-types'

import { Segment  } from 'semantic-ui-react'
import ChartSelector from '../ChartSelector/ChartSelector.jsx'
import WindowIntervalSelector from './WindowIntervalSelector.jsx'
import ContextMenu from './ContextMenu.jsx'

import charts from '../../charts'

const VALID_WINDOWS = [
  { valueSeconds: 120, text: '2 min' },
  { valueSeconds: 300, text: '5 min' },
  { valueSeconds: 600, text: '10 min' },
]
const VALID_INTERVALS = [
  { valueSeconds: 1, text: '1 sec' },
  { valueSeconds: 2, text: '2 sec' },
  { valueSeconds: 5, text: '5 sec' },
]

class ConfigPanel extends React.PureComponent {
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
        <WindowIntervalSelector
          windows={VALID_WINDOWS}
          intervals={VALID_INTERVALS}
          defaultWindow={120}
          defaultInterval={2}
          onPollIntervalSecondsChange={this.props.onPollIntervalSecondsChange}
          onWindowSecondsChange={this.props.onWindowSecondsChange} />
        <Segment.Group horizontal compact>
          <ContextMenu
            contextData={this.props.contextData}
            onContextSelect={this.onContextSelect}
            onNewContext={this.props.onNewContext}
            onRemoveContext={this.props.onRemoveContext} />
          <ChartSelector
            disabled={!this.state.contextSelected}
            charts={charts}
            onClearCharts={this.onClearCharts}
            onAddChart={this.onAddChart} />
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
  onWindowSecondsChange: PropTypes.func.isRequired,
  onPollIntervalSecondsChange: PropTypes.func.isRequired,
  onRemoveContext: PropTypes.func.isRequired,
}

export default ConfigPanel
