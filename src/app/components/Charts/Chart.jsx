import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import memoizeOne from 'memoize-one'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()
import ErrorBoundary from 'react-error-boundary'

import ErrorPanel from '../ErrorPanel.jsx'
import ChartTooltip from './ChartTooltip.jsx'

// most of this is modelled on the semiotic examples

function fetchCoincidentPoints(passedData, dataset) {
  return dataset
    .map((point) => ({
      keylabel: point.keylabel,
      color: colorHash.hex(point.keylabel),
      value: point.data.find((i) => {
        return i.ts.getTime() === passedData.ts.getTime();
      })}))
    .filter((point) => !!point.value)
    .sort((a, b) => {
      return b.value.value - a.value.value;
    })
}

const verticalTickLineGenerator = (axisData) => {
  const { xy } = axisData
  const style = `M${xy.x1},${xy.y1}L${xy.x1},${xy.y2}Z`
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

const horizontalTickLineGenerator = (axisData) => {
  const { xy } = axisData
  const style = `M${xy.x1},${xy.y1}L${xy.x2},${xy.y1}Z`
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

const generateAxes = memoizeOne(yTickFormat => ([
  {
    orient: "left",
    tickFormat: yTickFormat,
    tickLineGenerator: horizontalTickLineGenerator
  },
  {
    orient: "bottom",
    tickFormat: ts => moment(ts).format('hh:mm:ss'),
    tickLineGenerator: verticalTickLineGenerator,
    ticks: 4
  }
]))


class Chart extends React.PureComponent {
  yExtent = [0, undefined]
  hoverAnnotation = [{ type: 'frame-hover' }]
  frameMargin = { left: 60, bottom: 60, right: 8, top: 8 }
  baseMarkProps = { forceUpdate: true }
  colorForElement = (d) => colorHash.hex(d.keylabel)
  lineStyle = (d) => ({ stroke: this.colorForElement(d), fill: this.colorForElement(d), fillOpacity: 0.5 })
  areaStyle = (d) => ({ stroke: this.colorForElement(d), fill: this.colorForElement(d), fillOpacity: 0.5, strokeWidth: '2px' })
  valueIsDefined = (d) => d.value !== null

  render () {
    const { chartInfo, dataset } = this.props
    const lineType = chartInfo.lineType || 'line'

    const axes = generateAxes(chartInfo.yTickFormat)

    return (
      <ResponsiveXYFrame
        responsiveWidth={true}
        responsiveHeight={true}
        lines={dataset}
        lineDataAccessor={'data'}
        lineStyle={this.lineStyle}
        areaStyle={this.areaStyle}
        lineType={lineType}
        defined={this.valueIsDefined}
        margin={this.frameMargin}
        xAccessor={'ts'}
        yAccessor={'value'}
        yExtent={this.yExtent}
        axes={axes}
        // line highlight
        hoverAnnotation={this.hoverAnnotation}
        tooltipContent={(passedData) =>
          <ErrorBoundary FallbackComponent={ErrorPanel}>
            <ChartTooltip
              points={fetchCoincidentPoints(passedData, dataset)}
              format={chartInfo.yTickFormat}
              header={moment(new Date(passedData.ts)).format('HH:mm:ss')} />
          </ErrorBoundary>
        }
        baseMarkProps={this.baseMarkProps} />
    )
  }
}

Chart.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  dataset: PropTypes.array.isRequired,
}

export default Chart
