import React from 'react'
import PropTypes from 'prop-types'

import { Input, Grid, Dropdown, Popup, Menu } from 'semantic-ui-react'

import ChartSelector from '../ChartSelector/ChartSelector.jsx'

export class ConfigPanel extends React.Component {
  state = {
    hostname: this.props.hostname,
    hostspec: this.props.hostspec,
    windowSeconds: this.props.windowSeconds,
    intervalSeconds: this.props.intervalSeconds,
    containerId: '_all'
  }

  createContainerList = () => {
    const allContainer = { text: 'All', value: '_all' }
    const containers = this.props.containers.map(c => ({ text: c, value: c }))
    const containerList = [ allContainer ].concat(containers)
    return containerList
  }

  render() {
    return (
      <div className="configpanel-container">
        <Menu secondary style={{margin: '5px'}}>
          <Popup trigger={<Menu.Item header>Connection</Menu.Item>} hoverable position='bottom left'>
            <Grid>
              <Grid.Row>
                <label>Hostname (pmwebd)</label>
                <Input onChange={this.handleHostnameChange} value={this.state.hostname}/>
              </Grid.Row>
              <Grid.Row>
                <label>Hostspec (target)</label>
                <Input onChange={this.handleHostspecChange} value={this.state.hostspec}/>
              </Grid.Row>
              <Grid.Row>
                <label>Container ID</label>
                <Dropdown search selection fluid
                  defaultValue={this.state.containerId}
                  options={this.createContainerList()}
                  onChange={this.handleContainerIdChange} />
              </Grid.Row>
            </Grid>
          </Popup>
          <Popup trigger={<Menu.Item header>Charts</Menu.Item>} hoverable>
            <ChartSelector onClearCharts={this.props.onClearCharts} onAddChart={this.props.onAddChart} charts={this.props.charts} />
          </Popup>
          <Menu.Item header>Window</Menu.Item>
          { this.props.windows.map((w, idx) => (
            <Menu.Item key={idx} active={this.state.windowSeconds === w.valueSeconds} name={w.valueSeconds.toString()} content={w.text} onClick={this.handleWindowChange}/>)) }
          <Menu.Item header>Interval</Menu.Item>
          { this.props.intervals.map((i, idx) => (
            <Menu.Item key={idx} active={this.state.intervalSeconds === i.valueSeconds} name={i.valueSeconds.toString()} content={i.text} onClick={this.handleIntervalChange}/>)) }
        </Menu>
      </div>
    )
  }

  propagateHostDataChanged = () => {
    this.props.onHostDataChanged({ hostname: this.state.hostname, hostspec: this.state.hostspec })
  }

  propagateSettingsChanged = () => {
    this.props.onSettingsChanged({ containerId: this.state.containerId, windowSeconds: this.state.windowSeconds, intervalSeconds: this.state.intervalSeconds })
  }

  handleHostnameChange = (e) => {
    this.setState({ hostname: e.target.value }, this.propagateHostDataChanged)
  }

  handleHostspecChange = (e) => {
    this.setState({ hostspec: e.target.value }, this.propagateHostDataChanged)
  }

  handleContainerIdChange = (e, { value }) => {
    this.setState({ containerId: value }, this.propagateSettingsChanged)
  }

  handleWindowChange = (e, { name }) => {
    this.setState({ windowSeconds: parseInt(name) }, this.propagateSettingsChanged)
  }

  handleIntervalChange = (e, { name }) => {
    this.setState({ intervalSeconds: parseInt(name) }, this.propagateSettingsChanged)
  }
}

ConfigPanel.propTypes = {
  onHostDataChanged: PropTypes.func.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  onClearCharts: PropTypes.func.isRequired,
  onAddChart: PropTypes.func.isRequired,
  containers: PropTypes.array.isRequired,
  windows: PropTypes.array.isRequired,
  intervals: PropTypes.array.isRequired,
  charts: PropTypes.array.isRequired,
  hostname: PropTypes.string,
  hostspec: PropTypes.string,
  windowSeconds: PropTypes.number,
  intervalSeconds: PropTypes.number,
}

export default ConfigPanel
