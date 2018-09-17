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

import { Modal, Popup } from 'semantic-ui-react'
import DashHeaderButton from './DashHeaderButton.jsx'

const closeButton = {
  // add some space beside the x button so it is harder to accidentally click
  marginLeft: '20px',
}

class DashHeader extends React.PureComponent {
  state = {
    modalOpen: false
  }

  handleModalIcon = () => this.setState({ modalOpen: true })
  handleModalClose= () => this.setState({ modalOpen: false })
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
        { chartInfo.group + ': ' + chartInfo.title }<br/>
        { this.chartSubtitle(chartInfo) }

        { /* these show up in reverse order since they are all floated right */ }
        <DashHeaderButton icon='close' style={closeButton} onClick={this.handleCloseClicked} />

        { chartInfo.isHighOverhead &&
          <Popup content='May cost high overhead, see help' trigger={
            <DashHeaderButton icon='exclamation' /> } /> }

        { chartInfo.isContainerAware &&
          <Popup content='Container aware' trigger={
            <DashHeaderButton icon='clone' /> } /> }

        { chartInfo.helpComponent &&
          <Modal dimmer='inverted' trigger={
            <DashHeaderButton icon='help' onClick={this.handleModalIcon} /> } >
            <Modal.Content>
              <HelpComponent chartInfo={chartInfo} />
            </Modal.Content>
          </Modal> }

        { chartInfo.settingsComponent &&
          <Modal dimmer='inverted' open={this.state.modalOpen} onClose={this.handleModalClose} trigger={
            <DashHeaderButton icon='setting' onClick={this.handleModalIcon} /> } >
            <Modal.Content>

              <SettingsComponent {...chartInfo}
                pmids={this.props.pmids}
                onNewSettings={this.handleNewSettings}
                onClose={this.handleCloseClicked}
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
