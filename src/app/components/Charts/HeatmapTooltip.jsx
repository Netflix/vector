import React from 'react'
import PropTypes from 'prop-types'

const tooltipContentStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  border: '1px double #ddd',
  padding: '10px 20px',
}

class HeatmapTooltip extends React.PureComponent {
  render () {
    const { label, count } = this.props

    return (
      <div style={tooltipContentStyle}>
        <p>{label}: {count}</p>
      </div>
    )
  }
}

HeatmapTooltip.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}

export default HeatmapTooltip
