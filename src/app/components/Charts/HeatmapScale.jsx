/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

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

  setNode = (node) => this.node = node

  render () {
    return <svg ref={this.setNode} style={svgStyle} viewBox='-30 0 800 70' />
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
