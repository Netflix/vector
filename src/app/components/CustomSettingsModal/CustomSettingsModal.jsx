import React from 'react'
import PropTypes from 'prop-types'

import { Form, Button, Checkbox, Dropdown } from 'semantic-ui-react'

class CustomSettingsModal extends React.Component {
  state = {
    metricNames: this.props.metricNames,
    percentage: this.props.percentage,
    lineType: this.props.lineType,
    cumulative: this.props.cumulative,
    converted: this.props.converted,
    conversionFunction: this.props.conversionFunction,
  }

  handleMetricChange = (e, { value }) => this.setState({ metricNames: [value] })
  handlePercentageChange = (e, { checked }) => this.setState({ percentage: checked })
  handleAreaChange = (e, { checked }) => this.setState({ lineType: checked ? 'stackedarea' : 'line'})
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
        <Dropdown placeholder='Select Metric' fluid search selection
          value={this.state.metricNames[0]}
          onChange={this.handleMetricChange}
          options={this.props.pmids.map(({ name }) => ({ text: name, value: name }))}/>
        <Checkbox label='Percentage' checked={this.state.percentage} onChange={this.handlePercentageChange} />
        <Checkbox label='Area' checked={this.state.lineType === 'stackedarea'} onChange={this.handleAreaChange} />
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
  pmids: PropTypes.array.isRequired,
  metricNames: PropTypes.array.isRequired,
  percentage: PropTypes.bool.isRequired,
  lineType: PropTypes.string.isRequired,
  cumulative: PropTypes.bool.isRequired,
  converted: PropTypes.bool.isRequired,
  conversionFunction: PropTypes.string.isRequired,

  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default CustomSettingsModal
