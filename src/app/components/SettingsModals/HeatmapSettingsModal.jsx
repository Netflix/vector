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

import { getLargestValueInDataset } from '../../processors/modelUtils'
import { uniqueFilter } from '../../utils'

import { Form } from 'semantic-ui-react'

class HeatmapSettingsModal extends React.PureComponent {
  state = {
    heatmapMaxValue: this.props.heatmapMaxValue,
    maxInstanceValue: this.props.maxInstanceValue,
    selectedMetrics: this.props.selectedMetrics,
  }

  handleMaxValueChange = (e, { value }) => this.setState({ heatmapMaxValue: parseInt(value, 10) })
  handleMaxYValueChange = (e, { value }) => this.setState({ maxInstanceValue: parseInt(value, 10) })
  handleSelectedMetricChange = (e, { label, checked }) => {
    if (checked) {
      this.setState((state) => ({
        selectedMetrics: state.selectedMetrics.concat(label).filter(uniqueFilter)
      }))
    }

    if (!checked) {
      this.setState((state) => ({
        selectedMetrics: state.selectedMetrics.filter(e => e !== label)
      }))
    }
  }

  handleSubmit = () => {
    this.props.onNewSettings(this.state)
    this.props.onClose()
  }

  render() {
    const { dataset = [], selectedMetrics, metricNames } = this.props
    const { heatmapMaxValue = 0, maxInstanceValue = 0 } = this.state

    const chartMaxValue = getLargestValueInDataset(dataset)
    const yAxisOptions = dataset
      .map(mi => mi.yAxisLabels)
      .filter(uniqueFilter)
      .map((label, index) => ({ text: label, value: index }))
      .filter(li => li.value !== 0) // remove any 0 so we can replace it with an auto
      .concat({ text: 'Auto', value: 0 })

    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>

        <Form.Input label='Maximum value for heatmap range (use 0 for auto range)'
          value={heatmapMaxValue || 0}
          onChange={this.handleMaxValueChange} />

        <label>Current auto max: {chartMaxValue}</label><br/>

        <Form.Select label='Maximum value for Y axis (or select Auto)'
          options={yAxisOptions}
          value={maxInstanceValue || 0}
          onChange={this.handleMaxYValueChange} />

        { selectedMetrics &&
          <Form.Group grouped>
            <label>Select metrics</label>
            { metricNames.map((m) =>
              <Form.Checkbox key={m} label={m}
                onChange={this.handleSelectedMetricChange}
                checked={selectedMetrics.includes(m)} />
            )}
          </Form.Group>}

        <Form.Button type='submit'>OK</Form.Button>
      </Form>
    )
  }
}

HeatmapSettingsModal.propTypes = {
  heatmapMaxValue: PropTypes.number,
  maxInstanceValue: PropTypes.number,
  selectedMetrics: PropTypes.arrayOf(PropTypes.string),
  metricNames: PropTypes.arrayOf(PropTypes.string),
  dataset: PropTypes.array,
  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default HeatmapSettingsModal
