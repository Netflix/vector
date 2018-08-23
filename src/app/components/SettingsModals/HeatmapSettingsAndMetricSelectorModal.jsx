import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

import { uniqueFilter } from '../../utils'

class HeatmapSettingsAndMetricSelectorModal extends React.PureComponent {
  state = {
    heatmapMaxValue: this.props.heatmapMaxValue,
    selectedMetrics: this.props.selectedMetrics,
  }

  handleMaxValueChange = (e, { value }) => this.setState({ heatmapMaxValue: parseInt(value, 10) })

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
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input label='Maximum value for heatmap range (use 0 for auto range)'
          value={this.state.heatmapMaxValue}
          onChange={this.handleMaxValueChange} />

        <Form.Group grouped>
          <label>Select metrics</label>
          { this.props.metricNames.map((m) =>
            <Form.Checkbox key={m} label={m}
              onChange={this.handleSelectedMetricChange}
              checked={this.state.selectedMetrics.includes(m)} />
          )}
        </Form.Group>

        <Form.Button type='submit'>OK</Form.Button>
      </Form>
    )
  }
}

HeatmapSettingsAndMetricSelectorModal.propTypes = {
  heatmapMaxValue: PropTypes.number.isRequired,
  selectedMetrics: PropTypes.arrayOf(PropTypes.string),
  metricNames: PropTypes.arrayOf(PropTypes.string),

  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default HeatmapSettingsAndMetricSelectorModal
