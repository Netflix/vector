import React from 'react'
import PropTypes from 'prop-types'

function DashboardFooter({ version }) {
  return <div className="row version-div">Version: {version}</div>
}

DashboardFooter.propTypes = {
  version: PropTypes.string.isRequired
}

export default DashboardFooter
