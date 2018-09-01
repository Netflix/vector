import React from 'react'
import PropTypes from 'prop-types'

import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import { scaleThreshold } from 'd3-scale'

import { uniqueFilter } from '../../utils'
import { getLargestValueInDataset } from '../../processors/modelUtils'
import HeatmapScale from './HeatmapScale.jsx'

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

function determineThresholds(chartInfo, dataset) {
  // works because input thresholds are ranged [0,1], so we can just multiply out
  const scaleFactor = chartInfo.heatmapMaxValue || getLargestValueInDataset(dataset) || 1
  const thresholds = chartInfo.heatmap.thresholds.map(v => v * scaleFactor)

  // but we need to put the first value back to ensure the 0/1 transition works cleanly
  // TODO potentially a bug here for super large heatmapMaxValues?
  thresholds[0] = chartInfo.heatmap.thresholds[0]

  return scaleThreshold()
    .domain(thresholds)
    .range(chartInfo.heatmap.colors)
}

class Heatmap extends React.PureComponent {
  render () {
    const { chartInfo, dataset } = this.props

    const yAxisLookup = (dataset && dataset.map(mi => mi.yAxisLabels) || []).filter(uniqueFilter)
    const thresholds = determineThresholds(chartInfo, dataset)
    const heatmapValues = extractHeatmapValuesFromDataset(dataset, yAxisLookup)

    if (! (dataset.every(d => d.data.length > 0) && heatmapValues.length > 0)) {
      return <span>Insufficient data</span>
    }

    return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HeatmapScale thresholds={thresholds} onClick={this.handleHeatmapScaleClick}/>
      <ResponsiveXYFrame
        responsiveWidth={true}
        responsiveHeight={true}
        areas={[{ coordinates: heatmapValues }]}
        areaType={{ type: 'heatmap', xBins: dataset[0].data.length, yBins: yAxisLookup.length }}
        xAccessor={d => d.ts}
        yAccessor={d => d.value}
        areaStyle={d => ({
          fill: thresholds(d.value),
          stroke: 'lightgrey'
        })}
        margin={{ left: 90, bottom: 30, right: 8, top: 8 }}
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
            tickFormat: v => yAxisLookup[v - 1] || '',
            ticks: yAxisLookup && yAxisLookup.length,
          },
          {
            orient: "bottom",
            tickFormat: ts => moment(ts).format('hh:mm:ss'),
            ticks: 4,
          }
        ]}
        baseMarkProps={{ transitionDuration: { default: 10 } }} />
    </div>)
  }
}

Heatmap.propTypes = {
  dataset: PropTypes.array.isRequired,
  chartInfo: PropTypes.object.isRequired,
}

export default Heatmap
