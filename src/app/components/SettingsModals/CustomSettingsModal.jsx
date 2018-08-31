import React from 'react'
import PropTypes from 'prop-types'
import * as formats from '../../processors/formats'
import memoizeOne from 'memoize-one'

import { Form } from 'semantic-ui-react'

class CustomSettingsModal extends React.PureComponent {
  state = {
    metricNames: this.props.metricNames,
    yTickFormat: this.props.yTickFormat,
    lineType: this.props.lineType,
    cumulative: this.props.cumulative,
    converted: this.props.converted,
    conversionFunction: this.props.conversionFunction,
  }

  handleMetricChange = (e, { value }) => this.setState({ metricNames: [value] })
  handleAreaChange = (e, { checked }) => this.setState({ lineType: checked ? 'stackedarea' : 'line'})
  handleCumulativeChange = (e, { checked }) => this.setState({ cumulative: checked })
  handleConvertedChange = (e, { checked }) => this.setState({ converted: checked })
  handleConversionFunctionChange = (e, { value }) => this.setState({ conversionFunction: value })
  handleYTickFormatChange = (e, { value }) => this.setState({ yTickFormat: formats[value] })

  handleSubmit = () => {
    this.props.onNewSettings(this.state)
    this.props.onClose()
  }

  getOptions = memoizeOne(pmids => Object.keys(pmids).map(name => ({ text: name, value: name })))

  render() {
    const options = this.getOptions(this.props.pmids)
    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>
        <Form.Dropdown label='Select metric' placeholder='Select Metric' fluid search selection
          value={this.state.metricNames && this.state.metricNames.length && this.state.metricNames[0]}
          onChange={this.handleMetricChange}
          options={options} />

        <Form.Checkbox label='Stacked Area' checked={this.state.lineType === 'stackedarea'} onChange={this.handleAreaChange} />
        <Form.Checkbox label='Cumulative' checked={this.state.cumulative} onChange={this.handleCumulativeChange} />
        <Form.Checkbox label='Converted' checked={this.state.converted} onChange={this.handleConvertedChange} />

        <Form.Input label='Conversion Function (use "value" as the variable)'
          disabled={!this.state.converted}
          value={this.state.converted ? this.state.conversionFunction: ''}
          onChange={this.handleConversionFunctionChange} />

        <Form.Group inline>
          <label>Format</label>
          <Form.Radio label='Number' name='yTickFormat' value='number'
            checked={this.state.yTickFormat === formats.number}
            onChange={this.handleYTickFormatChange} />
          <Form.Radio label='Integer' name='yTickFormat' value='integer'
            checked={this.state.yTickFormat === formats.integer}
            onChange={this.handleYTickFormatChange} />
          <Form.Radio label='Percentage' name='yTickFormat' value='percentage'
            checked={this.state.yTickFormat === formats.percentage}
            onChange={this.handleYTickFormatChange} />
        </Form.Group>

        <Form.Button type='submit'>OK</Form.Button>
      </Form>
    )
  }
}

CustomSettingsModal.propTypes = {
  pmids: PropTypes.object.isRequired,

  metricNames: PropTypes.array.isRequired,
  yTickFormat: PropTypes.func.isRequired,
  lineType: PropTypes.string.isRequired,
  cumulative: PropTypes.bool.isRequired,
  converted: PropTypes.bool.isRequired,
  conversionFunction: PropTypes.string.isRequired,

  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default CustomSettingsModal
