import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Form } from 'semantic-ui-react'
import debounce from 'lodash.debounce'

import { fetchContainerList } from '../../utils'

class AddContextModal extends React.PureComponent {
  state = {
    modalOpen: false,
    containerDropdownOptions: [
      { text: 'N/A', value: '_all' }
    ],
    containerId: '_all',
    connected: false,
    hostport: this.props.defaultPort,
    hostspec: this.props.defaultHostspec,
  }

  containerNameResolver = this.props.useCgroupId ? (c => c.cgroup) : (c => c.containerId)

  refreshContainerList = async () => {
    if (!this.state.hostname || !this.state.hostport || !this.state.hostspec) return

    this.setState({
      containerDropdownOptions: [ { value: '_all', text: '.. connecting ..' } ],
      containerId: '_all',
      connected: false,
    })

    const containerList = await fetchContainerList(
      this.state.hostname, this.state.hostport, this.state.hostspec)

    const containerDropdownOptions = []
      .concat({ text: 'All', value: '_all' })
      .concat(containerList.map(c => ({ text: this.containerNameResolver(c), value: this.containerNameResolver(c) })))

    this.setState({ containerDropdownOptions, containerId: '_all', connected: true })
  }

  refreshContainerList = debounce(this.refreshContainerList, 500)

  handleHostnameChange = (e, { value }) => this.setState({ hostname: value }, this.refreshContainerList)
  handleHostportChange = (e, { value }) => this.setState({ hostport: value }, this.refreshContainerList)
  handleHostspecChange = (e, { value }) => this.setState({ hostspec: value }, this.refreshContainerList)
  handleContainerChange = (e, { value }) => this.setState({ containerId: value })
  handleClose = () => this.setState({ modalOpen: false })
  handleOpen = () => this.setState({ modalOpen: true })

  handleSubmit = () => {
    this.props.onNewContext({
      hostname: this.state.hostname + ':' + this.state.hostport,
      hostspec: this.state.hostspec,
      containerId: this.state.containerId || '_all',
    })
    this.setState({ modalOpen: false })
  }

  render () {
    return (
      <Modal
        open={this.state.modalOpen}
        closeIcon={true}
        onClose={this.handleClose}
        trigger={this.props.render(this.handleOpen)}>

        <Modal.Header>Add a context</Modal.Header>

        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>

            <Form.Input label='Hostname' onChange={this.handleHostnameChange} placeholder='1.2.3.4' />
            <Form.Input label='Port' onChange={this.handleHostportChange} value={this.state.hostport} />
            <Form.Input label='Hostspec' onChange={this.handleHostspecChange} value={this.state.hostspec} disabled={this.props.disableHostspecInput}/>

            <Form.Dropdown label='Container' placeholder='Select container' fluid search selection
              disabled={!this.state.connected || this.props.disableContainerSelect}
              value={this.state.containerId}
              options={this.state.containerDropdownOptions}
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
  defaultPort: PropTypes.number.isRequired,
  defaultHostspec: PropTypes.string.isRequired,
  disableHostspecInput: PropTypes.bool.isRequired,
  disableContainerSelect: PropTypes.bool.isRequired,
  useCgroupId: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
}

export default AddContextModal
