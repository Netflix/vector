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

import { Form, Button } from 'semantic-ui-react'

class FilterModal extends React.PureComponent {
  state = {
    filterText: this.props.filter
  }

  handleSubmit = () => this.props.onNewSettings({ filter: this.state.filterText })
  handleChange = (e, { value }) => this.setState({ filterText: value })
  handleCancelClick = () => this.props.onClose()

  render() {
    const { filterText } = this.state

    return (
      <Form className='doNotDrag' onSubmit={this.handleSubmit}>
        <Form.Input label='Filter' value={filterText} onChange={this.handleChange} />
        <Button type='submit'>Save</Button>
        <Button onClick={this.handleCancelClick}>Cancel</Button>
      </Form>
    )
  }
}

FilterModal.propTypes = {
  filter: PropTypes.string.isRequired,
  onNewSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

/**
 * Filter instance name by settings configured by modal (basic includes)
 *
 * @return {function} a transform function
 */
FilterModal.filterInstanceIncludesFilterText = function () {
  return function _filterInstanceIncludesFilterText (metricInstances, { chartInfo }) {
    if (!chartInfo.filter) return metricInstances
    return metricInstances.filter(mi => (mi.instance && mi.instance.includes) ? mi.instance.includes(chartInfo.filter) : true)
  }
}

export default FilterModal
