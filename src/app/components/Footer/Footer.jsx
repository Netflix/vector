import React from 'react'
import PropTypes from 'prop-types'

const footerStyle = {
  paddingLeft: '15px'
}

class Footer extends React.PureComponent {
  render () {
    const { version } = this.props

    return (
      <div style={footerStyle}>Version: {version}</div>
    )
  }
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
}

export default Footer
