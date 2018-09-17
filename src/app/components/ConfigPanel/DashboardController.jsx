/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

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
    const { isDashboardOpen, windows, intervals, isDashboardPlaying, onPlay, onPause } = this.props
    const { windowSeconds, intervalSeconds } = this.state

    return (
      <Menu style={menuStyle} borderless fluid>
        <Menu.Item header onClick={this.handleDashboardIcon}>
          Dashboard
          <Icon name={isDashboardOpen ? 'chevron up' : 'chevron down'} />
        </Menu.Item>

        <Menu.Item header>Window</Menu.Item>
        { windows.map(w => (
          <Menu.Item key={`window-${w.valueSeconds}`}
            active={windowSeconds === w.valueSeconds}
            name={w.valueSeconds.toString()}
            content={w.text}
            onClick={this.handleWindowChange}/>
        ))}

        <Menu.Item header>Interval</Menu.Item>
        { intervals.map(i => (
          <Menu.Item key={`interval-${i.valueSeconds}`}
            active={intervalSeconds === i.valueSeconds}
            name={i.valueSeconds.toString()}
            content={i.text}
            onClick={this.handleIntervalChange}/>
        ))}

        <Menu.Item header>Control</Menu.Item>
        <Menu.Item active={isDashboardPlaying} onClick={onPlay}>
          <Icon name='play' />
          Play
        </Menu.Item>
        <Menu.Item active={!isDashboardPlaying} onClick={onPause}>
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
