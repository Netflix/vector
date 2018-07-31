import React from 'react'
import PropTypes from 'prop-types'

function Footer({ version }) {
  return <div style={{ paddingLeft: '15px' }}>Version: {version}</div>
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
}

export default Footer
