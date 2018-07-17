import {
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractValueFromChartDataAnyInstance,
  extractInstanceNamesForMetric,
} from './utils'

function nominalTsValueToIntervalTsValue(elem, index, arr) {
  if (index === 0) return []

  let prev = arr[index - 1]

  return {
    ...elem, // copy everything over and replace the value
    value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
  }
}

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const { metricName, divisorMetricName } = config
  const instanceNames = extractInstanceNamesForMetric(datasets, metricName)

  if (instanceNames.length == 0) return null

  const data = instanceNames.map(iname => { return {
    title: `${metricName} (${iname})`,
    keylabel: iname,
    data: datasets
      .map(ds => ({
        ts: createTimestampFromDataset(ds),
        value: extractValueFromChartDataForInstance(ds, metricName, iname),
        // TODO move this logic up into chart.js so this model can be generalised and reused
        // 1000 events per second per core
        divisor: extractValueFromChartDataAnyInstance(ds, divisorMetricName) * 1000
      }))
      .filter(ds => ds.value !== null && ds.divisor !== null)
      .map(nominalTsValueToIntervalTsValue)
      .slice(1) // remove the first element, since it is a dummy value
      .map(ds => ({ ts: ds.ts, value: ds.value / ds.divisor }))
      .map(ds => ({ ts: ds.ts, value: 100 * ds.value })) // * 100 to get percentage
  }})

  return data
}

function requiredMetricNames(config) {
  return [ config.metricName, config.divisorMetricName ]
}

export default {
  calculateChart,
  requiredMetricNames
}
