/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { Button, Form } from 'semantic-ui-react'

const TIMEOUTS = { response: 5000, deadline: 10000 }

// TODO ugh how do we get this cleanly
import config from '../../config'

function getStatusFromDataset(dataset) {
  // oh for the ?. operator
  return dataset && dataset[0] && dataset[0].data && dataset[0].data[0] && dataset[0].data[0].value || '?'
}

const FG_DURATIONS = [ 5, 10, 20, 60 ]

/**
 * Takes over a chart panel to allow generation of a flamegraph
 *
 * Directly calls the pmapi to submit requests, and then waits for the response
 * to come in via normal datasets.
 *
 * It is expected that the metricNames[] field in the chart record contains the correct
 * metric name to poll for a flamegraph
 */
class Flamegraph extends React.PureComponent {
  state = {
    durationSeconds: FG_DURATIONS[0],
    fetchFile: null,
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
    const { chartInfo } = this.props
    const { durationSeconds } = this.state

    const hostname = chartInfo.context.target.hostname
    const contextId = chartInfo.context.contextId
    const fgtype = chartInfo.metricNames[0]

    try {
      this.setState({ fetchFile: null })
      await superagent.get(`${config.protocol}://${hostname}/pmapi/${contextId}/_store`)
        .timeout(TIMEOUTS)
        .query({ name: fgtype, value: durationSeconds })
    } catch (err) {
      console.log('flamegraph trigger failed', err)
      console.error(err)
    }
  }

  render () {
    const { durationSeconds, fetchFile } = this.state
    const { dataset } = this.props

    const hostname = this.props.chartInfo.context.target.hostname
    const status = getStatusFromDataset(dataset)
    const isIdle = ['IDLE', 'ERROR'].includes(status.split(' ')[0])
    const durationOptions = FG_DURATIONS.map(sec => ({ text: `${sec} sec`, value: sec }))

    return (
      <div>
        <p>Flamegraph previous request status: {status}</p>

        <p>Profile duration:</p>

        <Form.Dropdown className='doNotDrag'
          value={durationSeconds}
          options={durationOptions}
          onChange={this.handleDurationChange} />

        <p />

        <Button primary className='doNotDrag'
          content='Start capture'
          onClick={this.requestGenerate}
          disabled={!isIdle} />

        { fetchFile &&
          <div className='doNotDrag'>
            <p>Fetch url: {fetchFile}</p>
            <a href={`${config.protocol}://${hostname}/${fetchFile}`}
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
