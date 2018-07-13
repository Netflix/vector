import React from 'react'
import PropTypes from 'prop-types'

import './configpanel.css'

export class ConfigPanel extends React.Component {
  state = {
    hostname: this.props.hostname,
    hostspec: this.props.hostspec,
    windowSeconds: this.props.windowSeconds,
    intervalSeconds: this.props.intervalSeconds,
    containerFilter: this.props.containerFilter
  }

  getVisibleContainerList = () => {
    const containerFilter = this.state.containerFilter
    if (containerFilter === '_all' || containerFilter === '') {
      return this.props.containers
    } else {
      return this.props.containers.filter(name => name.includes(containerFilter))
    }
  }

  render() {
    return (
      <div className="configpanel-container">
        <form>
          <label>Hostname (pmwebd)<input type='text' onChange={this.handleHostnameChange} value={this.state.hostname}/></label><br/>
          <label>Hostspec (target)<input type='text' onChange={this.handleHostspecChange} value={this.state.hostspec}/></label><br/>
          <br/>
          <label>Container filter<input type='text' onChange={this.handleContainerFilterChange} /></label><br/>
          <label>Container ID<select onChange={this.handleContainerIdChange} value={this.containerFilter}>
            <option value='_all'>All</option>
            { this.getVisibleContainerList().map((id) => { return <option key={id} value={id}>{id}</option> }) }
          </select></label>
          <label>Window<select onChange={this.handleWindowChange} value={this.state.windowSeconds}>
            { this.props.windows.map((w) => { return <option key={w.valueSeconds} value={w.valueSeconds}>{w.text}</option> }) }
          </select></label>
          <label>Interval<select onChange={this.handleIntervalChange} value={this.state.intervalSeconds}>
            { this.props.intervals.map((w) => { return <option key={w.valueSeconds} value={w.valueSeconds}>{w.text}</option> }) }
          </select></label>
        </form>
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

  handleContainerFilterChange = (e) => {
    this.setState({ containerFilter: e.target.value })
  }

  handleContainerIdChange = (e) => {
    this.setState({ containerId: e.target.value }, this.propagateSettingsChanged)
  }

  handleWindowChange = (e) => {
    this.setState({ windowSeconds: e.target.value }, this.propagateSettingsChanged)
  }

  handleIntervalChange = (e) => {
    this.setState({ intervalSeconds: e.target.value }, this.propagateSettingsChanged)
  }
}

ConfigPanel.propTypes = {
  onHostDataChanged: PropTypes.func.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  containers: PropTypes.array.isRequired,
  windows: PropTypes.array.isRequired,
  intervals: PropTypes.array.isRequired,
  hostname: PropTypes.string,
  hostspec: PropTypes.string,
  windowSeconds: PropTypes.number,
  intervalSeconds: PropTypes.number,
  containerFilter: PropTypes.string
}

export default ConfigPanel
