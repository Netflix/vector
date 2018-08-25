import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Popup, Icon, Button } from 'semantic-ui-react'

class DashHeader extends React.PureComponent {
  state = {
    modalOpen: false
  }

  handleSettingsIcon = () => this.setState({ modalOpen: true })
  handleCloseSettings = () => this.setState({ modalOpen: false })
  handleNewSettings = (settings) => {
    this.setState({ modalOpen: false })
    this.props.onNewSettings(this.props.chartInfo, settings)
  }
  handleCloseClicked = (e) => {
    e.stopPropagation()
    this.props.onCloseClicked(this.props.chartInfo)
  }

  chartSubtitle = (c) => c.context.target.hostname
    + (c.context.target.hostspec === 'localhost' ? '' : (' ' + c.context.target.hostspec))
    + (c.context.target.containerId === '_all' ? '' : (' ' + c.context.target.containerId))

  render () {
    const HelpComponent = this.props.chartInfo.helpComponent
    const SettingsComponent = this.props.chartInfo.settingsComponent
    const chartInfo = this.props.chartInfo

    return (
      <div>
        { this.props.chartInfo.title }<br/>
        { this.chartSubtitle(chartInfo) }

        { chartInfo.settingsComponent &&
          <Modal dimmer='inverted' open={this.state.modalOpen} onClose={this.handleCloseSettings} trigger={
            <Icon  name='setting' circular fitted link onClick={this.handleSettingsIcon} /> }>
            <Modal.Content>
              <SettingsComponent {...chartInfo} pmids={this.props.pmids} onNewSettings={this.handleNewSettings} onClose={this.handleCloseSettings} />
            </Modal.Content>
          </Modal> }

        { chartInfo.helpComponent &&
          <Modal dimmer='inverted' trigger={
            <Icon name='help' circular fitted link/>}>
            <Modal.Content>
              <HelpComponent chartInfo={chartInfo} />
            </Modal.Content>
          </Modal> }

        { chartInfo.isHighOverhead &&
          <Popup content='May cost high overhead, see help' trigger={
            <Icon name='exclamation' circular fitted />} /> }

        { chartInfo.isContainerAware &&
          <Popup content='Container aware' trigger={
            <Icon name='check' circular fitted />} /> }

        <Button className='doNotDrag' circular size='tiny' basic icon='close' floated='right' onClick={this.handleCloseClicked} />
      </div>
    )
  }
}

DashHeader.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  pmids: PropTypes.array.isRequired,
  onNewSettings: PropTypes.func,
  onCloseClicked: PropTypes.func,
}

export default DashHeader
