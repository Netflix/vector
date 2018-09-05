import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Popup, Button } from 'semantic-ui-react'

const closeButton = {
  // add some space beside the x button so it is harder to accidentally click
  marginLeft: '20px',
}

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
        { this.props.chartInfo.group + ': ' + this.props.chartInfo.title }<br/>
        { this.chartSubtitle(chartInfo) }

        { /* these show up in reverse order since they are all floated right */ }
        <Button style={closeButton} className='doNotDrag' circular size='tiny' basic icon='close' floated='right' onClick={this.handleCloseClicked} />

        { chartInfo.isHighOverhead &&
          <Popup content='May cost high overhead, see help' trigger={
            <Button className='doNotDrag' circular size='exclamation' basic icon='help' floated='right' /> } /> }

        { chartInfo.isContainerAware &&
          <Popup content='Container aware' trigger={
            <Button className='doNotDrag' circular size='check' basic icon='help' floated='right' /> } /> }

        { chartInfo.helpComponent &&
          <Modal dimmer='inverted' trigger={
            <Button className='doNotDrag' circular size='tiny' basic icon='help' floated='right' onClick={this.handleSettingsIcon} /> } >
            <Modal.Content>
              <HelpComponent chartInfo={chartInfo} />
            </Modal.Content>
          </Modal> }

        { chartInfo.settingsComponent &&
          <Modal dimmer='inverted' open={this.state.modalOpen} onClose={this.handleCloseSettings} trigger={
            <Button className='doNotDrag' circular size='tiny' basic icon='setting' floated='right' onClick={this.handleSettingsIcon} /> } >
            <Modal.Content>

              <SettingsComponent {...chartInfo}
                pmids={this.props.pmids}
                onNewSettings={this.handleNewSettings}
                onClose={this.handleCloseSettings}
                dataset={this.props.dataset} />

            </Modal.Content>
          </Modal> }

      </div>
    )
  }
}

DashHeader.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  dataset: PropTypes.array,
  pmids: PropTypes.object.isRequired,
  onNewSettings: PropTypes.func,
  onCloseClicked: PropTypes.func,
}

export default DashHeader
