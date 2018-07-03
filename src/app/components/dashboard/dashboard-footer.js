import React from 'react'

export default class DashboardFooter extends React.Component {
  render() {
    return (
      <div className="row version-div">Version: {this.props.version}</div>
    )
  }
}
