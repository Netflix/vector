import React from 'react'
import PropTypes from 'prop-types'

import { Grid } from 'semantic-ui-react'

import SimpleChartRow from './SimpleChartRow.jsx'

class SimpleChartSelector extends React.PureComponent {
  handleClearMenuClick = () => this.props.onClearCharts()
  handleSimpleButtonClick = (e, { bundle }) => {
    const { charts, onAddChart, onRequestClose, onClearCharts } = this.props

    // clear charts before going ahead
    onClearCharts()

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
      <Grid celled width={5}>
        <SimpleChartRow
          icon='remove' buttonLabel='Clear' disabled={disabled}
          onClick={this.handleClearMenuClick}
          description='Clear all charts' />

        { bundles.map(b => (
          <SimpleChartRow key={b.name}
            icon={b.iconName} buttonLabel={b.name} disabled={disabled}
            onClick={this.handleSimpleButtonClick}
            description={b.description}
            bundle={b} />
        ))}
      </Grid>
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
