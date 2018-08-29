import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveXYFrame } from "semiotic"
// import moment from 'moment'
import { scaleThreshold } from 'd3-scale'

import { uniqueFilter } from '../../utils'

const tooltipContentStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  border: '1px double #ddd',
  padding: '10px 20px',
}

// collapse dataset into a single stream as this is what the xyframe heatmap view requires
function extractHeatmapValuesFromDataset(dataset, yAxisLabels) {
  const values = []
  const summary = []
  if (dataset) {
    for (let d of dataset) {
      for (let tsv of d.data) {
        if (tsv.value > 0) {
          summary.push({ ts: tsv.ts, value: d.instance, label: yAxisLabels[d.instance] || '?', weight: tsv.value })
        }
        for (let weight = 0; weight < tsv.value; weight++) {
          values.push({ ts: tsv.ts, value: d.instance, label: yAxisLabels[d.instance] || '?' })
        }
      }
    }
  }
  return values
}

function determineThresholds(chartInfo) {
  // works because input values are ranged [0,1], so we can just multiply out
  // but we need to put the first value back to ensure the 0/1 transition works
  if (chartInfo.heatmapMaxValue > 0) {
    let newThresholds = chartInfo.heatmap.thresholds.map(e => e * chartInfo.heatmapMaxValue)
    newThresholds[0] = chartInfo.heatmap.thresholds[0]

    return scaleThreshold()
      .domain(newThresholds)
      .range(chartInfo.heatmap.colors)
  }

  // default scale
  return scaleThreshold()
    .domain(chartInfo.heatmap.thresholds)
    .range(chartInfo.heatmap.colors)
}

class Heatmap extends React.PureComponent {
  render () {
    const { chartInfo, dataset } = this.props

    const thresholds = determineThresholds(chartInfo)
    const yAxisLookup = (dataset && dataset.map(mi => mi.yAxisLabels) || []).filter(uniqueFilter)
    const heatmapValues = extractHeatmapValuesFromDataset(dataset, yAxisLookup)

    if (! (dataset.every(d => d.data.length > 0) && heatmapValues.length > 0)) {
      return <span>Insufficient data</span>
    }

    return (
      <ResponsiveXYFrame
        responsiveWidth={true}
        responsiveHeight={true}
        areas={[{ coordinates: heatmapValues }]}
        areaType={{ type: 'heatmap', xBins: dataset[0].data.length, yBins: yAxisLookup.length }}
        xAccessor={d => d.ts}
        yAccessor={d => d.value}
        areaStyle={d => ({
          fill: thresholds(chartInfo.heatmapMaxValue > 0 ? d.value : d.percent),
          stroke: 'lightgrey'
        })}
        margin={{ left: 60, bottom: 30, right: 8, top: 8 }}
        yExtent={[0, yAxisLookup.length]}
        hoverAnnotation={true}
        tooltipContent={dp => (
          dp.binItems.length
            ? <div style={tooltipContentStyle}>
              <p>{dp.binItems.length && dp.binItems[0].label}: {dp.binItems.length}</p>
            </div>
            : null
        )}
        axes={[
          {
            orient: "left",
            // zzzztickFormat: v => yAxisLookup[v - 1] || '',
            // ticks: yAxisLookup && yAxisLookup.length,
            // tickValues: yAxisLookup,
          },
        ]}
        baseMarkProps={{ transitionDuration: { default: 10 } }} />
    )
  }
}

Heatmap.propTypes = {
  dataset: PropTypes.array.isRequired,
  chartInfo: PropTypes.object.isRequired,
}

export default Heatmap

/*
        axesz={[
          {
            orient: "left",
            zzzztickFormat: v => yAxisLookup[v - 1] || '',
            ticks: yAxisLookup && yAxisLookup.length,
            tickValues: yAxisLookup,
          },
          {
            orient: "bottom",
            zzzztickFormat: ts => moment(ts).format('hh:mm:ss'),
            ticks: 4,
          }
        ]}
        */
