import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import memoizeOne from 'memoize-one'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255,0.8)", minWidth: "max-content", whiteSpace: "nowrap"}
}

// Search the lines for a similar x value for vertical shared tooltip
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
  // cheat the key value by using the style text since it should be unique
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

const horizontalTickLineGenerator = (axisData) => {
  const { xy } = axisData
  const style = `M${xy.x1},${xy.y1}L${xy.x2},${xy.y1}Z`
  // cheat the key value by using the style text since it should be unique
  return <path key={style} style={{ stroke: "lightgrey" }} d={style} />
}

function fetchSharedTooltipContent(passedData, dataset, formatter) {
  const points = fetchCoincidentPoints(passedData, dataset)

  const returnArray = [
    <div key={'header_multi'} style={tooltipStyles.header} >
      {moment(new Date(passedData.ts)).format('HH:mm:ss')}
    </div>
  ];

  // provide a default formatter if none was input
  const format = formatter || ((val) => val)

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
        <p key={`tooltip_p_${i}`} style={tooltipStyles.title}>{point.keylabel}</p>
        <p key={`tooltip_p_val_${i}`} style={tooltipStyles.value}>{format(point.value && point.value.value)}</p>
      </div>
    ]);
  });

  return (
    <div style={tooltipStyles.wrapper} >
      {returnArray}
    </div>
  );
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
  color = (d) => colorHash.hex(d.keylabel)
  yExtent = [0, undefined]
  hoverAnnotation = [{ type: 'frame-hover' }]

  render () {
    const { chartInfo, dataset } = this.props

    const axes = generateAxes(chartInfo.yTickFormat)

    return (
      <ResponsiveXYFrame
        responsiveWidth={true}
        responsiveHeight={true}
        lines={dataset}
        lineDataAccessor={d => d.data}
        lineStyle={d => ({ stroke: this.color(d), fill: this.color(d), fillOpacity: 0.5 })}
        areaStyle={d => ({ stroke: this.color(d), fill: this.color(d), fillOpacity: 0.5, strokeWidth: '2px' })}
        lineType={chartInfo.lineType || 'line'}
        defined={d => d.value !== null}
        margin={{ left: 60, bottom: 30, right: 8, top: 8 }}
        xAccessor={d => d.ts}
        yAccessor={d => d.value}
        yExtent={this.yExtent}
        axes={axes}
        // line highlight
        hoverAnnotation={this.hoverAnnotation}
        tooltipContent={(d) => fetchSharedTooltipContent(d, dataset, chartInfo.yTickFormat)}
        baseMarkProps={{ forceUpdate: true }} />
    )
  }
}

Chart.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  dataset: PropTypes.array.isRequired,
}

export default Chart
