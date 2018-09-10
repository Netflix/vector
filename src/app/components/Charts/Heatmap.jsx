import React from 'react'
import PropTypes from 'prop-types'

import { ResponsiveXYFrame } from "semiotic"
import moment from 'moment'
import { scaleThreshold } from 'd3-scale'
import isEqual from 'lodash.isequal'
import memoizeOne from 'memoize-one'

import { uniqueFilter } from '../../utils'
import { getLargestValueInDataset } from '../../processors/modelUtils'
import HeatmapScale from './HeatmapScale.jsx'
import HeatmapTooltip from './HeatmapTooltip.jsx'

// collapse dataset into a single stream as this is what the xyframe heatmap view requires
function extractHeatmapValuesFromDataset(dataset, yAxisLabels) {
  const values = []
  if (dataset) {
    for (let d of dataset) {
      for (let tsv of d.data) {
        for (let weight = 0; weight < tsv.value; weight++) {
          values.push({ ts: tsv.ts, value: d.instance, label: yAxisLabels[d.instance] || '?' })
        }
      }
    }
  }
  return values
}

function createScale(thresholds, colors) {
  return scaleThreshold()
    .domain(thresholds)
    .range(colors)
}

// cache the scale; avoid unnecessary redrawing the heatmap which is actually quite expensive
const memoizedCreateScale = memoizeOne(createScale, isEqual)

function determineThresholds(chartInfo, dataset) {
  // works because input thresholds are ranged [0,1], so we can just multiply out
  const scaleFactor = chartInfo.heatmapMaxValue || getLargestValueInDataset(dataset) || 1
  const thresholds = chartInfo.heatmap.thresholds.map(v => v * scaleFactor)

  // but we need to put the first value back to ensure the 0/1 transition works cleanly
  // TODO potentially a bug here for super large heatmapMaxValues?
  thresholds[0] = chartInfo.heatmap.thresholds[0]

  return memoizedCreateScale(thresholds, chartInfo.heatmap.colors)
}

class Heatmap extends React.PureComponent {
  heatmapDivStyle = { height: '100%', display: 'flex', flexDirection: 'column' }
  margin = { left: 90, bottom: 30, right: 8, top: 8 }
  baseMarkProps = { forceUpdate: true }

  render () {
    const { chartInfo, dataset } = this.props

    const yAxisLookup = (dataset && dataset.map(mi => mi.yAxisLabels) || []).filter(uniqueFilter)
    const thresholds = determineThresholds(chartInfo, dataset)
    const heatmapValues = extractHeatmapValuesFromDataset(dataset, yAxisLookup)

    if (! (dataset.every(d => d.data.length > 0) && heatmapValues.length > 0)) {
      return <span>Insufficient data</span>
    }

    const areas = [{ coordinates: heatmapValues }]
    const areaType = { type: 'heatmap', xBins: dataset[0].data.length, yBins: yAxisLookup.length }

    return (<div style={this.heatmapDivStyle}>

      <HeatmapScale
        thresholds={thresholds}
        onClick={this.handleHeatmapScaleClick}/>

      <ResponsiveXYFrame
        responsiveWidth={true}
        responsiveHeight={true}
        areas={areas}
        areaType={areaType}
        useAreasAsInteractionLayer={true}
        xAccessor={'ts'}
        yAccessor={'value'}
        areaStyle={d => ({
          fill: thresholds(d.value),
          stroke: 'lightgrey'
        })}
        margin={this.margin}
        yExtent={[0, yAxisLookup.length]}
        hoverAnnotation={true}
        tooltipContent={dp => dp.binItems.length > 0
          && <HeatmapTooltip label={dp.binItems[0].label} count={dp.binItems.length} />
        }
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
        baseMarkProps={this.baseMarkProps} />
    </div>)
  }
}

Heatmap.propTypes = {
  dataset: PropTypes.array.isRequired,
  chartInfo: PropTypes.object.isRequired,
}

export default Heatmap
