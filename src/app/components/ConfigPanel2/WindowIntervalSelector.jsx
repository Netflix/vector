import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

class WindowIntervalSelector extends React.Component {
  state = {
    windowSeconds: this.props.defaultWindow,
    intervalSeconds: this.props.defaultInterval,
  }

  handleWindowChange = (e, { name }) => {
    console.log('handleWindowChange')
    this.setState({ windowSeconds: parseInt(name) })
  }

  handleIntervalChange = (e, { name }) => {
    console.log('handleIntervalChange')
    this.setState({ intervalSeconds: parseInt(name) })
  }

  render () {
    return (
      <Menu>
        <Menu.Item header>Window</Menu.Item>
        { this.props.windows.map((w, idx) => (
          <Menu.Item key={idx} active={this.state.windowSeconds === w.valueSeconds} name={w.valueSeconds.toString()} content={w.text} onClick={this.handleWindowChange}/>)) }
        <Menu.Item header>Interval</Menu.Item>
        { this.props.intervals.map((i, idx) => (
          <Menu.Item key={idx} active={this.state.intervalSeconds === i.valueSeconds} name={i.valueSeconds.toString()} content={i.text} onClick={this.handleIntervalChange}/>)) }
      </Menu>
    )
  }
}

WindowIntervalSelector.propTypes = {
  windows: PropTypes.array.isRequired,
  intervals: PropTypes.array.isRequired,
  defaultWindow: PropTypes.number.isRequired,
  defaultInterval: PropTypes.number.isRequired,
}

export default WindowIntervalSelector
