import {
  transformRawDataToPipelineData,
} from './modelUtils'

/**
 * Extracts all required data for a chart from the input datasets, and applies required transforms
 */
function calculateChart(datasets, chartInfo, context) {
  const data = transformRawDataToPipelineData(datasets, chartInfo)
  if (data === null || data.length === 0) return null

  const transforms = chartInfo.transforms || []

  let transformed = data
  transforms.forEach(fn => {
    transformed = fn(transformed, context)
  })

  return transformed
}

function requiredMetricNames(chartInfo) {
  return chartInfo.metricNames || []
}

export default {
  calculateChart,
  requiredMetricNames
}
