import React from 'react'
import PropTypes from 'prop-types'

const generateTooltipStyle = (color) => ({
  width: '10px',
  height: '10px',
  backgroundColor: color,
  display: 'inline-block',
  position: 'absolute',
  top: '8px',
  left: '0',
  margin: '0'
})

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255,0.8)", minWidth: "max-content", whiteSpace: "nowrap"}
}

class ChartTooltip extends React.PureComponent {
  render () {
    const { header, points, format } = this.props

    return (
      <div style={tooltipStyles.wrapper} >
        <div key={'header_multi'} style={tooltipStyles.header} >
          {header}
        </div>
        { points.map((point, i) =>
          <div key={`tooltip_line_${i}`} style={tooltipStyles.lineItem} >
            <p style={generateTooltipStyle(point.color)} />
            <p style={tooltipStyles.title}>{point.keylabel}</p>
            <p style={tooltipStyles.value}>{format(point.value && point.value.value)}</p>
          </div>
        )}
      </div>
    )
  }
}

ChartTooltip.defaultProps = {
  format: (v) => v, // if no format provided, use identity
}

ChartTooltip.propTypes = {
  header: PropTypes.string.isRequired,
  points: PropTypes.array.isRequired,
  format: PropTypes.func.isRequired,
}

export default ChartTooltip
