import React from 'react'
import PropTypes from 'prop-types'

import { Form, Button, Checkbox } from 'semantic-ui-react'

class CustomSettingsModal extends React.Component {
  state = {
    metricName: this.props.metricName,
    percentage: this.props.percentage,
    area: this.props.area,
    cumulative: this.props.cumulative,
    converted: this.props.converted,
    conversionFunction: this.props.conversionFunction,
  }

  handleMetricChange = (e, { value }) => this.setState({ metricName: value })
  handlePercentageChange = (e, { checked }) => this.setState({ percentage: checked })
  handleAreaChange = (e, { checked }) => this.setState({ area: checked })
  handleCumulativeChange = (e, { checked }) => this.setState({ cumulative: checked })
  handleConvertedChange = (e, { checked }) => this.setState({ converted: checked })
  handleConversionFunctionChange = (e, { value }) => this.setState({ conversionFunction: value })

  handleSubmit = () => {
    this.props.onNewSettings(this.state)
    this.props.onClose()
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input label='Select Metric' value={this.state.metricName} onChange={this.handleMetricChange} />
        <Checkbox label='Percentage' checked={this.state.percentage} onChange={this.handlePercentageChange} />
        <Checkbox label='Area' checked={this.state.area} onChange={this.handleAreaChange} />
        <Checkbox label='Cumulative' checked={this.state.cumulative} onChange={this.handleCumulativeChange} />
        <Checkbox label='Converted' checked={this.state.converted} onChange={this.handleConvertedChange} />
        <Form.Input label='Conversion Function'
          disabled={!this.state.converted}
          value={this.state.converted ? this.state.conversionFunction: ''}
          onChange={this.handleConversionFunctionChange} />

        <Button type='submit'>OK</Button>
      </Form>
    )
  }
}

CustomSettingsModal.propTypes = {
  metricName: PropTypes.string.isRequired,
  percentage: PropTypes.bool.isRequired,
  area: PropTypes.bool.isRequired,
  cumulative: PropTypes.bool.isRequired,
  converted: PropTypes.bool.isRequired,
  conversionFunction: PropTypes.string.isRequired,

  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default CustomSettingsModal
