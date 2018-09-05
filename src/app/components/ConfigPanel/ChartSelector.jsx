import React from 'react'
import PropTypes from 'prop-types'

import { Button, Segment, Icon, Menu, Popup } from 'semantic-ui-react'

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

// TODO add a search widget
class ChartSelector extends React.PureComponent {
  state = {
    activeTab: 'simple',
  }

  handleClearMenuClick = () => this.props.onClearCharts()
  handleMenuItemClick = (e, { chart }) => this.props.onAddChart(chart)
  handleTabClick = (e, { name }) => this.setState({ activeTab: name })
  handleSimpleButtonClick = (e, { bundle }) => {
    bundle.chartTemplates
      // pull all the properties from the default chart entry by chartId
      // and override with any values from our custom template
      .map(template => ({
        ...this.props.charts.find(c => template.chartId === c.chartId),
        ...template,
      }))
      // and then add the charts
      .forEach(chart => this.props.onAddChart(chart))
    this.props.onRequestClose()
  }

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

    const { activeTab } = this.state
    const { bundles } = this.props

    return (<div>
      <Menu attached='top' tabular>
        <Menu.Item name='simple' active={activeTab === 'simple'} onClick={this.handleTabClick} />
        <Menu.Item name='custom' active={activeTab === 'custom'} onClick={this.handleTabClick} />
      </Menu>

      { activeTab === 'simple' &&
        <Segment attached='bottom'>

          <Button size='massive' icon='remove' content='Clear'
            disabled={this.props.disabled}
            onClick={this.handleClearMenuClick}/>

          { bundles.map(b => (
            <Popup key={b.name} content={b.description} position='bottom center' trigger={
              <Button
                size='massive' icon={b.iconName} content={b.name}
                bundle={b}
                disabled={this.props.disabled}
                onClick={this.handleSimpleButtonClick}/>} />
          ))}

        </Segment>
      }

      { activeTab === 'custom' &&
        <Menu attached='bottom' size='tiny' borderless fluid style={chartSelectorStyle}>
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

                  <p style={titleLinkStyle}>{ c.title }</p>
                  { c.tooltipText &&
                      <Popup content={c.tooltipText} trigger={<Icon name='help circle' style={iconStyle}/>} />
                  }

                </Menu.Item>

              ))}
            </div>
          )) }

        </Menu>
      }
    </div>)
  }
}

ChartSelector.defaultProps = {
  disabled: false,
}

ChartSelector.propTypes = {
  charts: PropTypes.array.isRequired,
  bundles: PropTypes.array.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedPmids: PropTypes.object,
}

export default ChartSelector
