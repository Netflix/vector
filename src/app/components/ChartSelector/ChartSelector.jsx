import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

import { flatten, uniqueFilter } from '../../processors/utils'

function ChartSelector({ charts, onAddChart, onClearCharts }) {
  // get unique group names
  let groupNames
  if (charts) {
    groupNames = charts
      .map(chart => chart.group)
      .reduce(flatten, [])
      .filter(uniqueFilter)
  } else {
    groupNames = []
  }

  const onClearMenuClick = () => onClearCharts()

  const onMenuItemClick = (event, { chart }) => onAddChart(chart)

  return (
    <Menu >
      <Menu.Item content='Clear charts' onClick={onClearMenuClick}/>
      { groupNames.map((g, gidx) => (
        <div key={gidx}>
          <Menu.Item header>{g}</Menu.Item>
          { charts.filter(c => c.group === g).map((c, cidx) => <Menu.Item name={c.title} content={c.title} key={cidx} onClick={onMenuItemClick} chart={c}/>) }
        </div>
      )) }
    </Menu>
  )
}

ChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
}

export default ChartSelector
