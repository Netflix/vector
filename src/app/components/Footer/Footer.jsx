import React from 'react'
import PropTypes from 'prop-types'

class Footer extends React.PureComponent {
  render () {
    return (
      <div style={{ paddingLeft: '15px' }}>Version: {this.props.version}</div>
    )
  }
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
}

export default Footer
