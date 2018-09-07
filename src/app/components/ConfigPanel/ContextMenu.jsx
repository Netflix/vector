import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Button } from 'semantic-ui-react'

import AddContextModal from './AddContextModal.jsx'
import ContextMenuItem from './ContextMenuItem.jsx'
import { matchesTarget } from '../../utils'

const chartSelectorStyle = {
  marginTop: '0px',
}

class ContextMenu extends React.PureComponent {
  handleNewContext = (target) => {
    const { contextData, onNewContext } = this.props
    if (contextData.some(c => matchesTarget(target, c.target))) {
      alert('A context already exists for this target')
    } else {
      onNewContext(target)
    }
  }

  addContextButton = (showModal) => <Button onClick={showModal}>Add Context ...</Button>

  render () {
    const { contextData, config, initialAddContext, onRemoveContext, onContextSelect, selectedContext } = this.props
    const { defaultPort, defaultHostspec, disableHostspecInput, disableContainerSelect, useCgroupId } = config

    return (
      <Menu vertical pointing attached='top' borderless style={chartSelectorStyle}>

        { /* advise if no connections */ }
        { (contextData === null || contextData.length === 0) &&
          <Menu.Item disabled>No active connections</Menu.Item>
        }

        { /* regular context menu selector */ }
        { (contextData || []).map(ctx =>
          <ContextMenuItem
            key={`ctx-${ctx.target.hostname}-${ctx.target.hostspec}-${ctx.target.containerId}`}
            ctx={ctx}
            onRemoveContext={onRemoveContext}
            onContextSelect={onContextSelect}
            isActive={matchesTarget(selectedContext && selectedContext.target, ctx.target)}/>) }

        { /* add context modal, popped by a button */ }
        <Menu.Item>
          <AddContextModal
            onNewContext={this.handleNewContext}
            defaultPort={defaultPort}
            defaultHostspec={defaultHostspec}
            disableHostspecInput={disableHostspecInput}
            disableContainerSelect={disableContainerSelect}
            useCgroupId={useCgroupId}
            initiallyOpen={initialAddContext}
            render={this.addContextButton} />
        </Menu.Item>

      </Menu>
    )
  }
}

ContextMenu.propTypes = {
  config: PropTypes.shape({
    disableHostspecInput: PropTypes.bool.isRequired,
    disableContainerSelect: PropTypes.bool.isRequired,
    defaultPort: PropTypes.number.isRequired,
    defaultHostspec: PropTypes.string.isRequired,
    useCgroupId: PropTypes.bool.isRequired,
  }),
  contextData: PropTypes.array.isRequired,
  onContextSelect: PropTypes.func.isRequired,
  onNewContext: PropTypes.func.isRequired,
  onRemoveContext: PropTypes.func.isRequired,
  selectedContext: PropTypes.object,
  initialAddContext: PropTypes.bool,
}

export default ContextMenu
