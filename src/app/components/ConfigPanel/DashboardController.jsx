import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Icon } from 'semantic-ui-react'

const menuStyle = {
  marginBottom: '0px',
  marginTop: '0px',
}

class DashboardController extends React.PureComponent {
  state = {
    windowSeconds: this.props.defaultWindow,
    intervalSeconds: this.props.defaultInterval,
  }

  handleWindowChange = (e, { name }) => {
    this.setState({ windowSeconds: parseInt(name) })
    this.props.onWindowSecondsChange(parseInt(name))
  }

  handleIntervalChange = (e, { name }) => {
    this.setState({ intervalSeconds: parseInt(name) })
    this.props.onPollIntervalSecondsChange(parseInt(name))
  }

  handleDashboardIcon = () => {
    this.props.onDashboardToggle()
  }

  render () {
    return (
      <Menu style={menuStyle} borderless fluid>

        <Menu.Item header onClick={this.handleDashboardIcon}>
          Dashboard
          <Icon name={this.props.isDashboardOpen ? 'chevron up' : 'chevron down'} />
        </Menu.Item>

        <Menu.Item header>Window</Menu.Item>
        { this.props.windows.map(w => (
          <Menu.Item key={`window-${w.valueSeconds}`}
            active={this.state.windowSeconds === w.valueSeconds}
            name={w.valueSeconds.toString()}
            content={w.text}
            onClick={this.handleWindowChange}/>
        ))}

        <Menu.Item header>Interval</Menu.Item>
        { this.props.intervals.map(i => (
          <Menu.Item key={`interval-${i.valueSeconds}`}
            active={this.state.intervalSeconds === i.valueSeconds}
            name={i.valueSeconds.toString()}
            content={i.text}
            onClick={this.handleIntervalChange}/>
        ))}

        <Menu.Item header>Control</Menu.Item>
        <Menu.Item active={this.props.isDashboardPlaying} onClick={this.props.onPlay}>
          <Icon name='play' />
          Play
        </Menu.Item>
        <Menu.Item active={!this.props.isDashboardPlaying} onClick={this.props.onPause}>
          <Icon name='pause' />
          Pause
        </Menu.Item>

      </Menu>
    )
  }
}

DashboardController.propTypes = {
  windows: PropTypes.array.isRequired,
  intervals: PropTypes.array.isRequired,
  defaultWindow: PropTypes.number.isRequired,
  defaultInterval: PropTypes.number.isRequired,
  onWindowSecondsChange: PropTypes.func.isRequired,
  onPollIntervalSecondsChange: PropTypes.func.isRequired,
  onDashboardToggle: PropTypes.func.isRequired,
  isDashboardOpen: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  isDashboardPlaying: PropTypes.bool.isRequired,
}

export default DashboardController
