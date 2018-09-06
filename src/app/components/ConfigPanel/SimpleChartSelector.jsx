import React from 'react'
import PropTypes from 'prop-types'

import { Button, Segment, Popup } from 'semantic-ui-react'

class SimpleChartSelector extends React.PureComponent {
  handleClearMenuClick = () => this.props.onClearCharts()
  handleSimpleButtonClick = (e, { bundle }) => {
    const { charts, onAddChart, onRequestClose } = this.props

    bundle.chartTemplates
      // pull all the properties from the default chart entry by chartId
      // and override with any values from our custom template
      .map(template => ({
        ...charts.find(c => template.chartId === c.chartId),
        ...template,
      }))
      // and then add the charts
      .forEach(chart => onAddChart(chart))
    onRequestClose()
  }

  render () {
    const { disabled, bundles } = this.props

    return (
      <Segment attached='bottom'>

        <Button size='massive' icon='remove' content='Clear'
          disabled={disabled}
          onClick={this.handleClearMenuClick}/>

        { bundles.map(b => (
          <Popup key={b.name} content={b.description} position='bottom center' trigger={
            <Button
              size='massive' icon={b.iconName} content={b.name}
              bundle={b}
              disabled={disabled}
              onClick={this.handleSimpleButtonClick}/>} />
        ))}

      </Segment>
    )
  }
}

SimpleChartSelector.defaultProps = {
  disabled: false,
}

SimpleChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  bundles: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
}

export default SimpleChartSelector
