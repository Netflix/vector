import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

class WindowIntervalSelector extends React.PureComponent {
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

  render () {
    return (
      <Menu style={{ marginBottom: '0px' }} borderless fluid>

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

      </Menu>
    )
  }
}

WindowIntervalSelector.propTypes = {
  windows: PropTypes.array.isRequired,
  intervals: PropTypes.array.isRequired,
  defaultWindow: PropTypes.number.isRequired,
  defaultInterval: PropTypes.number.isRequired,
  onWindowSecondsChange: PropTypes.func.isRequired,
  onPollIntervalSecondsChange: PropTypes.func.isRequired,
}

export default WindowIntervalSelector
