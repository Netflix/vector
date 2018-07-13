import React from 'react'
import PropTypes from 'prop-types'

export default class WidgetHeader extends React.Component {
  render() {
    return (
      <div className="widget-header panel-heading">
        <h3 className="panel-title">
          <span className="widget-title">{this.props.theWidget.title}</span>
          {!this.props.hideName && <span className="label label-primary">{this.props.theWidget.name}</span>}
          {!this.props.hideClose && this.props.onClose && <span title="Close widget" className="glyphicon glyphicon-remove" onClick={() => this.props.onClose(this.props.theWidget)} />}
          {!this.props.hideSettings && this.props.theWidget.hasLocalSettings && this.props.onSettings && <span title="Settings" className="glyphicon glyphicon-cog" onClick={() => this.props.onSettings(this.props.theWidget)} />}
          {this.props.theWidget.hasLocalHelp && this.props.onSettings && <span title="Help documentation" className="glyphicon glyphicon-question-sign" onClick={() => this.props.onSettings(this.props.theWidget)} />}
          {this.props.theWidget.hasHighOverhead && <span title="May cost high overhead, see help" className="glyphicon glyphicon-alert" onClick={() => this.alertHighOverhead()} />}
          {this.props.theWidget.isContainerAware && <span title="Container aware" className="glyphicon glyphicon glyphicon-ok-circle" onClick={() => this.alertContainerAware()} />}
        </h3>
      </div>
    )
  }

  alertHighOverhead() {
    alert('WARNING: May cost high overhead. See the Overhead section in the help documentation for details.')
  }

  alertContainerAware() {
    alert('If a container is selected, this widget will instrument that container only (container aware).')
  }
}

WidgetHeader.propTypes = {
  theWidget: PropTypes.object.isRequired,
  onSettings: PropTypes.func,
  onClose: PropTypes.func,
  hideName: PropTypes.bool,
  hideClose: PropTypes.bool,
  hideSettings: PropTypes.bool,
}

WidgetHeader.defaultProps = {
  hideName: false,
  hideClose: false,
  hideSettings: false,
}
