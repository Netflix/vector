import React from 'react'
import PropTypes from 'prop-types'

import { Icon, Menu, Popup } from 'semantic-ui-react'

import { flatten, uniqueFilter } from '../../utils'

const chartSelectorStyle = {
  marginTop: '0px',
}

const iconStyle = {
  float: 'right',
}

const titleLinkStyle = {
  marginBottom: '0px',
  width: '100%',
  display: 'block'
}

class CustomChartSelector extends React.PureComponent {
  handleClearMenuClick = () => this.props.onClearCharts()
  handleMenuItemClick = (e, { chart }) => this.props.onAddChart(chart)

  enableChart = (chart) => {
    const { disabled, selectedPmids } = this.props
    return !disabled
      && (!selectedPmids
        || (chart.metricNames || []).every(mn => mn in selectedPmids))
  }

  render () {
    const { charts = [], disabled } = this.props

    const groupNames = charts
      .map(chart => chart.group)
      .reduce(flatten, [])
      .filter(uniqueFilter)

    const helpIcon = <Icon name='question circle outline' style={iconStyle}/>

    return (
      <Menu attached='bottom' size='tiny' borderless fluid style={chartSelectorStyle}>
        <div>
          <Menu.Item header>Charts</Menu.Item>
          <Menu.Item content='Clear charts'
            onClick={this.handleClearMenuClick}
            disabled={disabled}/>
        </div>

        { groupNames.map(g => (
          <div key={`group-${g}`}>
            <Menu.Item header>{g}</Menu.Item>

            { charts.filter(c => c.group === g).map(c => (
              <Menu.Item key={`group-${g}-chart${c.title}`}
                name={c.title}
                disabled={!this.enableChart(c)}
                onClick={this.handleMenuItemClick}
                chart={c}>

                <p style={titleLinkStyle}>{c.title}</p>

                { c.tooltipText &&
                    <Popup content={c.tooltipText} trigger={helpIcon} />
                }
              </Menu.Item>

            ))}
          </div>
        )) }
      </Menu>
    )
  }
}

CustomChartSelector.defaultProps = {
  disabled: false,
}

CustomChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedPmids: PropTypes.object,
}

export default CustomChartSelector
