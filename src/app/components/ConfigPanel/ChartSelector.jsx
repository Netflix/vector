import React from 'react'
import PropTypes from 'prop-types'

import { Icon, Menu, Popup } from 'semantic-ui-react'

import { flatten, uniqueFilter } from '../../utils'

const chartSelectorStyle = {
  marginTop: '0px',
}

class ChartSelector extends React.PureComponent {
  handleClearMenuClick = () => this.props.onClearCharts()
  handleMenuItemClick = (e, { chart }) => this.props.onAddChart(chart)

  enableChart = (chart) => {
    return !this.props.disabled
      && (!this.props.selectedPmids
        || (chart.metricNames || []).every(mn => mn in this.props.selectedPmids))
  }

  render () {
    let groupNames = (this.props.charts || [])
      .map(chart => chart.group)
      .reduce(flatten, [])
      .filter(uniqueFilter)

    return (
      <Menu size='tiny' borderless fluid style={chartSelectorStyle}>

        <div>
          <Menu.Item header>Charts</Menu.Item>
          <Menu.Item content='Clear charts'
            onClick={this.handleClearMenuClick}
            disabled={this.props.disabled}/>
        </div>

        { groupNames.map(g => (
          <div key={`group-${g}`}>
            <Menu.Item header>{g}</Menu.Item>
            { this.props.charts.filter(c => c.group === g).map(c => (

              <Menu.Item key={`group-${g}-chart${c.title}`}
                name={c.title}
                disabled={!this.enableChart(c)}
                onClick={this.handleMenuItemClick}
                chart={c}>

                { c.title }
                { c.tooltipText &&
                    <Popup content={c.tooltipText} trigger={<Icon name='help circle' />} />
                }

              </Menu.Item>

            ))}
          </div>
        )) }

      </Menu>
    )
  }
}

ChartSelector.defaultProps = {
  disabled: false,
}

ChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedPmids: PropTypes.object,
}

export default ChartSelector
