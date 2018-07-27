import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstancesForMetric,
} from './utils'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config, instanceDomainMappings, containerList) {
  const instances = extractInstancesForMetric(datasets, config.metricNames)
  if (instances.length == 0) return null
  const transforms = config.transforms || []

  // create an entry for each instance name
  const data = instances
    // core metric accumulation
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

  let transformed = data
  // TODO passing the instance domain mappings through here is super ugly, how can we get this up to the transform level at instantiation?
  // perhaps the charts should not be an object, but a function that returns an object
  // that way we could pass params to it that it can store? or a class?
  // console.log('doing transforms;;')
  transforms.forEach(fn => {
    transformed = fn(transformed, { instanceDomainMappings, containerList })
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
