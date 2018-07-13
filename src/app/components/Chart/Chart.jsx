import React from 'react'
import PropTypes from 'prop-types'
import { XYFrame } from "semiotic"
import moment from 'moment'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

import './chart.css'

const tooltipStyles = {
  header: {fontWeight: 'bold', borderBottom: 'thin solid black', marginBottom: '10px', textAlign: 'center'},
  lineItem: {position: 'relative', display: 'block', textAlign: 'left'},
  title: {display: 'inline-block', margin: '0 5px 0 15px'},
  value: {display: 'inline-block', fontWeight: 'bold', margin: '0'},
  wrapper: {background:"rgba(255,255,255,0.8)", minWidth: "max-content", whiteSpace: "nowrap"}
}

function fetchCoincidentPoints(passedData, dataset) {
  return dataset.map((point) => {
    return {
      keylabel: point.keylabel,
      color: colorHash.hex(point.keylabel),
      value: point.data.find((i) => {
        // Search the lines for a similar x value for vertical shared tooltip
        // Can implement a 'close enough' conditional here too (fuzzy equality)
        return i.ts.getTime() === passedData.ts.getTime();
      }),
    };
  })
    .sort((a, b) => {
      return b.value.value - a.value.value;
    });
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

function fetchSharedTooltipContent(passedData, dataset) {
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
        <p key={`tooltip_p_${i}`} style={tooltipStyles.title}>{point.keylabel}</p>
        <p key={`tooltip_p_val_${i}`} style={tooltipStyles.value}>{Number(point.value.value).toFixed(2)}</p>
      </div>
    ]);
  });

  return (
    <div className="tooltip-content" style={tooltipStyles.wrapper} >
      {returnArray}
    </div>
  );
}

function Chart({ chartInfo, datasets }) {
  if (!datasets || !datasets.length) return null

  // for a single datapoint
  const dataset = chartInfo.processor.calculateChart(datasets, chartInfo.config)

  if (!dataset) return (
    <div><p>{chartInfo.title}</p><br /><p>No data</p><br /></div>
  )

  return (
    <div>
      <div>
        <p>{chartInfo.title}</p><br />
      </div>
      <div>
        <XYFrame
          size={[600, 300]}
          className='xyframe'
          lines={dataset}
          lineDataAccessor={d => d.data}
          margin={{ left: 60, bottom: 60, right: 3, top: 3 }}
          xAccessor={d => d.ts}
          yAccessor={d => d.value}
          lineStyle={d => ({ stroke: colorHash.hex(d.keylabel) })}
          yExtent={[0, undefined]}
          axes={[
            { orient: "left", tickLineGenerator: horizontalTickLineGenerator },
            { orient: "bottom",
              tickFormat: ts => moment(ts).format('hh:mm:ss'),
              tickLineGenerator: verticalTickLineGenerator,
              rotate: 90,
              ticks: Math.min(dataset[0].data.length, 12),
              size: [100, 100] }
          ]}
          // line highlight
          hoverAnnotation={[
            { type: 'vertical-points', threshold: 0.1, r: () => 5 },
            { type: 'x', disable: ['connector', 'note']},
            { type: 'frame-hover' },
          ]}
          tooltipContent={(d) => fetchSharedTooltipContent(d, dataset)}
          baseMarkProps={{ transitionDuration: 0 }} />
      </div>
    </div>
  )
}

Chart.propTypes = {
  chartInfo: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
}

export default Chart
