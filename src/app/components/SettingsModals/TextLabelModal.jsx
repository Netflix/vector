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
