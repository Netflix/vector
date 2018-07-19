import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstancesForMetric,
} from './utils'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const instances = extractInstancesForMetric(datasets, config.metricNames)
  if (instances.length == 0) return null

  // create an entry for each instance name
  const data = instances.map(({ metric, instance }) => ({
    title: (instance === -1) ? metric : `${metric} (${instance})`,
    keylabel: (instance === -1) ? metric : `${metric} (${instance})`,
    data: datasets.map(ds => {return {
      ts: createTimestampFromDataset(ds),
      value: extractValueFromChartDataForInstance(ds, metric, instance)
    }}).filter(ds => ds.value !== null)
  }))

  return data
}

function requiredMetricNames(config) {
  return config.metricNames
}

export default {
  calculateChart,
  requiredMetricNames
}
