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

import { Segment } from 'semantic-ui-react'

const generateTooltipIconStyle = (color) => ({
  width: '10px',
  height: '10px',
  backgroundColor: color,
  display: 'inline-block',
  position: 'absolute',
  top: '8px',
  left: '0',
  margin: '0',
})

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255)", minWidth: "max-content", whiteSpace: 'nowrap'}
}

class ChartTooltip extends React.PureComponent {
  render () {
    const { header, points, format } = this.props

    return (
      <Segment style={tooltipStyles.wrapper} >
        <div key={'header_multi'} style={tooltipStyles.header} >
          {header}
        </div>
        { points.map((point, i) =>
          <div key={`tooltip_line_${i}`} style={tooltipStyles.lineItem} >
            <p style={generateTooltipIconStyle(point.color)} />
            <p style={tooltipStyles.title}>{point.keylabel}</p>
            <p style={tooltipStyles.value}>{format(point.value && point.value.value)}</p>
          </div>
        )}
      </Segment>
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
