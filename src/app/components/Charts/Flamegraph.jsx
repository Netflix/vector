import React from 'react'
import PropTypes from 'prop-types'

class Flamegraph extends React.PureComponent {
  render () {
    // const dataset = this.props.dataset

    return (
      <p>flames!</p>
    )
  }
}

Flamegraph.propTypes = {
  dataset: PropTypes.array.isRequired,
}

export default Flamegraph
