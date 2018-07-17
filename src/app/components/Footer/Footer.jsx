import React from 'react'
import PropTypes from 'prop-types'

import './footer.css'

function Footer({ version }) {
  return <div className="version-div">Version: {version}</div>
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
}

export default Footer
