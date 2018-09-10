import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import memoizeOne from 'memoize-one'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

// most of these styles etc are modelled on the semiotic examples

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255,0.8)", minWidth: "max-content", whiteSpace: "nowrap"}
}

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

function generateSharedTooltipContent(dataset, format) {
  return function _generateSharedTooltipContent(passedData) {
    const points = fetchCoincidentPoints(passedData, dataset)

    const returnArray = [
      <div key={'header_multi'} style={tooltipStyles.header} >
        {moment(new Date(passedData.ts)).format('HH:mm:ss')}
      </div>
    ];

    points.forEach((point, i) => {
      returnArray.push([
        <div key={`tooltip_line_${i}`} style={tooltipStyles.lineItem} >
          <p key={`tooltip_color_${i}`}
            style={{
              width: '10px', height: '10px',
              backgroundColor: point.color,
              display: 'inline-block', position: 'absolute',
              top: '8px',
              left: '0',
              margin: '0'
            }} />
          <p style={tooltipStyles.title}>{point.keylabel}</p>
          <p style={tooltipStyles.value}>{format(point.value && point.value.value)}</p>
        </div>
      ]);
    });

    return (
      <div style={tooltipStyles.wrapper} >
        {returnArray}
      </div>
    );
  }
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

const colorForElement = (d) => colorHash.hex(d.keylabel)
const lineStyle = (d) => ({ stroke: colorForElement(d), fill: colorForElement(d), fillOpacity: 0.5 })
const areaStyle = (d) => ({ stroke: colorForElement(d), fill: colorForElement(d), fillOpacity: 0.5, strokeWidth: '2px' })
const valueIsDefined = (d) => d.value !== null

class Chart extends React.PureComponent {
  yExtent = [0, undefined]
  hoverAnnotation = [{ type: 'frame-hover' }]
  frameMargin = { left: 60, bottom: 60, right: 8, top: 8 }
  baseMarkProps = { forceUpdate: true }

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
        lineStyle={lineStyle}
        areaStyle={areaStyle}
        lineType={lineType}
        defined={valueIsDefined}
        margin={this.frameMargin}
        xAccessor={'ts'}
        yAccessor={'value'}
        yExtent={this.yExtent}
        axes={axes}
        // line highlight
        hoverAnnotation={this.hoverAnnotation}
        tooltipContent={generateSharedTooltipContent(dataset, chartInfo.yTickFormat)}
        baseMarkProps={this.baseMarkProps} />
    )
  }
}

Chart.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  dataset: PropTypes.array.isRequired,
}

export default Chart
