import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstancesForMetric,
} from './utils'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config, context) {
  const instances = extractInstancesForMetric(datasets, config.metricNames)
  if (instances.length == 0) return null

  // create an entry for each instance name
  const data = instances
    .map(({ metric, instance }) => ({
      metric,
      instance,
      data: datasets
        .map(ds => ({
          ts: createTimestampFromDataset(ds),
          // TODO optimise the data parse path, this is expensive when we get bigger datasets
          value: extractValueFromChartDataForInstance(ds, metric, instance)
        }))
        .filter(ds => ds.value !== null)
    }))

  const transforms = config.transforms || []
  let transformed = data
  transforms.forEach(fn => {
    transformed = fn(transformed, context)
  })
  return transformed
}

function requiredMetricNames(config) {
  return config.metricNames
}

export default {
  calculateChart,
  requiredMetricNames
}
