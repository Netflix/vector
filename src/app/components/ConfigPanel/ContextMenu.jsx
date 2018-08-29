import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Loader, Button } from 'semantic-ui-react'

import AddContextModal from './AddContextModal.jsx'
import { matchesTarget } from '../../utils'

class ContextMenu extends React.PureComponent {
  state = { }

  handleContextClick = (e, { context }) => {
    this.setState({ selectedContext: context })
    this.props.onContextSelect(context)
  }

  handleContextXClick = (e, { context }) => {
    // the button is inside the menu; stop propagation to prevent the
    // x button followed by a context menu item click
    e.stopPropagation()

    // deselect context if this was the one
    if (this.isActiveMenuSelection(context)) {
      this.setState({ selectedContext: null })
      this.props.onContextSelect(null)
    }

    this.props.onRemoveContext(context)
  }

  isActiveMenuSelection = (context) => {
    return matchesTarget(this.state.selectedContext && this.state.selectedContext.target, context.target)
  }

  isLoading = (context) => {
    return !(context.contextId
      && (Object.keys(context.pmids || {}).length > 0)
      && context.hostname
      && context.containerList)
  }

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

  handleNewContext = (target) => {
    if (this.props.contextData.some(c => matchesTarget(target, c.target))) {
      alert('A context already exists for this target')
    } else {
      this.props.onNewContext(target)
    }
  }

  addContextButton = (showModal) => <Button onClick={showModal}>Add Context ...</Button>

  menuText = (target) => {
    let children = [target.hostname, ' => ', target.hostspec]
    if (target.containerId !== '_all') {
      children = children.concat(<br key={`br-${target.hostname}-${target.hostspec}-${target.containerId}`}/>, 'Container: ', target.containerId)
    }
    return children
  }

  render () {
    return (
      <Menu vertical pointing attached='top' borderless>
        { /* advise if no connections */ }
        { (this.props.contextData === null || this.props.contextData.length === 0) &&
          <Menu.Item disabled>No active connections</Menu.Item>
        }

        { /* regular context menu selector */ }
        { (this.props.contextData || []).map(ctx =>
          <Menu.Item
            key={`ctx-${ctx.target.hostname}-${ctx.target.hostspec}-${ctx.target.containerId}`}
            active={this.isActiveMenuSelection(ctx)}
            onClick={this.handleContextClick}
            context={ctx}
            disabled={this.isLoading(ctx)} >

            { /* text area of menu */ }
            {this.menuText(ctx.target)}

            { /* loading spinner */ }
            <Loader active={this.isLoading(ctx)} size='small' />

            { /* x button to close */ }
            <Button size='mini' compact floated='right'
              color={this.menuColor(ctx)}
              context={ctx}
              content='X'
              onClick={this.handleContextXClick} />

          </Menu.Item>
        )}

        { /* add context modal, popped by a button */ }
        <Menu.Item>
          <AddContextModal
            onNewContext={this.handleNewContext}
            defaultPort='7402'
            defaultHostspec='localhost'
            render={this.addContextButton} />

        </Menu.Item>

      </Menu>
    )
  }
}

ContextMenu.propTypes = {
  contextData: PropTypes.array.isRequired,
  onContextSelect: PropTypes.func.isRequired,
  onNewContext: PropTypes.func.isRequired,
  onRemoveContext: PropTypes.func.isRequired,
}

export default ContextMenu
