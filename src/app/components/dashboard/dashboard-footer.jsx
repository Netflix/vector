import React from 'react'
import PropTypes from 'prop-types'

export default class DashboardFooter extends React.Component {
  render() {
    return (
      <div className="row version-div">Version: {this.props.version}</div>
    )
  }
}

DashboardFooter.propTypes = {
  version: PropTypes.string.isRequired
}
