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

import { Modal, Form } from 'semantic-ui-react'
import debounce from 'lodash.debounce'

import { fetchContainerList } from '../../utils'

class AddContextModal extends React.PureComponent {
  state = {
    modalOpen: !!this.props.initiallyOpen,
    protocolDropdownOptions: [
      { text: 'HTTP', value: 'http' },
      { text: 'HTTPS', value: 'https' }
    ],
    containerDropdownOptions: [
      { text: 'N/A', value: '_all' }
    ],
    containerId: '_all',
    connected: false,
    protocol: this.props.defaultProtocol,
    hostport: this.props.defaultPort,
    hostspec: this.props.defaultHostspec,
  }

  containerNameResolver = this.props.useCgroupId ? (c => c.cgroup) : (c => c.containerId)

  refreshContainerList = async () => {
    const { protocol, hostname, hostport, hostspec } = this.state
    if (!protocol || !hostname || !hostport || !hostspec) return

    this.setState({
      containerDropdownOptions: [
        { value: '_all', text: '.. connecting ..' }
      ],
      containerId: '_all',
      connected: false,
    })

    const containerList = await fetchContainerList(protocol, hostname, hostport, hostspec)

    const containerDropdownOptions = []
      .concat({ text: 'All', value: '_all' })
      .concat(containerList.map(c => ({ text: this.containerNameResolver(c), value: this.containerNameResolver(c) })))

    this.setState({ containerDropdownOptions, containerId: '_all', connected: true })
  }
  refreshContainerList = debounce(this.refreshContainerList, 500)

  handleProtocolChange = (e, { value }) => this.setState({ protocol: value }, this.refreshContainerList)
  handleHostnameChange = (e, { value }) => this.setState({ hostname: value }, this.refreshContainerList)
  handleHostportChange = (e, { value }) => this.setState({ hostport: value }, this.refreshContainerList)
  handleHostspecChange = (e, { value }) => this.setState({ hostspec: value }, this.refreshContainerList)
  handleContainerChange = (e, { value }) => this.setState({ containerId: value })
  handleClose = () => this.setState({ modalOpen: false })
  handleOpen = () => this.setState({ modalOpen: true })

  handleSubmit = () => {
    const { protocol, hostname, hostport, hostspec, containerId } = this.state
    const { onNewContext } = this.props
    onNewContext({
      protocol: protocol,
      hostname: hostname + ':' + hostport,
      hostspec: hostspec,
      containerId: containerId || '_all',
    })
    this.setState({ modalOpen: false })
  }

  render () {
    const { modalOpen, protocolDropdownOptions, protocol, hostport, hostspec, connected, containerId, containerDropdownOptions } = this.state
    const { render, disableHostspecInput, disableContainerSelect } = this.props

    return (
      <Modal
        open={modalOpen}
        closeIcon={true}
        onClose={this.handleClose}
        trigger={render(this.handleOpen)}>

        <Modal.Header>Add connection</Modal.Header>

        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>

            <Form.Dropdown label='Protocol' fluid selection value={protocol} options={protocolDropdownOptions} onChange={this.handleProtocolChange} />
            <Form.Input label='Hostname' onChange={this.handleHostnameChange} placeholder='1.2.3.4' />
            <Form.Input label='Port' onChange={this.handleHostportChange} value={hostport} />
            <Form.Input label='Hostspec' onChange={this.handleHostspecChange} value={hostspec} disabled={disableHostspecInput}/>

            <Form.Dropdown label='Container' placeholder='Select container' fluid search selection
              disabled={!connected || disableContainerSelect}
              value={containerId}
              options={containerDropdownOptions}
              onChange={this.handleContainerChange} />

            <Form.Button type='submit'>Add</Form.Button>

          </Form>
        </Modal.Content>

      </Modal>
    )
  }
}

AddContextModal.propTypes = {
  onNewContext: PropTypes.func.isRequired,
  defaultProtocol: PropTypes.string.isRequired,
  defaultPort: PropTypes.number.isRequired,
  defaultHostspec: PropTypes.string.isRequired,
  disableHostspecInput: PropTypes.bool.isRequired,
  disableContainerSelect: PropTypes.bool.isRequired,
  useCgroupId: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
  initiallyOpen: PropTypes.bool,
}

export default AddContextModal
