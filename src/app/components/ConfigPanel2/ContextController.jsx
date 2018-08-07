import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'semantic-ui-react'

import AddContextButton from './AddContextButton.jsx'

class ContextController extends React.Component {
  state = { }

  onContextClick = (e, { context }) => {
    this.setState({ selectedContext: context })
    this.props.onContextSelect(context)
  }

  isActive = (context) => {
    return (this.state.selectedContext
      && this.state.selectedContext.target.hostname === context.target.hostname
      && this.state.selectedContext.target.hostspec === context.target.hostspec
      && this.state.selectedContext.target.containerId === context.target.containerId)
  }

  onNewContext = (target) => {
    if (this.props.contextData.some(c =>
      target.hostname === c.target.hostname
      && target.hostspec === c.target.hostspec
      && target.containerId === c.target.containerId)) {
      alert('A context already exists for this target')
    } else {
      this.props.onNewContext(target)
    }
  }

  render () {
    return (
      <Menu vertical pointing>

        { (this.props.contextData === null || this.props.contextData.length === 0) &&
          <Menu.Item disabled>No active connections</Menu.Item> }

        { this.props.contextData && this.props.contextData.length >= 1 && this.props.contextData.map((ctx, ctxidx) =>
          <Menu.Item key={ctxidx} active={this.isActive(ctx)} onClick={this.onContextClick} context={ctx} disabled={!ctx.contextId}>
            Hostname: {ctx.target.hostname}<br/>
            Hostspec: {ctx.target.hostspec}<br/>
            Container: {ctx.target.containerId}
          </Menu.Item>
        )}

        <Menu.Item>
          <AddContextButton onNewContext={this.onNewContext}/>
        </Menu.Item>
      </Menu>
    )
  }
}

ContextController.propTypes = {
  contextData: PropTypes.array.isRequired,
  onContextSelect: PropTypes.func.isRequired,
  onNewContext: PropTypes.func.isRequired,
}

export default ContextController
