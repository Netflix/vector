import React from 'react'
// import PropTypes from 'prop-types'

import { Segment  } from 'semantic-ui-react'
import ChartSelector from '../ChartSelector/ChartSelector.jsx'
import WindowSelector from './WindowSelector.jsx'
import IntervalSelector from './Interval.jsx'

import charts from '../../charts'

class ConfigPanel extends React.Component {

  onClearCharts = () => {
    console.log('onClearCharts')
  }

  onAddChart = (chart) => {
    console.log('onAddChart', chart)
  }

  render () {
    return (
      <Segment.Group>
        <Segment>
            <WindowSelector />
            <IntervalSelector />
        </Segment>
        <Segment.Group horizontal>
          <Segment>
            Add a context
            { /* <ContextController /> */ }
          </Segment>
          <Segment>
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
}

export default ConfigPanel
