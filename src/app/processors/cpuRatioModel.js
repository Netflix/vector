import {
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractInstancesForMetric,
  nominalTsValueToIntervalTsValue,
} from './utils'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const { metricNames, divisorMetricName } = config
  const instances = extractInstancesForMetric(datasets, metricNames)

  if (instances.length == 0) return null

  const data = instances.map(({ metric, instance }) => ({
    title: (instance === -1) ? metric : `${metric} (${instance})`,
    keylabel: (instance === -1) ? metric : `${metric} (${instance})`,
    data: datasets
      .map(ds => ({
        ts: createTimestampFromDataset(ds),
        value: extractValueFromChartDataForInstance(ds, metric, instance),
        // 1000 events per second per core
        divisor: extractValueFromChartDataForInstance(ds, divisorMetricName) * 1000
      }))
      .filter(ds => ds.value !== null && ds.divisor !== null)
      .map(nominalTsValueToIntervalTsValue)
      .slice(1) // remove the first element, since it is a dummy value
      .map(ds => ({ ts: ds.ts, value: (ds.value / ds.divisor) * 100 })) // * 100 to get percentage
  }))

  return data
}

function requiredMetricNames(config) {
  return config.metricNames.concat(config.divisorMetricName)
}

export default {
  calculateChart,
  requiredMetricNames
}
