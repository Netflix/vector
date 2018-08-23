import React from 'react'
import PropTypes from 'prop-types'

import { Form, Button } from 'semantic-ui-react'

class FilterModal extends React.PureComponent {
  state = {
    filterText: this.props.filter
  }

  handleSubmit = () => this.props.onNewSettings({ filter: this.state.filterText })

  handleChange = (e, { value }) => this.setState({ filterText: value })

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input label='Filter' value={this.state.filterText} onChange={this.handleChange} />
        <Button type='submit'>Save</Button>
        <Button onClick={this.props.onClose}>Cancel</Button>
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
    return metricInstances.filter(mi => mi.instance ? mi.instance.includes(chartInfo.filter) : true)
  }
}

export default FilterModal
