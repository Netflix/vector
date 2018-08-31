import React from 'react'
import PropTypes from 'prop-types'

import { select } from 'd3-selection'
import { legendColor } from 'd3-svg-legend'

const svgStyle = {
  height: '60px',
  display: 'block',
  margin: 'auto',
}

class HeatmapScale extends React.PureComponent {

  componentDidMount() {
    this.createHeatmap()
  }

  componentDidUpdate() {
    this.createHeatmap()
  }

  render () {
    return <svg ref={node => this.node = node} style={svgStyle} viewBox='-30 0 800 70' />
  }

  filterLabels = ({ i, genLength, generatedLabels }) => {
    // we want first, last, and every third label, also clean up the NaN
    return ((i === 0) || (i % 3 === 0) || (i === genLength - 1))
      ? generatedLabels[i].replace('NaN', '∞')
      : null
  }

  createHeatmap() {
    const legend = legendColor()
      .shapeHeight(30)
      .shapeWidth(30)
      .shapePadding(10)
      .labelDelimiter('-')
      .orient('horizontal')
      .scale(this.props.thresholds)
      .labelFormat('d')
      .labels(this.filterLabels)

    select(this.node)
      .append('g')
      .attr('class', 'legendLinear')

    select(this.node)
      .select('g')
      .call(legend)
  }
}

HeatmapScale.propTypes = {
  thresholds: PropTypes.func.isRequired,
}

export default HeatmapScale
