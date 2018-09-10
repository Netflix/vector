import React from 'react'
import PropTypes from 'prop-types'

class ErrorPanel extends React.PureComponent {
  render () {
    const { error, componentStack } = this.props

    return (
      <div>
        <p><strong>Oops! An error occured</strong></p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
      </div>
    )
  }
}

ErrorPanel.propTypes = {
  error: PropTypes.object.isRequired,
  componentStack: PropTypes.string.isRequired,
}

export default ErrorPanel
