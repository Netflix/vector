import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

import { flatten, uniqueFilter } from '../../utils'

class ChartSelector extends React.PureComponent {
  handleClearMenuClick = () => this.props.onClearCharts()

  handleMenuItemClick = (event, { chart }) => this.props.onAddChart(chart)

  render () {
    let groupNames = (this.props.charts || [])
      .map(chart => chart.group)
      .reduce(flatten, [])
      .filter(uniqueFilter)

    return (
      <Menu size='tiny' borderless compact fluid>
        <div>
          <Menu.Item header>Charts</Menu.Item>
          <Menu.Item content='Clear charts' onClick={this.handleClearMenuClick} disabled={this.props.disabled}/>
        </div>
        { groupNames.map(g => (
          <div key={`group-${g}`}>
            <Menu.Item header>{g}</Menu.Item>
            { this.props.charts.filter(c => c.group === g).map(c =>
              <Menu.Item
                content={c.title}
                key={`group-${g}-chart-${c.title}`}
                name={c.title}
                disabled={this.props.disabled}
                onClick={this.handleMenuItemClick}
                chart={c}/>
            )}
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
}

export default ChartSelector
