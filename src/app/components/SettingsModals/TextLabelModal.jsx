import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'semantic-ui-react'

const SIZES = ['tiny', 'small', 'medium', 'large', 'huge']

class TextLabelModal extends React.PureComponent {
  state = {
    content: this.props.content,
    size: this.props.size,
  }

  handleSubmit = () => {
    this.props.onNewSettings(this.state)
    this.props.onClose()
  }

  handleContentChange = (e, { value }) => this.setState({ content: value })
  handleSizeChange = (e, { value }) => this.setState({ size: value })

  render() {
    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>

        <Form.Input label='Content' value={this.state.content} onChange={this.handleContentChange}/>

        <Form.Group inline>
          <label>Size</label>
          { SIZES.map(size =>
            <Form.Radio key={size} label={size} value={size} checked={size === this.state.size} onChange={this.handleSizeChange} />
          )}
        </Form.Group>

        <Form.Button type='submit'>OK</Form.Button>
      </Form>
    )
  }
}

TextLabelModal.propTypes = {
  content: PropTypes.string.isRequired,
  size: PropTypes.oneOf(SIZES).isRequired,

  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default TextLabelModal
