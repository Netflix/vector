import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstancesForMetric,
} from './utils'

import {
  defaultTitleAndKeylabel,
  cumulativeTransform,
  mathAllValues,
  toPercentage,
} from './transforms'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, { settings }, context) {
  const instances = extractInstancesForMetric(datasets, settings.metricName)
  if (instances.length == 0) return null

  // create an entry for each instance name
  const data = instances
    .map(({ metric, instance }) => ({
      metric,
      instance,
      data: datasets
        .map(ds => ({
          ts: createTimestampFromDataset(ds),
          value: extractValueFromChartDataForInstance(ds, metric, instance)
        }))
        .filter(ds => ds.value !== null)
    }))

  const transforms = constructTransformPipeline(settings)
  let transformed = data
  transforms.forEach(fn => {
    transformed = fn(transformed, context)
  })
  return transformed
}

/**
 * Creates the transform pipeline for the custom metric
 */
function constructTransformPipeline(settings) {
  let transforms = []
  transforms.push(defaultTitleAndKeylabel)
  if (settings.cumulative) {
    transforms.push(cumulativeTransform)
  }
  if (settings.converted && settings.conversionFunction) {
    const conversionFunction = new Function('value', 'return ' + settings.conversionFunction + ';')
    transforms.push(mathAllValues(conversionFunction))
  }
  if (settings.percentage) {
    transforms.push(toPercentage)
  }
  return transforms
}

// TODO handle 'area' in Chart.jsx
// TODO handle 'percentage' in Chart.jsx

function requiredMetricNames({ settings }) {
  return settings.metricName || null
}

export default {
  calculateChart,
  requiredMetricNames
}
