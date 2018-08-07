import React from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, Form } from 'semantic-ui-react'

class AddContextButton extends React.Component {
  state = {
    modalOpen: false
  }

  handleHostnameChange = (e, { value }) => this.setState({ hostname: value })
  handleHostspecChange = (e, { value }) => this.setState({ hostspec: value })
  handleContainerChange = (e, { value }) => this.setState({ containerId: value })

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
    // TODO load a container list from the host
    return (
      <Modal open={this.state.modalOpen} trigger={<Button onClick={this.handleOpen}>Add Context</Button>} closeIcon={true} onClose={this.handleClose}>
        <Modal.Header>Add a context</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input label='Hostname' placeholder='1.2.3.4' onChange={this.handleHostnameChange} />

            <Form.Input label='Hostspec' placeholder='localhost' onChange={this.handleHostspecChange} />

            <Form.Dropdown label='Container' placeholder='Select container' fluid search selection
              value={null}
              options={[ { key: 'container', text: 'container', name: 'container' } ]}
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
