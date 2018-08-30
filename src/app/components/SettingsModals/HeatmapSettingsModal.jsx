import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'semantic-ui-react'

class HeatmapSettingsModal extends React.PureComponent {
  state = {
    heatmapMaxValue: this.props.heatmapMaxValue,
  }

  handleMaxValueChange = (e, { value }) => this.setState({ heatmapMaxValue: parseInt(value, 10) })

  handleSubmit = () => {
    this.props.onNewSettings(this.state)
    this.props.onClose()
  }

  render() {
    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>
        <Form.Input label='Maximum value for heatmap range (use 0 for auto range)'
          value={this.state.heatmapMaxValue}
          onChange={this.handleMaxValueChange} />

        <Form.Button type='submit'>OK</Form.Button>
      </Form>
    )
  }
}

HeatmapSettingsModal.propTypes = {
  heatmapMaxValue: PropTypes.number.isRequired,
  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default HeatmapSettingsModal
