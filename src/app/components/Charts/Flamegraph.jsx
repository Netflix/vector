import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { Button, Form } from 'semantic-ui-react'

const TIMEOUTS = { response: 5000, deadline: 10000 }

function getStatusFromDataset(dataset) {
  // oh for the ?. operator
  return dataset && dataset[0] && dataset[0].data && dataset[0].data[0] && dataset[0].data[0].value || '?'
}

const FG_DURATIONS = [ 5, 10, 20, 60 ]

class Flamegraph extends React.PureComponent {
  state = {
    durationSeconds: FG_DURATIONS[0],
    fetchUrl: null,
  }

  static getDerivedStateFromProps(newProps) {
    // we need to capture the DONE filename, because it only appears for a single round
    // ie: after DONE it reverts to IDLE state
    const splitResponse = getStatusFromDataset(newProps.dataset).split(' ')

    return (splitResponse[0] === 'DONE')
      ? { fetchFile: splitResponse[1] }
      : null
  }

  handleDurationChange = (e, { value }) => this.setState({ durationSeconds: value })

  requestGenerate = async () => {
    const hostname = this.props.chartInfo.context.target.hostname
    const contextId = this.props.chartInfo.context.contextId
    const seconds = this.state.durationSeconds
    const fgtype = this.props.chartInfo.metricNames[0]

    try {
      await superagent.get(`http://${hostname}/pmapi/${contextId}/_store`)
        .timeout(TIMEOUTS)
        .query({ name: fgtype, value: seconds })
    } catch (err) {
      console.log('flamegraph trigger failed', err)
      console.error(err)
    }
  }

  render () {
    const hostname = this.props.chartInfo.context.target.hostname
    const dataset = this.props.dataset
    const status = getStatusFromDataset(dataset)
    const isIdle = ['IDLE', 'ERROR'].includes(status.split(' ')[0])

    return (
      <div>
        <p>Flamegraph previous request status: {status}</p>

        <p>Profile duration:</p>

        <Form.Dropdown
          className='doNotDrag'
          value={this.state.durationSeconds}
          options={FG_DURATIONS.map(sec => ({ text: `${sec} sec`, value: sec }))}
          onChange={this.handleDurationChange} />

        <p />

        <Button primary className='doNotDrag' content='Start capture' onClick={this.requestGenerate} disabled={!isIdle} />

        { this.state.fetchFile &&
          <div>
            <p className='doNotDrag'>Fetch url: {this.state.fetchFile}</p>
            <a className='doNoTDrag' href={`http://${hostname}/${this.state.fetchFile}`}
              rel='noopener noreferrer' target='_blank' >View / download</a>
          </div> }

      </div>
    )
  }
}

Flamegraph.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  dataset: PropTypes.array.isRequired,
}

export default Flamegraph
