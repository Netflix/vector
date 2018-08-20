import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { Button, Modal, Form } from 'semantic-ui-react'
import debounce from 'lodash.debounce'

class AddContextButton extends React.Component {
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

  refreshContainerList = async () => {
    if (!this.state.hostname || !this.state.hostport || !this.state.hostspec) return

    this.setState({
      containerDropdownOptions: [ { value: '_all', text: '.. connecting ..' } ],
      containerId: '_all',
      connected: false,
    })

    // set up a new context, then fetch container and cgroup details
    const pmapi = `http://${this.state.hostname}:${this.state.hostport}/pmapi`
    let res = await superagent
      .get(`${pmapi}/context`)
      .query({ exclusive: 1, hostspec: this.state.hostspec, polltimeout: 5 })
    const context = res.body.context

    // need to do this second fetch and join to make sure we get genuine containers
    const promisedContainerNames = superagent.get(`${pmapi}/${context}/_fetch?names=containers.name`)
    const promisedCgroups = superagent.get(`${pmapi}/${context}/_fetch?names=containers.cgroup`)

    res = await promisedContainerNames
    const containers = res.body.values.length ? res.body.values[0].instances : []
    res = await promisedCgroups
    const cgroups = res.body.values.length ? res.body.values[0].instances : []

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

  refreshContainerList = debounce(this.refreshContainerList, 500)

  handleHostnameChange = (e, { value }) => {
    this.setState({ hostname: value }, this.refreshContainerList)
  }

  handleHostportChange = (e, { value }) => {
    this.setState({ hostport: value }, this.refreshContainerList)
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
      hostname: this.state.hostname + ':' + this.state.hostport,
      hostspec: this.state.hostspec,
      containerId: this.state.containerId || '_all',
    })
    this.setState({ modalOpen: false })
  }

  render () {
    return (
      <Modal open={this.state.modalOpen} trigger={<Button onClick={this.handleOpen}>Add Context ...</Button>} closeIcon={true} onClose={this.handleClose}>
        <Modal.Header>Add a context</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>

            <Form.Input label='Hostname' onChange={this.handleHostnameChange} placeholder='1.2.3.4' />

            <Form.Input label='Port' onChange={this.handleHostportChange} value={this.state.hostport} />

            <Form.Input label='Hostspec' onChange={this.handleHostspecChange} value={this.state.hostspec} />

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
  defaultPort: PropTypes.string.isRequired,
  defaultHostspec: PropTypes.string.isRequired,
}

export default AddContextButton
