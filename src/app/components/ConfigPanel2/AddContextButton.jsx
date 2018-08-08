import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { Button, Modal, Form } from 'semantic-ui-react'

class AddContextButton extends React.Component {
  state = {
    modalOpen: false,
    containerDropdownOptions: [
      { text: 'N/A', value: '_all' }
    ],
    containerId: '_all',
    connected: false,
  }

  refreshContainerList = async () => {
    if (!this.state.hostname || !this.state.hostspec) return

    this.setState({
      containerDropdownOptions: [ { value: '_all', text: '.. connecting ..' } ],
      containerId: '_all',
      connected: false,
    })

    // set up a new context, then fetch container and cgroup details
    const pmapi = `http://${this.state.hostname}:7402/pmapi`
    let res = await superagent
      .get(`${pmapi}/context`)
      .query({ exclusive: 1, hostspec: this.state.hostspec, polltimeout: 5 })
    const context = res.body.context

    // TODO next two fetches in parallel
    res = await superagent
      .get(`${pmapi}/${context}/_fetch?names=containers.name`)
    const containers = res.body.values[0].instances

    // need to do this second fetch and join to make sure we get genuine containers
    res = await superagent
      .get(`${pmapi}/${context}/_fetch?names=containers.cgroup`)
    const cgroups = res.body.values[0].instances

    // TODO refactor to a proper some()
    // containerList = list of all containers.value where container.instance is present in containerlist
    const containerList = cgroups.map(({ instance, value }) => ({
      instance,
      cgroup: value,
      containerId: containers.find(cont => cont.instance === instance).value
    }))

    const containerDropdownOptions = []
      .concat({ text: 'All', value: '_all' })
      .concat(containerList.map(({ containerId }) => ({ text: containerId, value: containerId, })))

    this.setState({ containerDropdownOptions, containerId: '_all', connected: true })
  }

  handleHostnameChange = (e, { value }) => {
    this.setState({ hostname: value }, this.refreshContainerList)
  }

  handleHostspecChange = (e, { value }) => {
    this.setState({ hostspec: value }, this.refreshContainerList)
  }

  handleContainerChange = (e, { value }) => {
    this.setState({ containerId: value })
  }

  handleClose = () => this.setState({ modalOpen: false })
  handleOpen = () => this.setState({ modalOpen: true })

  handleSubmit = () => {
    this.props.onNewContext({
      hostname: this.state.hostname,
      hostspec: this.state.hostspec,
      containerId: this.state.containerId || '_all',
    })
    this.setState({ modalOpen: false })
  }

  render () {
    return (
      <Modal open={this.state.modalOpen} trigger={<Button onClick={this.handleOpen}>Add Context</Button>} closeIcon={true} onClose={this.handleClose}>
        <Modal.Header>Add a context</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input label='Hostname' placeholder='1.2.3.4' onChange={this.handleHostnameChange} />

            <Form.Input label='Hostspec' placeholder='localhost' onChange={this.handleHostspecChange} />

            <Form.Dropdown label='Container' placeholder='Select container' fluid search selection
              disabled={!this.state.connected}
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

AddContextButton.propTypes = {
  onNewContext: PropTypes.func.isRequired,
}

export default AddContextButton
