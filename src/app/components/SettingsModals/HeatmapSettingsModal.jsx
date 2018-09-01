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
    const chartMaxValue = getLargestValueInDataset(this.props.dataset)
    const yAxisOptions = (this.props.dataset || [])
      .map(mi => mi.yAxisLabels)
      .filter(uniqueFilter)
      .map((label, index) => ({ text: label, value: index }))
      .filter(li => li.value !== 0) // remove any 0 so we can replace it with an auto
      .concat({ text: 'Auto', value: 0 })

    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>

        <Form.Input label='Maximum value for heatmap range (use 0 for auto range)'
          value={this.state.heatmapMaxValue || 0}
          onChange={this.handleMaxValueChange} />
        <label>Current auto max: {chartMaxValue}</label>
        <br/>

        <Form.Select label='Maximum value for Y axis (or select Auto)'
          options={yAxisOptions}
          value={this.state.maxInstanceValue || 0}
          onChange={this.handleMaxYValueChange} />

        { this.props.selectedMetrics &&
          <Form.Group grouped>
            <label>Select metrics</label>
            { this.props.metricNames.map((m) =>
              <Form.Checkbox key={m} label={m}
                onChange={this.handleSelectedMetricChange}
                checked={this.state.selectedMetrics.includes(m)} />
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
