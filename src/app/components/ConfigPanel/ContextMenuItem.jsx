import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Loader, Button } from 'semantic-ui-react'
import { isContextLoading } from '../../utils'

function itemColor(context) {
  if (context.errText) {
    return 'red'
  } else {
    if (isContextLoading(context)) {
      return 'grey'
    } else {
      return 'green'
    }
  }

}

class ContextMenuItem extends React.Component {
  menuText = (target) => {
    let children = [target.hostname, ' => ', target.hostspec]
    if (target.containerId !== '_all') {
      children.push(
        <br key={`br-${target.hostname}-${target.hostspec}-${target.containerId}`}/>)
      children.push('Container: ')
      children.push(target.containerId)
    }
    return children
  }

  handleContextClick = (e, { context }) => {
    this.props.onContextSelect(context)
  }

  handleContextXClick = (e, { context }) => {
    // the button is inside the menu; stop propagation to prevent the
    // x button followed by a context menu item click
    e.stopPropagation()
    this.props.onRemoveContext(context)
  }

  render () {
    const { ctx, isActive } = this.props
    const menuText = this.menuText(ctx.target)
    const isLoading = isContextLoading(ctx)

    return (
      <Menu.Item
        active={isActive}
        onClick={this.handleContextClick}
        context={ctx}
        disabled={isLoading} >

        { /* text area of menu */ }
        {menuText}

        { /* loading spinner */ }
        <Loader active={isLoading} size='small' />

        { /* x button to close */ }
        <Button size='mini' compact floated='right'
          context={ctx} content='X'
          color={itemColor(ctx)}
          onClick={this.handleContextXClick} />
      </Menu.Item>
    )
  }
}

ContextMenuItem.propTypes = {
  onRemoveContext: PropTypes.func.isRequired,
  onContextSelect: PropTypes.func.isRequired,
  ctx: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
}

export default ContextMenuItem
