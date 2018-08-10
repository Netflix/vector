import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Loader, Button } from 'semantic-ui-react'

import AddContextButton from './AddContextButton.jsx'

class ContextMenu extends React.Component {
  state = { }

  onContextClick = (e, { context }) => {
    this.setState({ selectedContext: context })
    this.props.onContextSelect(context)
  }

  isActiveMenuSelection = (context) => {
    return (this.state.selectedContext
      && this.state.selectedContext.target.hostname === context.target.hostname
      && this.state.selectedContext.target.hostspec === context.target.hostspec
      && this.state.selectedContext.target.containerId === context.target.containerId)
  }

  isLoading = (context) => !(context.contextId
      && (Object.keys(context.pmids).length > 0)
      && context.hostname
      && context.containerList)

  menuColor = (context) => {
    if (context.errText) {
      return 'red'
    } else {
      if (this.isLoading(context)) {
        return 'grey'
      } else {
        return 'green'
      }
    }
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
      <Menu vertical pointing attached='top' borderless>

        { (this.props.contextData === null || this.props.contextData.length === 0) &&
          <Menu.Item disabled>No active connections</Menu.Item> }

        { this.props.contextData && this.props.contextData.length >= 1 && this.props.contextData.map((ctx, ctxidx) =>
          <Menu.Item key={ctxidx}
            active={this.isActiveMenuSelection(ctx)}
            onClick={this.onContextClick}
            context={ctx}
            disabled={this.isLoading(ctx)} >
            {ctx.target.hostname} =&gt; {ctx.target.hostspec}<br/>
            Container: {ctx.target.containerId}
            <Loader active={this.isLoading(ctx)} size='small' />
            <Button size='mini' compact floated='right' color={this.menuColor(ctx)}>X</Button>
          </Menu.Item>
        )}

        <Menu.Item>
          <AddContextButton onNewContext={this.onNewContext}/>
        </Menu.Item>
      </Menu>
    )
  }
}

ContextMenu.propTypes = {
  contextData: PropTypes.array.isRequired,
  onContextSelect: PropTypes.func.isRequired,
  onNewContext: PropTypes.func.isRequired,
}

export default ContextMenu
