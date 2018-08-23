import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

import { flatten, uniqueFilter } from '../../processors/utils'

class ChartSelector extends React.PureComponent {
  // get unique group names
  handleClearMenuClick = () => this.props.onClearCharts()

  handleMenuItemClick = (event, { chart }) => this.props.onAddChart(chart)

  render () {
    let groupNames
    if (this.props.charts) {
      groupNames = this.props.charts
        .map(chart => chart.group)
        .reduce(flatten, [])
        .filter(uniqueFilter)
    } else {
      groupNames = []
    }

    return (
      <Menu size='tiny' borderless compact fluid>
        <div key='_clear'>
          <Menu.Item header>Charts</Menu.Item>
          <Menu.Item content='Clear charts' onClick={this.handleClearMenuClick} disabled={this.props.disabled}/>
        </div>
        { groupNames.map((g, gidx) => (
          <div key={gidx}>
            <Menu.Item header>{g}</Menu.Item>
            { this.props.charts.filter(c => c.group === g).map((c, cidx) =>
              <Menu.Item disabled={this.props.disabled} name={c.title} content={c.title} key={cidx} onClick={this.handleMenuItemClick} chart={c}/>
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
